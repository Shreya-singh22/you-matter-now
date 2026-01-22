import os
from langchain_community.chat_models import ChatGroq
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceBgeEmbeddings
import gradio as gr

# Initialize LLM
def initialise_llm():
    groq_api_key = os.getenv('GROQ_API_KEY')  # Load API Key from Environment Variable
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set. Please set it before running the chatbot.")
    llm = ChatGroq(
        temperature=0,
        groq_api_key=groq_api_key,
        model_name="llama3-70b-8192"
    )
    return llm

# Create Vector Database
def create_vector_db():
    loader = DirectoryLoader("./data", glob='*.pdf', loader_cls=PyPDFLoader)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = text_splitter.split_documents(documents)
    embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    vector_db = Chroma.from_documents(texts, embeddings, persist_directory='./chroma_db')
    vector_db.persist()
    print("✅ Chroma DB created and data saved.")
    return vector_db

# Set up the QA chain
def setup_qa_chain(vector_db, llm):
    retriever = vector_db.as_retriever()
    prompt_template = """
    You are a compassionate mental health chatbot.
    Use the following context to answer the user's question.

    {context}

    User: {question}
    Chatbot:"""
    
    PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": PROMPT}
    )
    return qa_chain

# Initialize LLM
print("🔄 Initialising chatbot...")
llm = initialise_llm()

# Check and load/create vector DB
db_path = "./chroma_db"
if not os.path.exists(db_path):
    vector_db = create_vector_db()
else:
    embeddings = HuggingFaceBgeEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
    vector_db = Chroma(persist_directory=db_path, embedding_function=embeddings)

qa_chain = setup_qa_chain(vector_db, llm)

# Define the chatbot response function
def chatbot_response(user_input, history=[]):
    if not user_input.strip():
        return "⚠️ Please provide a valid input.", history
    response = qa_chain.run(user_input)
    history.append((user_input, response))
    return response

# Set up Gradio interface
with gr.Blocks(theme='Redair/Shiki@1.2.1') as app:
    chatbot = gr.ChatInterface(fn=chatbot_response, title="🧠 Mental Health Chatbot")

# Launch the Gradio app
app.launch(debug=True, share=True)
import langchain_community.chat_models
print(dir(langchain_community.chat_models))
