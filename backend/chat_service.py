"""Mental-health chat, with optional retrieval augmentation.

Two modes, chosen automatically:

  Grounded  - PDF -> chunks -> embeddings -> Chroma. At query time the most
              relevant chunks are retrieved and stuffed into the prompt.
              Needs torch and an embedding model (~2GB RAM).

  Direct    - the same system prompt, no retrieval. Runs anywhere.

Retrieval turns on only when requirements-rag.txt is installed AND
ENABLE_RAG is not "false". If those imports are missing the service falls
back to direct mode instead of failing to start, so a small instance
still serves a working chatbot.
"""

import os

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()

# The retrieval stack is optional - import it defensively.
try:
    from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
    from langchain_chroma import Chroma
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_huggingface import HuggingFaceEmbeddings

    RAG_LIBS_AVAILABLE = True
except ImportError as exc:
    print(f"Retrieval libraries not installed ({exc.name}) - running in direct mode.")
    RAG_LIBS_AVAILABLE = False

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CHROMA_DIR = os.path.join(BASE_DIR, "chroma_db")

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
CHAT_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

# gpt-oss is a reasoning model: it spends tokens thinking before it writes.
# "low" keeps that to ~30 tokens instead of ~400, which both speeds up the
# reply and stops reasoning from eating the whole budget.
REASONING_EFFORT = os.getenv("GROQ_REASONING_EFFORT", "low")

# A safety net, not the length control - the prompt does that. Set high
# enough that reasoning plus a short answer always fit, so replies are
# never cut off mid-sentence.
MAX_TOKENS = int(os.getenv("GROQ_MAX_TOKENS", "400"))

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
RETRIEVED_CHUNKS = 4

ENABLE_RAG = (
    os.getenv("ENABLE_RAG", "true").lower() not in ("false", "0", "no")
    and RAG_LIBS_AVAILABLE
)

STYLE_RULES = """Style rules, follow them strictly:
- Keep the whole reply under 80 words. Two short paragraphs at most.
- Plain conversational sentences. No markdown, no bold, no headings, no
  bullet lists, no numbered lists.
- Do not restate the user's feelings back to them at length. One brief
  acknowledgement, then one concrete, practical suggestion.
- End with a single short question."""

SAFETY_RULES = """You are a compassionate mental health chatbot.
Respond with warmth and empathy. Never diagnose. Only discuss mental
health, emotional well-being and coping - politely redirect anything
else. If the user expresses thoughts of self-harm, urge them to contact a
crisis line or a mental health professional immediately."""

# Grounded mode.
RAG_PROMPT = ChatPromptTemplate.from_template(
    SAFETY_RULES
    + """

Use the context below to inform your answer. If it doesn't cover the
question, say so briefly and offer general support rather than inventing
specifics.

"""
    + STYLE_RULES
    + """

Context:
{context}

User: {question}
Chatbot:"""
)

# Direct mode.
DIRECT_PROMPT = ChatPromptTemplate.from_messages(
    [("system", f"{SAFETY_RULES}\n\n{STYLE_RULES}"), ("human", "{question}")]
)


def _format_docs(docs) -> str:
    return "\n\n".join(doc.page_content for doc in docs)


class ChatBotService:
    def __init__(self):
        self.llm = self._init_llm()
        self.vector_db = self._get_or_create_vector_db()
        self.chain = self._build_chain()

    def _init_llm(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("WARNING: GROQ_API_KEY is not set - chat requests will fail.")
            return None
        return ChatGroq(
            temperature=0.4,
            api_key=api_key,
            model=CHAT_MODEL,
            max_tokens=MAX_TOKENS,
            reasoning_effort=REASONING_EFFORT,
        )

    def _get_or_create_vector_db(self):
        if not ENABLE_RAG:
            print("Retrieval disabled - chatbot running in direct mode.")
            return None

        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

        # Reuse the persisted store when it already holds documents; building
        # it is the slow part of startup.
        if os.path.isdir(CHROMA_DIR):
            try:
                db = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
                count = db._collection.count()
                if count > 0:
                    print(f"Loaded existing vector store ({count} chunks).")
                    return db
            except Exception as exc:
                print(f"Could not load existing vector store, rebuilding: {exc}")

        print("Building vector store from ./data ...")
        try:
            documents = DirectoryLoader(
                DATA_DIR, glob="*.pdf", loader_cls=PyPDFLoader
            ).load()
            if not documents:
                print(f"No PDFs found in {DATA_DIR}.")
                return None

            chunks = RecursiveCharacterTextSplitter(
                chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
            ).split_documents(documents)

            db = Chroma.from_documents(chunks, embeddings, persist_directory=CHROMA_DIR)
            print(f"Vector store built: {len(chunks)} chunks.")
            return db
        except Exception as exc:
            print(f"Error building vector store: {exc}")
            return None

    def _build_chain(self):
        if not self.llm:
            return None

        # No vector store - answer from the system prompt alone rather than
        # failing. The chatbot stays useful; it just isn't grounded.
        if not self.vector_db:
            return DIRECT_PROMPT | self.llm | StrOutputParser()

        retriever = self.vector_db.as_retriever(search_kwargs={"k": RETRIEVED_CHUNKS})

        # LCEL: the question fans out to the retriever (for context) and
        # straight through (for the question slot), then prompt -> model -> text.
        return (
            {"context": retriever | _format_docs, "question": RunnablePassthrough()}
            | RAG_PROMPT
            | self.llm
            | StrOutputParser()
        )

    def get_response(self, user_input: str) -> str:
        if not self.chain:
            return (
                "I'm not able to respond right now because the chat service "
                "isn't configured. Please try again later."
            )
        try:
            return self.chain.invoke(user_input)
        except Exception as exc:
            print(f"Chat error: {exc}")
            return "I ran into a problem answering that. Please try again in a moment."

    @property
    def uses_retrieval(self) -> bool:
        return self.vector_db is not None


# Singleton - built once at import so the model and index load one time.
chatbot_service = ChatBotService()
