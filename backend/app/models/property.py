from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class ListingType(str, enum.Enum):
    sale = "sale"
    rent = "rent"

class PropertyType(str, enum.Enum):
    house = "house"
    apartment = "apartment"
    condo = "condo"
    land = "land"

class PropertyStatus(str, enum.Enum):
    active = "active"
    sold = "sold"
    rented = "rented"

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    type = Column(Enum(ListingType), nullable=False)
    property_type = Column(Enum(PropertyType), nullable=False)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    area = Column(Float)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(Enum(PropertyStatus), default=PropertyStatus.active)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    agent = relationship("Agent", back_populates="properties")
    images = relationship("PropertyImage", back_populates="property")
    favorites = relationship("Favorite", back_populates="property")
    inquiries = relationship("Inquiry", back_populates="property")

class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=False)
    url = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)

    property = relationship("Property", back_populates="images")