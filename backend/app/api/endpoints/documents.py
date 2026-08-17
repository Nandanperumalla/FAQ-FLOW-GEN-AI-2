import os
import shutil
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User as UserModel
from app.models.document import Document as DocumentModel
from app.schemas.document import Document
from app.services.rag import process_and_index_document, remove_document_from_index
from app.db.session import SessionLocal

router = APIRouter()

def process_document_background(doc_id: int, file_path: str, user_id: int):
    db = SessionLocal()
    try:
        doc = db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()
        if not doc:
            return
            
        success = process_and_index_document(file_path, str(user_id))
        
        if success:
            doc.status = "active"
        else:
            doc.status = "failed"
            
        db.commit()
    except Exception:
        db.rollback()
        doc = db.query(DocumentModel).filter(DocumentModel.id == doc_id).first()
        if doc:
            doc.status = "failed"
            db.commit()
    finally:
        db.close()
        if os.path.exists(file_path):
            os.remove(file_path)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=Document)
def upload_document(
    background_tasks: BackgroundTasks,
    *,
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_active_user),
    file: UploadFile = File(...),
) -> Any:
    """
    Upload a new FAQ document for the user.
    """
    user_id = current_user.id
        
    if not file.filename.endswith(('.pdf', '.txt', '.docx')):
        raise HTTPException(status_code=400, detail="Unsupported file type.")
        
    # Save file locally
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Create DB record
    doc = DocumentModel(
        user_id=user_id,
        filename=file.filename,
        status="processing"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    # Trigger Background Task
    background_tasks.add_task(process_document_background, doc.id, file_path, user_id)
    
    return doc

@router.get("/", response_model=List[Document])
def list_documents(
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    List all documents for the current user.
    """
    user_id = current_user.id
    docs = db.query(DocumentModel).filter(DocumentModel.user_id == user_id).all()
    return docs

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a document for the current user.
    """
    user_id = current_user.id
    doc = db.query(DocumentModel).filter(
        DocumentModel.id == document_id, 
        DocumentModel.user_id == user_id
    ).first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Delete from ChromaDB
    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{doc.filename}")
    remove_document_from_index(file_path, str(user_id))
    
    # Delete from filesystem
    if os.path.exists(file_path):
        os.remove(file_path)
        
    # Delete from DB
    db.delete(doc)
    db.commit()
    
    return {"status": "success", "message": "Document deleted successfully"}
