from typing import Optional, List
from pydantic import BaseModel

class MessageBase(BaseModel):
    content: str
    role: str

class MessageCreate(MessageBase):
    pass

class ChatQuery(BaseModel):
    session_id: Optional[int] = None
    message: str
    user_id: Optional[str] = None # Mainly for widget

class ChatResponse(BaseModel):
    session_id: int
    message: str
    sources: Optional[List[dict]] = None
