from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    entries = relationship("JournalEntry", back_populates="owner")

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    title = Column(String)
    content = Column(Text)
    mood = Column(String)
    gratitude = Column(Text)  # Stored as a JSON string or comma-separated
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="entries")
