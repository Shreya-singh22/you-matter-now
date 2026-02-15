from fastapi import APIRouter, HTTPException
import schemas
from chat_service import chatbot_service

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)

@router.post("/", response_model=schemas.ChatResponse)
def chat(message: schemas.ChatMessage):
    response = chatbot_service.get_response(message.message)
    return {"response": response}
