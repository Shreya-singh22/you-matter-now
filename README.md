# 🌱 You Matter Now

**You Matter Now** is an AI-powered mental health platform designed to provide accessible, compassionate, and continuous support through technology.

The platform focuses on **self-reflection, emotional well-being, and guided mental health assistance**, helping users feel heard, supported, and empowered.

---

## ✨ Features

- 🤖 **AI Chatbot (24/7 Support)** — a retrieval-augmented chatbot that answers from a curated mental-health document rather than the model's own memory.
- 📓 **Journaling** — private entries with mood tracking and gratitude prompts, saved to your account.
- 🧠 **Self-Assessments** — anxiety and depression screening questionnaires for self-awareness.
- 👩‍⚕️ **Therapist Discovery** — find mental health professionals by city and specialty.
- 🎮 **Wellness Activities** — a memory game, a guided breathing exercise, and riddles.

---

## 🛠️ Tech Stack

**Frontend** — React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, react-hook-form + Zod
**Backend** — Python, FastAPI, SQLAlchemy, SQLite, JWT auth (python-jose) with bcrypt password hashing
**AI** — LangChain, Chroma vector store, sentence-transformers embeddings, Groq API

---

## 📁 Project Structure

```
you-matter-now/
├── src/                      # React frontend
│   ├── components/
│   │   ├── auth/             # route guard
│   │   ├── layout/           # header, footer, page shell
│   │   └── ui/               # shadcn/ui components
│   ├── context/AuthContext.tsx   # session state, backed by JWT
│   ├── lib/api.ts            # axios instance + auth interceptors
│   └── pages/                # one file per route
├── backend/                  # FastAPI service
│   ├── main.py               # app, CORS, router registration
│   ├── database.py           # engine, session, get_db dependency
│   ├── models.py             # SQLAlchemy tables
│   ├── schemas.py            # Pydantic request/response models
│   ├── dependencies.py       # hashing, JWT, get_current_user
│   ├── chat_service.py       # RAG pipeline
│   ├── routers/              # auth, journal, chat
│   └── data/                 # source PDF for the knowledge base
├── requirements.txt
└── render.yaml               # backend deployment config
```

---

## 🚀 Running Locally

You need **two terminals** — the backend and the frontend run as separate processes.

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cat > .env <<'EOF'
GROQ_API_KEY=your_groq_key_here
SECRET_KEY=any-random-string-for-local-dev
EOF

uvicorn main:app --reload --port 8000
```

The **first** start downloads the embedding model and builds the Chroma vector store from the PDF in `backend/data/`. This takes a few minutes and only happens once — afterwards `backend/chroma_db/` is reused.

Interactive API docs: **http://localhost:8000/docs**

### 2. Frontend

```bash
npm install
npm run dev
```

Visit **http://localhost:8080**. The frontend defaults to `http://localhost:8000` in development; set `VITE_API_URL` in `.env` to point somewhere else.

---

## 🔌 API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | — | Create an account, returns a JWT |
| `POST` | `/auth/login` | — | Exchange credentials for a JWT (form-encoded) |
| `GET` | `/auth/me` | ✅ | Current user profile |
| `GET` | `/journal/` | ✅ | List your entries |
| `POST` | `/journal/` | ✅ | Create an entry |
| `PUT` | `/journal/{id}` | ✅ | Update an entry |
| `DELETE` | `/journal/{id}` | ✅ | Delete an entry |
| `POST` | `/chat/` | — | Ask the RAG chatbot |

Protected routes expect `Authorization: Bearer <token>`. Journal queries are scoped to the authenticated user, so entries are never visible across accounts.

---

## 🧠 How the Chatbot Works

```
PDF → chunks (500 chars, 50 overlap) → embeddings (all-MiniLM-L6-v2)
    → Chroma vector store
                                ↓
user question → similarity search → retrieved context
    → prompt template → Groq (openai/gpt-oss-120b) → answer
```

Ingestion runs once on first boot and persists to disk. At query time the retriever pulls the most relevant chunks, and a `stuff` chain concatenates them into a single prompt.

The Groq API key lives only on the server — the browser never receives a credential.

---

## ⚠️ Known Limitations

- **SQLite on ephemeral storage** — on Render's free tier the database file is lost on redeploy. Production needs managed Postgres plus Alembic migrations.
- **No refresh tokens** — access tokens expire after 30 minutes and the user must sign in again.
- **CORS is open** (`allow_origins=["*"]`) — should be pinned to the deployed frontend origin.
- **No automated tests** — `backend/verify_backend.py` is a manual smoke script, not a test suite.
- **Screeners are not diagnostic** — shortened questionnaires for self-reflection only, as stated in the UI.
- **No crisis-detection path** — deterministic screening for self-harm language that surfaces helpline numbers is the most important outstanding safety feature.
