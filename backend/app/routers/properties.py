from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.models.property import Property, PropertyImage, ListingType, PropertyType, PropertyStatus
from app.models.agent import Agent
from app.models.user import User, UserRole
from app.schemas.property import PropertyCreate, PropertyUpdate, PropertyResponse, PropertyListResponse
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/properties", tags=["properties"])

@router.get("", response_model=PropertyListResponse)
def get_properties(
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=50),
    city: Optional[str] = None,
    type: Optional[ListingType] = None,
    property_type: Optional[PropertyType] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None,
    status: Optional[PropertyStatus] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Property)

    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if type:
        query = query.filter(Property.type == type)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if min_price:
        query = query.filter(Property.price >= min_price)
    if max_price:
        query = query.filter(Property.price <= max_price)
    if bedrooms:
        query = query.filter(Property.bedrooms >= bedrooms)
    if status:
        query = query.filter(Property.status == status)
    else:
        query = query.filter(Property.status == PropertyStatus.active)

    total = query.count()
    properties = query.offset((page - 1) * per_page).limit(per_page).all()

    return {"total": total, "page": page, "per_page": per_page, "properties": properties}

@router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: int, db: Session = Depends(get_db)):
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@router.post("", response_model=PropertyResponse, status_code=status.HTTP_201_CREATED)
def create_property(
    payload: PropertyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.agent, UserRole.admin))
):
    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if not agent and current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Agent profile required to create a listing")

    property = Property(**payload.model_dump(), agent_id=agent.id)
    db.add(property)
    db.commit()
    db.refresh(property)
    return property

@router.put("/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: int,
    payload: PropertyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if current_user.role != UserRole.admin and (not agent or property.agent_id != agent.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this property")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(property, key, value)

    db.commit()
    db.refresh(property)
    return property

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if current_user.role != UserRole.admin and (not agent or property.agent_id != agent.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this property")

    db.delete(property)
    db.commit()