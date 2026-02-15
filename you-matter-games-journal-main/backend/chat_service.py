import os
import shutil
from langchain_groq import ChatGroq
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

class ChatBotService:
    def __init__(self):
        self.llm = self.initialise_llm()
        self.vector_db = self.get_or_create_vector_db()
        self.qa_chain = self.setup_qa_chain()

    def initialise_llm(self):
        # Ensure API key is set
        api_key = os.getenv("GROQ_API_KEY") # Use a standard env var name, fallback if needed
        print(f"DEBUG: GROQ_API_KEY loaded: {bool(api_key)}")
        if not api_key:
             # Fallback to the one hardcoded in the original script if not in env, 
             # though heavily discouraged. For now assuming env var is set.
             pass 
             
        llm = ChatGroq(
            temperature=0,
            groq_api_key=api_key,
            model_name="llama-3.3-70b-versatile"
        )
        return llm

    def get_or_create_vector_db(self):
        db_path = "./chroma_db"
        embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')
        
        if os.path.exists(db_path) and os.path.isdir(db_path):
             # Check if it's not empty or just try loading
             try:
                 vector_db = Chroma(persist_directory=db_path, embedding_function=embeddings)
                 return vector_db
             except:
                 pass

        # Create if not exists or failed to load
        print("Creating vector DB...")
        loader = DirectoryLoader("./data", glob='*.pdf', loader_cls=PyPDFLoader, show_progress=True)
        try:
            documents = loader.load()
            if not documents:
                print("No documents found in ./data")
                return None
                
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
            texts = text_splitter.split_documents(documents)
            
            vector_db = Chroma.from_documents(texts, embeddings, persist_directory=db_path)
            return vector_db
        except Exception as e:
            print(f"Error creating vector DB: {e}")
            return None

    def setup_qa_chain(self):
        if not self.vector_db:
            return None
            
        retriever = self.vector_db.as_retriever()
        prompt_template = """
        You are a compassionate mental health chatbot.
        Use the following context to answer the user's question.

        {context}

        User: {question}
        Chatbot:"""
        
        PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": PROMPT}
        )
        return qa_chain

    def get_response(self, user_input):
        if not self.qa_chain:
            return "I'm sorry, I cannot access my knowledge base right now. Please check if the documents are loaded correctly."
        
        try:
            return self.qa_chain.run(user_input)
        except Exception as e:
            return f"I encountered an error: {str(e)}"

# Singleton instance
chatbot_service = ChatBotService()
