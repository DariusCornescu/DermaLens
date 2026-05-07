import numpy as np
import tensorflow as tf
from PIL import Image
import cv2
from typing import Tuple, Optional

from app.core.model import get_model
from app.core.config import get_settings
from app.services.preprocessing import preprocess_image, numpy_to_base64, image_to_base64

settings = get_settings()

# Cache the grad model so we don't rebuild it every request
_grad_model: Optional[tf.keras.Model] = None


def _find_last_conv_layer_name(model: tf.keras.Model) -> Tuple[str, str]:
    """
    Find the last Conv2D layer, searching inside nested sub-models.

    Returns:
        Tuple of (backbone_layer_name, conv_layer_name)
    """
    # Search inside nested sub-models first (e.g., EfficientNet wrapped as a layer)
    for layer in model.layers:
        if isinstance(layer, tf.keras.Model):
            for sub_layer in reversed(layer.layers):
                if isinstance(sub_layer, tf.keras.layers.Conv2D):
                    return layer.name, sub_layer.name

    # Check top-level layers
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            return None, layer.name

    raise ValueError("No Conv2D layer found in model")


def _build_grad_model(model: tf.keras.Model) -> tf.keras.Model:
    """
    Build a model that outputs both the last conv layer activations
    and the final predictions, handling nested sub-models.
    """
    backbone_name, conv_name = _find_last_conv_layer_name(model)

    if backbone_name is None:
        # Conv layer is at the top level — simple case
        conv_layer = model.get_layer(conv_name)
        return tf.keras.Model(
            inputs=model.input,
            outputs=[conv_layer.output, model.output]
        )

    # Conv layer is inside a nested sub-model (e.g., efficientnetv2-b0)
    backbone = model.get_layer(backbone_name)

    # Create a modified backbone that exposes both the conv output and its final output
    modified_backbone = tf.keras.Model(
        inputs=backbone.input,
        outputs=[backbone.get_layer(conv_name).output, backbone.output]
    )

    # Rebuild the full model with the modified backbone
    inp = tf.keras.Input(shape=model.input_shape[1:])
    conv_out, backbone_features = modified_backbone(inp)

    # Pass backbone features through the remaining head layers
    x = backbone_features
    skip_layers = {"input_layer_1", backbone_name, inp.name}
    for layer in model.layers:
        if layer.name in skip_layers or isinstance(layer, tf.keras.layers.InputLayer):
            continue
        x = layer(x)

    return tf.keras.Model(inputs=inp, outputs=[conv_out, x])


def _compute_gradcam(image: Image.Image, target_class: int = None) -> np.ndarray:
    """
    Compute Grad-CAM heatmap using tf.GradientTape.

    Returns a grayscale heatmap normalized to [0, 1].
    """
    global _grad_model

    model_instance = get_model()
    model = model_instance.model

    # Build and cache the grad model
    if _grad_model is None:
        _grad_model = _build_grad_model(model)

    # Preprocess image
    input_array = preprocess_image(image)
    input_tensor = tf.constant(input_array, dtype=tf.float32)

    # Compute gradients
    with tf.GradientTape() as tape:
        conv_outputs, predictions = _grad_model(input_tensor)
        tape.watch(conv_outputs)
        if target_class is None:
            target_class = tf.argmax(predictions[0])
        loss = predictions[:, target_class]

    grads = tape.gradient(loss, conv_outputs)

    # Global average pooling of gradients
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # Weight the conv outputs by the pooled gradients
    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    # ReLU and normalize
    heatmap = tf.maximum(heatmap, 0) / (tf.math.reduce_max(heatmap) + 1e-8)
    heatmap = heatmap.numpy()

    # Resize to image dimensions
    heatmap = cv2.resize(heatmap, (settings.image_size, settings.image_size))

    return heatmap


def generate_gradcam(
    image: Image.Image,
    target_class: int = None
) -> Tuple[str, str, str]:
    """
    Generate Grad-CAM visualization for the given image.

    Returns:
        Tuple of (overlay_base64, heatmap_base64, original_base64)
    """
    grayscale_cam = _compute_gradcam(image, target_class)

    # Prepare original image for overlay
    img_resized = image.resize((settings.image_size, settings.image_size))
    img_array = np.array(img_resized).astype(np.float32) / 255.0

    # Create colored heatmap
    heatmap_colored = cv2.applyColorMap(np.uint8(255 * grayscale_cam), cv2.COLORMAP_JET)
    heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

    # Create overlay (blend original + heatmap)
    heatmap_float = heatmap_colored.astype(np.float32) / 255.0
    overlay = (0.5 * img_array + 0.5 * heatmap_float)
    overlay = np.clip(overlay, 0, 1)
    overlay = (overlay * 255).astype(np.uint8)

    # Convert to base64
    overlay_base64 = numpy_to_base64(overlay)
    heatmap_base64 = numpy_to_base64(heatmap_colored)
    original_base64 = image_to_base64(img_resized)

    return overlay_base64, heatmap_base64, original_base64
