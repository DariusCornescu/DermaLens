import tensorflow as tf
import json
import zipfile
import tempfile
import shutil
from pathlib import Path
from typing import Optional
import logging

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _strip_unknown_layer_args(config: dict) -> dict:
    """
    Recursively strip 'quantization_config' from layer configs.
    Fixes cross-version Keras compatibility when the model was saved
    with a newer Keras that includes quantization fields.
    """
    if isinstance(config, dict):
        config.pop("quantization_config", None)
        for value in config.values():
            _strip_unknown_layer_args(value)
    elif isinstance(config, list):
        for item in config:
            _strip_unknown_layer_args(item)
    return config


def _load_keras_model_compat(model_path: str) -> tf.keras.Model:
    """
    Load a .keras model with cross-version compatibility.
    Patches the saved config to remove fields unsupported by the local Keras.
    """
    tmp_dir = tempfile.mkdtemp()
    try:
        # .keras files are zip archives — extract, patch config, repack
        with zipfile.ZipFile(model_path, "r") as zf:
            zf.extractall(tmp_dir)

        config_path = Path(tmp_dir) / "config.json"
        if config_path.exists():
            with open(config_path, "r") as f:
                config = json.load(f)

            config = _strip_unknown_layer_args(config)

            with open(config_path, "w") as f:
                json.dump(config, f)

        # Repack into a temp .keras file
        patched_path = Path(tmp_dir) / "patched_model.keras"
        with zipfile.ZipFile(patched_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for file in Path(tmp_dir).rglob("*"):
                if file == patched_path:
                    continue
                if file.is_file():
                    zf.write(file, file.relative_to(tmp_dir))

        return tf.keras.models.load_model(
            str(patched_path), compile=False, safe_mode=False
        )
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


class SkinLesionModel:
    _instance: Optional["SkinLesionModel"] = None
    _model: Optional[tf.keras.Model] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if self._model is None:
            self._load_model()

    def _load_model(self):
        """Load the pre-trained Keras model."""
        model_path = Path(settings.model_path)

        if model_path.exists():
            logger.info(f"Loading model weights from {model_path}")
            try:
                # Try standard load first
                self._model = tf.keras.models.load_model(
                    str(model_path), compile=False, safe_mode=False
                )
            except (TypeError, ValueError) as e:
                # Fall back to patched load for cross-version compat
                logger.warning(f"Standard load failed ({e}), trying patched loader...")
                self._model = _load_keras_model_compat(str(model_path))

            self._model.trainable = False
            logger.info("Model loaded successfully")
        else:
            raise FileNotFoundError(
                f"Model weights not found at '{model_path}'. "
                "Please train the model on Google Colab and place the .keras file "
                "in the backend/models/ directory. See setup.sh for details."
            )

    @property
    def model(self) -> tf.keras.Model:
        return self._model

    def is_loaded(self) -> bool:
        return self._model is not None


def get_model() -> SkinLesionModel:
    """Get the singleton model instance."""
    return SkinLesionModel()
