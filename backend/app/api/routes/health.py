from fastapi import APIRouter

from app.schemas.prediction import HealthResponse
from app.core.model import get_model

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check API health and model status."""
    model_instance = get_model()
    
    return HealthResponse(
        status="healthy",
        model_loaded=model_instance.is_loaded(),
        version="0.1.0"
    )
