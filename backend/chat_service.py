"""Retrieval-augmented chat over a curated mental-health document.

Ingestion (once, on first boot):
    PDF -> chunks -> embeddings -> Chroma, persisted to disk.

Query (per message):
    question -> similarity search -> context + question -> prompt -> Groq.
"""

import os

from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
CHROMA_DIR = os.path.join(BASE_DIR, "chroma_db")

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
CHAT_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
RETRIEVED_CHUNKS = 4

PROMPT = ChatPromptTemplate.from_template(
    """You are a compassionate mental health chatbot.
Use the following context to answer the user's question. If the context does
not cover it, say so honestly and offer general support rather than inventing
specifics. Never diagnose. If the user expresses thoughts of self-harm, urge
them to contact a crisis line or a mental health professional immediately.

Context:
{context}

User: {question}
Chatbot:"""
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
        return ChatGroq(temperature=0, api_key=api_key, model=CHAT_MODEL)

    def _get_or_create_vector_db(self):
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

        # Reuse the persisted store when it already holds documents; building
        # it is the slow part of startup.
        if os.path.isdir(CHROMA_DIR):
            try:
                db = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
                if db._collection.count() > 0:
                    print(f"Loaded existing vector store ({db._collection.count()} chunks).")
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
        if not self.vector_db or not self.llm:
            return None

        retriever = self.vector_db.as_retriever(search_kwargs={"k": RETRIEVED_CHUNKS})

        # LCEL: the question fans out to the retriever (for context) and
        # straight through (for the question slot), then prompt -> model -> text.
        return (
            {"context": retriever | _format_docs, "question": RunnablePassthrough()}
            | PROMPT
            | self.llm
            | StrOutputParser()
        )

    def get_response(self, user_input: str) -> str:
        if not self.chain:
            return (
                "I'm sorry, I can't access my knowledge base right now. "
                "Please check that the documents are loaded and the API key is set."
            )
        try:
            return self.chain.invoke(user_input)
        except Exception as exc:
            print(f"Chat error: {exc}")
            return "I ran into a problem answering that. Please try again in a moment."


# Singleton - built once at import so the model and index load one time.
chatbot_service = ChatBotService()
