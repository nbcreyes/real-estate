from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.inquiry import Inquiry
from app.models.property import Property
from app.models.agent import Agent
from app.models.user import User, UserRole
from app.schemas.inquiry import InquiryCreate, InquiryResponse
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/inquiries", tags=["inquiries"])

@router.post("", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
def create_inquiry(
    payload: InquiryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = db.query(Property).filter(Property.id == payload.property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    agent = db.query(Agent).filter(Agent.id == payload.agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    inquiry = Inquiry(
        user_id=current_user.id,
        property_id=payload.property_id,
        agent_id=payload.agent_id,
        message=payload.message
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry

@router.get("", response_model=List[InquiryResponse])
def get_my_inquiries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Inquiry).filter(Inquiry.user_id == current_user.id).all()

@router.get("/agent", response_model=List[InquiryResponse])
def get_agent_inquiries(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.agent, UserRole.admin))
):
    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent profile not found")

    return db.query(Inquiry).filter(Inquiry.agent_id == agent.id).all()