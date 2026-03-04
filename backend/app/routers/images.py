from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.property import Property, PropertyImage
from app.models.agent import Agent
from app.models.user import User, UserRole
from app.schemas.property import PropertyImageResponse
from app.core.dependencies import get_current_user
from app.services.supabase import upload_image

router = APIRouter(prefix="/images", tags=["images"])

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_SIZE = 5 * 1024 * 1024

@router.post("/{property_id}", response_model=PropertyImageResponse, status_code=status.HTTP_201_CREATED)
async def upload_property_image(
    property_id: int,
    is_primary: bool = False,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")

    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if current_user.role != UserRole.admin and (not agent or property.agent_id != agent.id):
        raise HTTPException(status_code=403, detail="Not authorized to upload images for this property")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP images are allowed")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File size must be under 5MB")

    url = upload_image(file_bytes, file.content_type)

    if is_primary:
        db.query(PropertyImage).filter(
            PropertyImage.property_id == property_id,
            PropertyImage.is_primary == True
        ).update({"is_primary": False})

    image = PropertyImage(property_id=property_id, url=url, is_primary=is_primary)
    db.add(image)
    db.commit()
    db.refresh(image)
    return image

@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = db.query(PropertyImage).filter(PropertyImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    property = db.query(Property).filter(Property.id == image.property_id).first()
    agent = db.query(Agent).filter(Agent.user_id == current_user.id).first()
    if current_user.role != UserRole.admin and (not agent or property.agent_id != agent.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this image")

    db.delete(image)
    db.commit()