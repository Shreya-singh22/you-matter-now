from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, dependencies
from database import get_db
import json

router = APIRouter(
    prefix="/journal",
    tags=["journal"],
)

@router.get("/", response_model=List[schemas.JournalEntry])
def read_journal_entries(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    entries = db.query(models.JournalEntry).filter(
        models.JournalEntry.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    # Parse gratitude JSON string back to list if necessary, 
    # but for simplicity we might just store it as string in DB and parse it here
    # However, Pydantic expects a list. 
    # Let's adjust the model to store it as a JSON string and parse it.
    for entry in entries:
        if isinstance(entry.gratitude, str):
            try:
                entry.gratitude = json.loads(entry.gratitude)
            except:
                entry.gratitude = []
                
    return entries

@router.post("/", response_model=schemas.JournalEntry)
def create_journal_entry(
    entry: schemas.JournalEntryCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    # Convert list to JSON string for storage
    gratitude_json = json.dumps(entry.gratitude)
    
    db_entry = models.JournalEntry(
        title=entry.title,
        content=entry.content,
        mood=entry.mood,
        gratitude=gratitude_json,
        user_id=current_user.id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    
    # Convert back to list for response
    if isinstance(db_entry.gratitude, str):
        try:
            db_entry.gratitude = json.loads(db_entry.gratitude)
        except:
            db_entry.gratitude = []
            
    return db_entry

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_journal_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    entry = db.query(models.JournalEntry).filter(
        models.JournalEntry.id == entry_id,
        models.JournalEntry.user_id == current_user.id
    ).first()
    
    if entry is None:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    db.delete(entry)
    db.commit()
    return None

@router.put("/{entry_id}", response_model=schemas.JournalEntry)
def update_journal_entry(
    entry_id: int,
    entry_update: schemas.JournalEntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    db_entry = db.query(models.JournalEntry).filter(
        models.JournalEntry.id == entry_id,
        models.JournalEntry.user_id == current_user.id
    ).first()
    
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    db_entry.title = entry_update.title
    db_entry.content = entry_update.content
    db_entry.mood = entry_update.mood
    db_entry.gratitude = json.dumps(entry_update.gratitude)
    
    db.commit()
    db.refresh(db_entry)
    
    if isinstance(db_entry.gratitude, str):
        try:
            db_entry.gratitude = json.loads(db_entry.gratitude)
        except:
            db_entry.gratitude = []
            
    return db_entry
