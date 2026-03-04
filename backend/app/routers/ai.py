from fastapi import APIRouter, Depends, HTTPException
from app.schemas.ai import DescriptionRequest, DescriptionResponse
from app.services.groq import generate_property_description
from app.core.dependencies import require_role
from app.models.user import UserRole

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/generate-description", response_model=DescriptionResponse)
def generate_description(
    payload: DescriptionRequest,
    current_user=Depends(require_role(UserRole.agent, UserRole.admin))
):
    try:
        description = generate_property_description(
            title=payload.title,
            property_type=payload.property_type,
            listing_type=payload.listing_type,
            bedrooms=payload.bedrooms,
            bathrooms=payload.bathrooms,
            area=payload.area,
            city=payload.city,
            state=payload.state,
            price=payload.price,
            extra_details=payload.extra_details
        )
        return {"description": description}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")