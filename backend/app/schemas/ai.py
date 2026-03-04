from pydantic import BaseModel
from typing import Optional

class DescriptionRequest(BaseModel):
    title: str
    property_type: str
    listing_type: str
    bedrooms: int
    bathrooms: int
    area: float
    city: str
    state: str
    price: float
    extra_details: Optional[str] = None

class DescriptionResponse(BaseModel):
    description: str