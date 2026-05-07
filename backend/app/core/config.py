from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    app_name: str = "DermaLens API"
    debug: bool = False
    
    # Model settings
    model_path: str = "models/final.keras"
    model_name: str = "efficientnet_b0"
    num_classes: int = 7
    
    # Image settings
    image_size: int = 224
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: set = {"jpg", "jpeg", "png"}
    
    # Class labels for HAM10000 dataset
    class_labels: list = [
        "akiec",  # Actinic Keratosis
        "bcc",    # Basal Cell Carcinoma
        "bkl",    # Benign Keratosis
        "df",     # Dermatofibroma
        "mel",    # Melanoma
        "nv",     # Melanocytic Nevus
        "vasc",   # Vascular Lesion
    ]
    
    # Class display names
    class_display_names: dict = {
        "akiec": "Actinic Keratosis",
        "bcc": "Basal Cell Carcinoma",
        "bkl": "Benign Keratosis",
        "df": "Dermatofibroma",
        "mel": "Melanoma",
        "nv": "Melanocytic Nevus",
        "vasc": "Vascular Lesion",
    }
    
    # Malignant classes (for risk warnings)
    malignant_classes: set = {"mel", "bcc", "akiec"}
    
    # Confidence thresholds
    high_confidence_threshold: float = 0.8
    low_confidence_threshold: float = 0.5
    
    # CORS settings
    cors_origins: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# Ensure models directory exists
def ensure_directories():
    Path("models").mkdir(exist_ok=True)
