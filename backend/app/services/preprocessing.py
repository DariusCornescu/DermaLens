import io
import base64
from PIL import Image
import numpy as np
import tensorflow as tf
from typing import Tuple

from app.core.config import get_settings

settings = get_settings()


def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess PIL image for model input.

    Returns a numpy array with shape (1, image_size, image_size, 3),
    normalized with ImageNet stats.
    """
    img = image.resize((settings.image_size, settings.image_size), Image.Resampling.LANCZOS)
    arr = np.array(img, dtype=np.float32)

    # Normalize with ImageNet mean/std
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32) * 255.0
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32) * 255.0
    arr = (arr - mean) / std

    # Add batch dimension
    return np.expand_dims(arr, axis=0)


def validate_image(file_content: bytes, filename: str) -> Tuple[bool, str]:
    """Validate uploaded image file."""
    # Check file extension
    ext = filename.lower().split('.')[-1] if '.' in filename else ''
    if ext not in settings.allowed_extensions:
        return False, f"Invalid file type. Allowed: {', '.join(settings.allowed_extensions)}"

    # Check file size
    if len(file_content) > settings.max_file_size:
        return False, f"File too large. Maximum size: {settings.max_file_size // (1024*1024)}MB"

    # Try to open as image
    try:
        img = Image.open(io.BytesIO(file_content))
        img.verify()
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"

    return True, "Valid"


def load_image(file_content: bytes) -> Image.Image:
    """Load image from bytes."""
    img = Image.open(io.BytesIO(file_content))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    return img


def image_to_base64(image: Image.Image, format: str = "PNG") -> str:
    """Convert PIL Image to base64 string."""
    buffer = io.BytesIO()
    image.save(buffer, format=format)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


def resize_image(image: Image.Image, size: int = None) -> Image.Image:
    """Resize image while maintaining aspect ratio."""
    if size is None:
        size = settings.image_size
    return image.resize((size, size), Image.Resampling.LANCZOS)


def numpy_to_base64(array: np.ndarray, format: str = "PNG") -> str:
    """Convert numpy array to base64 string."""
    if array.dtype != np.uint8:
        if array.max() <= 1.0:
            array = (array * 255).astype(np.uint8)
        else:
            array = array.astype(np.uint8)

    img = Image.fromarray(array)
    return image_to_base64(img, format)
