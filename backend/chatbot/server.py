from fastapi import APIRouter
from pydantic import BaseModel
from chatbot import get_chatbot_response

# ✅ THIS IS WHAT MAIN.PY IMPORTS
router = APIRouter(tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    reply = get_chatbot_response(req.message)
    return {"reply": reply}
