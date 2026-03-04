from pydantic import BaseModel
from typing import Optional

class AgentCreate(BaseModel):
    bio: Optional[str] = None
    phone: Optional[str] = None
    photo: Optional[str] = None
    agency: Optional[str] = None

class AgentUpdate(BaseModel):
    bio: Optional[str] = None
    phone: Optional[str] = None
    photo: Optional[str] = None
    agency: Optional[str] = None

class AgentUserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class AgentResponse(BaseModel):
    id: int
    user_id: int
    bio: Optional[str]
    phone: Optional[str]
    photo: Optional[str]
    agency: Optional[str]
    listings_count: int
    rating: float
    user: AgentUserResponse

    class Config:
        from_attributes = True