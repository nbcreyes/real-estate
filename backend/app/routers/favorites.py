from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.favorite import Favorite
from app.models.property import Property
from app.models.user import User
from app.schemas.favorite import FavoriteResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])

@router.get("", response_model=List[FavoriteResponse])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Favorite).filter(Favorite.user_id == current_user.id).all()

@router.post("/{property_id}", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.property_id == property_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Property already in favorites")

    favorite = Favorite(user_id=current_user.id, property_id=property_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    property_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.property_id == property_id
    ).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(favorite)
    db.commit()