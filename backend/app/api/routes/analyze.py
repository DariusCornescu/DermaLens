from fastapi import APIRouter, UploadFile, File, HTTPException
from uuid import uuid4
import logging

from app.schemas.prediction import PredictionResponse, ErrorResponse
from app.services.preprocessing import (
    validate_image,
    load_image,
    preprocess_image
)
from app.services.inference import (
    run_inference,
    get_predictions,
    get_confidence_level,
    get_risk_message
)
from app.services.xai import generate_gradcam
from app.core.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


@router.post(
    "/analyze",
    response_model=PredictionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid input"},
        500: {"model": ErrorResponse, "description": "Server error"}
    }
)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze a dermoscopic image for skin lesion classification.

    Returns classification results with Grad-CAM explainability visualization.
    """
    # Read file content
    content = await file.read()

    # Validate image
    is_valid, message = validate_image(content, file.filename or "image.jpg")
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)

    try:
        # Load and preprocess image
        image = load_image(content)
        input_array = preprocess_image(image)

        # Run inference
        probabilities, inference_time = run_inference(input_array)

        # Get predictions
        predictions = get_predictions(probabilities, top_k=3)
        top_prediction = predictions[0]

        # Determine confidence level
        confidence_level = get_confidence_level(top_prediction.confidence)
        is_uncertain = confidence_level in ["low", "moderate"]

        # Get risk message
        risk_message = get_risk_message(top_prediction, confidence_level)

        # Generate Grad-CAM
        predicted_class_idx = settings.class_labels.index(top_prediction.class_id)
        gradcam_overlay, heatmap_only, original_image = generate_gradcam(
            image,
            target_class=predicted_class_idx
        )

        # Create response
        prediction_id = f"pred_{uuid4().hex[:12]}"

        return PredictionResponse(
            id=prediction_id,
            predicted_class=top_prediction,
            top_predictions=predictions,
            confidence_level=confidence_level,
            is_uncertain=is_uncertain,
            is_high_risk=top_prediction.is_malignant,
            risk_message=risk_message,
            gradcam_image=gradcam_overlay,
            original_image=original_image,
            heatmap_only=heatmap_only,
            model_name=settings.model_name,
            inference_time_ms=inference_time
        )

    except (FileNotFoundError, ValueError) as e:
        logger.exception("Configuration or model error during analysis")
        raise HTTPException(status_code=500, detail="Model not available. Please check server configuration.")
    except Exception as e:
        logger.exception("Unexpected error during image analysis")
        raise HTTPException(status_code=500, detail="An internal error occurred during image processing.")
