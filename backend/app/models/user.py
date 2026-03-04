from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import enum

class UserRole(str, enum.Enum):
    buyer = "buyer"
    agent = "agent"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.buyer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    agent_profile = relationship("Agent", back_populates="user", uselist=False)
    favorites = relationship("Favorite", back_populates="user")
    inquiries = relationship("Inquiry", back_populates="user")