import time
from typing import Tuple, List
import numpy as np

from app.core.config import get_settings
from app.core.model import get_model
from app.schemas.prediction import ClassPrediction

settings = get_settings()


def run_inference(input_array: np.ndarray) -> Tuple[np.ndarray, float]:
    """
    Run model inference on preprocessed input.

    Args:
        input_array: Preprocessed numpy array with shape (1, H, W, 3)

    Returns:
        Tuple of (probabilities array, inference time in ms)
    """
    model_instance = get_model()
    model = model_instance.model

    start_time = time.perf_counter()
    predictions = model.predict(input_array, verbose=0)
    inference_time = (time.perf_counter() - start_time) * 1000

    # Apply softmax if model output isn't already probabilities
    probs = predictions[0]
    if not np.allclose(probs.sum(), 1.0, atol=0.01):
        # Apply softmax manually
        exp_probs = np.exp(probs - np.max(probs))
        probs = exp_probs / exp_probs.sum()

    return probs, inference_time


def get_predictions(probabilities: np.ndarray, top_k: int = 3) -> List[ClassPrediction]:
    """
    Get top-k predictions from probability array.
    """
    sorted_indices = np.argsort(probabilities)[::-1]

    predictions = []
    for idx in sorted_indices[:top_k]:
        class_id = settings.class_labels[idx]
        predictions.append(ClassPrediction(
            class_id=class_id,
            class_name=settings.class_display_names[class_id],
            confidence=float(probabilities[idx]),
            is_malignant=class_id in settings.malignant_classes
        ))

    return predictions


def get_confidence_level(confidence: float) -> str:
    """Determine confidence level from score."""
    if confidence >= 0.9:
        return "very-high"
    elif confidence >= settings.high_confidence_threshold:
        return "high"
    elif confidence >= settings.low_confidence_threshold:
        return "moderate"
    else:
        return "low"


def get_risk_message(predicted_class: ClassPrediction, confidence_level: str) -> str | None:
    """Generate risk message based on prediction."""
    if predicted_class.is_malignant:
        if confidence_level in ["very-high", "high"]:
            return (
                f"High-risk classification detected ({predicted_class.class_name}). "
                "Professional dermatological examination is strongly recommended."
            )
        else:
            return (
                f"Potentially concerning classification ({predicted_class.class_name}) "
                "with moderate confidence. Professional consultation advised."
            )
    return None


def calculate_entropy(probabilities: np.ndarray) -> float:
    """Calculate prediction entropy (uncertainty measure)."""
    probs = np.clip(probabilities, 1e-10, 1.0)
    entropy = -np.sum(probs * np.log(probs))
    return float(entropy)
