from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, journal, chat

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
origins = ["*"] # Allow all for now to unblock Vercel deployment

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(journal.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to You Matter Now API"}
