import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth, journal, chat
from chat_service import chatbot_service

# Create tables on boot. Fine for this project's size; a schema change on a
# live database would need Alembic.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="You Matter Now API",
    description="Auth, journalling and a retrieval-augmented mental health chatbot.",
    version="1.0.0",
)

# Comma-separated list of allowed origins, e.g.
# ALLOWED_ORIGINS=https://you-matter-now.vercel.app,http://localhost:8080
# Defaults to local development only - set it explicitly in production.
_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080,http://localhost:5173")
origins = [o.strip() for o in _origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router)
app.include_router(journal.router)
app.include_router(chat.router)


@app.get("/")
def read_root():
    return {"message": "Welcome to You Matter Now API"}


@app.get("/health")
def health():
    """Readiness probe - also reports whether retrieval is active."""
    return {
        "status": "ok",
        "chat_configured": chatbot_service.chain is not None,
        "retrieval_enabled": chatbot_service.uses_retrieval,
    }
