from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InquiryCreate(BaseModel):
    property_id: int
    agent_id: int
    message: str

class InquiryResponse(BaseModel):
    id: int
    user_id: int
    property_id: int
    agent_id: int
    message: str
    created_at: datetime

    class Config:
        from_attributes = True