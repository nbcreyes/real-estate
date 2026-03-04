from pydantic import BaseModel
from datetime import datetime
from app.schemas.property import PropertyResponse

class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    property_id: int
    created_at: datetime
    property: PropertyResponse

    class Config:
        from_attributes = True