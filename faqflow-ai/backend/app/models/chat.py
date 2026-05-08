from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    end_user_id = Column(String, nullable=True) # Identifier for the widget user
    
    messages = relationship("Message", back_populates="session")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    role = Column(String, nullable=False) # user or assistant
    content = Column(String, nullable=False)
    sources = Column(String, nullable=True) # JSON string of citations
    
    session = relationship("ChatSession", back_populates="messages")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
