from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.property import ListingType, PropertyType, PropertyStatus

class PropertyImageResponse(BaseModel):
    id: int
    url: str
    is_primary: bool

    class Config:
        from_attributes = True

class PropertyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    type: ListingType
    property_type: PropertyType
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    type: Optional[ListingType] = None
    property_type: Optional[PropertyType] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    area: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: Optional[PropertyStatus] = None

class PropertyResponse(BaseModel):
    id: int
    agent_id: int
    title: str
    description: Optional[str]
    price: float
    type: ListingType
    property_type: PropertyType
    bedrooms: Optional[int]
    bathrooms: Optional[int]
    area: Optional[float]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    status: PropertyStatus
    created_at: datetime
    images: List[PropertyImageResponse] = []

    class Config:
        from_attributes = True

class PropertyListResponse(BaseModel):
    total: int
    page: int
    per_page: int
    properties: List[PropertyResponse]