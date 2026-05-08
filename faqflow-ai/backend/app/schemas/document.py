from typing import Optional
from pydantic import BaseModel

class DocumentBase(BaseModel):
    filename: str
    status: str

class DocumentCreate(DocumentBase):
    pass

class DocumentInDBBase(DocumentBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class Document(DocumentInDBBase):
    pass
