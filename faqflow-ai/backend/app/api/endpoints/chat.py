import json
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import google.generativeai as genai

from app.api import deps
from app.core.config import settings
from app.models.user import User as UserModel
from app.models.chat import ChatSession, Message as MessageModel
from app.schemas.chat import ChatQuery, ChatResponse
from app.services.rag import query_rag

router = APIRouter()

# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)

@router.post("/", response_model=ChatResponse)
def chat_with_bot(
    *,
    db: Session = Depends(deps.get_db),
    query: ChatQuery,
    current_user: Optional[UserModel] = Depends(deps.get_current_active_user)
) -> Any:
    """
    Chat endpoint.
    If current_user is provided, we use their user_id.
    If it's the widget, we'd need an API key auth dependency, but for now we fallback to query.user_id
    """
    user_id = current_user.id if current_user else query.user_id
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID required")
        
    # Get or create session
    if query.session_id:
        session = db.query(ChatSession).filter(ChatSession.id == query.session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = ChatSession(user_id=user_id)
        db.add(session)
        db.commit()
        db.refresh(session)
        
    # Save user message
    user_msg = MessageModel(session_id=session.id, role="user", content=query.message)
    db.add(user_msg)
    db.commit()
    
    # 1. Retrieve Context from RAG
    rag_contexts = query_rag(query.message, str(user_id))
    
    context_text = "\n\n".join([f"Source: {c['source']}\nContent: {c['content']}" for c in rag_contexts])
    
    # 2. Build Prompt
    system_prompt = (
        "You are FAQFlow AI, a helpful customer support assistant. "
        "Answer the user's question using ONLY the provided context from the knowledge base. "
        "If you don't know the answer based on the context, say 'I don't have enough information to answer that.' "
        "Be polite and conversational.\n\n"
        "Context Information:\n"
        "--------------------\n"
        f"{context_text}\n"
        "--------------------\n"
    )
    
    # In a real app we'd load previous messages here
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": query.message}
    ]
    
    # 3. Call Google Gemini
    if not settings.GEMINI_API_KEY or "fake" in settings.GEMINI_API_KEY.lower():
        answer = "This is a demo response. Since no valid Gemini API key was provided in the backend, I am running in Demo Mode. To unlock real AI responses based on your documents, please configure a valid GEMINI_API_KEY."
    else:
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(
                contents=system_prompt + "\n\nUser: " + query.message,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=500,
                )
            )
            answer = response.text
        except Exception as e:
            print(f"Gemini error: {e}")
            answer = "Sorry, I am currently experiencing issues processing your request."
        
    # Save Assistant message
    sources_json = json.dumps([c['source'] for c in rag_contexts])
    assistant_msg = MessageModel(
        session_id=session.id, 
        role="assistant", 
        content=answer,
        sources=sources_json
    )
    db.add(assistant_msg)
    db.commit()
    
    return ChatResponse(
        session_id=session.id,
        message=answer,
        sources=rag_contexts
    )
