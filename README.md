# FAQFlow AI – Conversational Support Generator

FAQFlow AI is a world-class SaaS platform that instantly generates intelligent conversational support chatbots from uploaded FAQ documents using Retrieval-Augmented Generation (RAG).

## Features
- **Instant Chatbot Generation**: Upload PDFs, DOCX, or TXT files to instantly train your chatbot.
- **RAG Pipeline**: Advanced semantic search using OpenAI embeddings and ChromaDB.
- **Embeddable Widget**: A lightweight, Vanilla JS widget that can be embedded on any website.
- **SaaS Ready**: Multi-tenant architecture with JWT auth and API key support.
- **Modern Stack**: Built with FastAPI, Next.js, Tailwind CSS, SQLite, and Background Tasks.

## Architecture
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **AI Engine**: Langchain, OpenAI Embeddings & GPT-4 Turbo, ChromaDB
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Widget**: Vanilla JS (`faqflow.js`)

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- OpenAI API Key

### 1. Setup Backend
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set your OpenAI API Key
export OPENAI_API_KEY="sk-..."

# The database (faqflow.db) and ChromaDB will be initialized automatically.

# Start FastAPI server
uvicorn app.main:app --reload
\`\`\`

### 2. Setup Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### 3. Access the App
- **Web UI**: http://localhost:3000
- **API Docs**: http://localhost:8000/api/v1/openapi.json

## Deployment

We recommend using **Render** or **Railway** for easy deployment:
1. Deploy the `backend` folder as a Python web service (FastAPI). Note: You may want to configure persistent storage for SQLite and ChromaDB, or migrate to PostgreSQL and a managed Vector DB for production.
2. Deploy the `frontend` folder as a Next.js static site or Node server.

## Portfolio & Resume Value
This project demonstrates advanced skills in:
- Full-stack engineering (React/Next.js + Python/FastAPI)
- Applied AI / RAG pipelines (Langchain, Vector DBs, OpenAI)
- System Architecture (REST APIs, Background Tasks)
- Modern UI/UX implementation
