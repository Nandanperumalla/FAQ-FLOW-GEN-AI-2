import os
import chromadb
import google.generativeai as genai
from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import settings

# Initialize Chroma Client
chroma_client = chromadb.PersistentClient(path="./chroma_db")

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

def get_or_create_collection(user_id: str):
    collection_name = f"user_{user_id}"
    try:
        collection = chroma_client.get_collection(name=collection_name)
    except Exception:
        collection = chroma_client.create_collection(name=collection_name)
    return collection

def process_and_index_document(file_path: str, user_id: str) -> bool:
    try:
        # 1. Load document
        if file_path.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
            docs = loader.load()
        elif file_path.endswith('.txt'):
            loader = TextLoader(file_path)
            docs = loader.load()
        elif file_path.endswith('.docx'):
            loader = Docx2txtLoader(file_path)
            docs = loader.load()
        else:
            return False # Unsupported

        # 2. Chunking
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        splits = text_splitter.split_documents(docs)

        # 3. Embed and Store
        collection = get_or_create_collection(user_id)
        
        documents_text = [split.page_content for split in splits]
        metadatas = [{"source": file_path, "page": split.metadata.get("page", 0)} for split in splits]
        ids = [f"{os.path.basename(file_path)}_{i}" for i in range(len(splits))]
        
        if not settings.GEMINI_API_KEY or "fake" in settings.GEMINI_API_KEY.lower():
            return True

        # Get embeddings from Google Gemini
        embeddings = []
        for text in documents_text:
            try:
                response = genai.embed_content(
                    model="models/embedding-001",
                    content=text
                )
                embeddings.append(response['embedding'])
            except Exception as e:
                print(f"Error embedding text: {e}")
                return False

        collection.add(
            documents=documents_text,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
        
        return True
    except Exception as e:
        print(f"Error processing document: {e}")
        return False

def query_rag(query: str, user_id: str, k: int = 3):
    if not settings.GEMINI_API_KEY or "fake" in settings.GEMINI_API_KEY.lower():
        return [{
            "content": "This is a demo snippet because no valid Gemini key was provided. In a real scenario, this would be a chunk of text from the uploaded document.",
            "source": "demo_document.pdf"
        }]

    try:
        collection = get_or_create_collection(user_id)
        
        # Get query embedding from Google Gemini
        response = genai.embed_content(
            model="models/embedding-001",
            content=query
        )
        query_embedding = response['embedding']
        
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=k
        )
        
        if not results['documents'] or len(results['documents'][0]) == 0:
            return []
            
        contexts = []
        for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
            contexts.append({
                "content": doc,
                "source": meta.get("source", "Unknown")
            })
        return contexts
    except Exception as e:
        print(f"Error querying RAG: {e}")
        return []

def remove_document_from_index(file_path: str, user_id: str) -> bool:
    try:
        collection = get_or_create_collection(user_id)
        collection.delete(where={"source": file_path})
        return True
    except Exception as e:
        print(f"Error removing document from RAG index: {e}")
        return False
