import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Postgres in production, SQLite locally. Render hands out postgres:// URLs,
# which SQLAlchemy 2.x needs spelled postgresql://.
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    connect_args = {}
else:
    DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'you_matter.db')}"
    # SQLite guards against cross-thread use; FastAPI serves sync routes from
    # a threadpool, so that guard has to be relaxed.
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
