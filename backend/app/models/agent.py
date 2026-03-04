from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(String)
    phone = Column(String)
    photo = Column(String)
    agency = Column(String)
    listings_count = Column(Integer, default=0)
    rating = Column(Float, default=0.0)

    user = relationship("User", back_populates="agent_profile")
    properties = relationship("Property", back_populates="agent")