# FAQFlow AI - Run Instructions

### Prerequisites
Ensure no existing instances are running by checking ports `3000` and `8000`. You can free them on Mac using:
```bash
lsof -t -i:3000 -i:8000 | xargs -r kill -9
```

### 1. Run Backend (FastAPI)
Open **Terminal 1**, navigate to the backend folder, activate the virtual environment, and run the server:
```bash
cd "/Users/nandanp/Desktop/Gen ai/faqflow-ai/backend"
source venv/bin/activate
uvicorn app.main:app --reload
```
> **Note:** The backend uses local SQLite (`faqflow.db`) and local ChromaDB (`chroma_db/`), which are created automatically. API key is loaded from `.env` file. It processes documents using FastAPI Background Tasks natively!

### 2. Run Frontend (Next.js)
Open **Terminal 2**, navigate to the frontend folder, install dependencies (if not done yet), and run:
```bash
cd "/Users/nandanp/Desktop/Gen ai/faqflow-ai/frontend"
npm install
npm run dev
```

### Accessing the App
Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)
API Docs are at: [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)
