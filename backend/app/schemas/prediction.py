from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ClassPrediction(BaseModel):
    class_id: str = Field(..., description="Class identifier (e.g., 'mel', 'nv')")
    class_name: str = Field(..., description="Human-readable class name")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score between 0 and 1")
    is_malignant: bool = Field(..., description="Whether this class is considered malignant")


class PredictionResponse(BaseModel):
    id: str = Field(..., description="Unique prediction ID")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Primary prediction
    predicted_class: ClassPrediction = Field(..., description="Top predicted class")
    
    # Top-k predictions
    top_predictions: list[ClassPrediction] = Field(
        ..., 
        description="Top-k class predictions with confidence scores"
    )
    
    # Confidence analysis
    confidence_level: str = Field(
        ..., 
        description="Confidence level: 'very-high', 'high', 'moderate', 'low'"
    )
    is_uncertain: bool = Field(
        ..., 
        description="True if model confidence is below threshold"
    )
    
    # Risk assessment
    is_high_risk: bool = Field(
        ..., 
        description="True if predicted class is potentially malignant"
    )
    risk_message: Optional[str] = Field(
        None, 
        description="Risk warning message if applicable"
    )
    
    # Explainability
    gradcam_image: str = Field(
        ..., 
        description="Base64-encoded Grad-CAM heatmap overlay image"
    )
    original_image: str = Field(
        ..., 
        description="Base64-encoded original image (resized)"
    )
    heatmap_only: str = Field(
        ..., 
        description="Base64-encoded heatmap without overlay"
    )
    
    # Metadata
    model_name: str = Field(..., description="Name of the model used")
    inference_time_ms: float = Field(..., description="Inference time in milliseconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "pred_123456",
                "predicted_class": {
                    "class_id": "mel",
                    "class_name": "Melanoma",
                    "confidence": 0.87,
                    "is_malignant": True
                },
                "top_predictions": [
                    {"class_id": "mel", "class_name": "Melanoma", "confidence": 0.87, "is_malignant": True},
                    {"class_id": "nv", "class_name": "Melanocytic Nevus", "confidence": 0.08, "is_malignant": False},
                    {"class_id": "bcc", "class_name": "Basal Cell Carcinoma", "confidence": 0.03, "is_malignant": True}
                ],
                "confidence_level": "high",
                "is_uncertain": False,
                "is_high_risk": True,
                "risk_message": "High-risk classification detected. Professional examination recommended.",
                "gradcam_image": "base64...",
                "original_image": "base64...",
                "heatmap_only": "base64...",
                "model_name": "efficientnet_b0",
                "inference_time_ms": 150.5
            }
        }


class HealthResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    model_loaded: bool = Field(..., description="Whether the ML model is loaded")
    version: str = Field(default="0.1.0", description="API version")


class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[dict] = Field(None, description="Additional error details")
