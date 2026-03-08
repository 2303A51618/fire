"""
Model loading and inference service for Keras fire detection model
"""
import logging
from pathlib import Path
from typing import Tuple, Optional
import numpy as np
from PIL import Image
import keras

logger = logging.getLogger(__name__)


class ModelLoader:
    """Handles loading and inference with the TensorFlow model"""

    def __init__(self, model_path: str):
        self.model_path = Path(model_path)
        self.model = None
        self.class_names = ["No Fire", "Fire"]
        self._load_model()

    def _load_model(self) -> None:
        """Load the TensorFlow model from disk"""
        try:
            if not self.model_path.exists():
                raise FileNotFoundError(f"Model file not found at {self.model_path}")

            # Load the H5 model
            self.model = keras.models.load_model(str(self.model_path))
            logger.info(f"Model successfully loaded from {self.model_path}")

            # Log model architecture
            logger.debug(f"Model summary: {self.model.summary()}")

        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise

    def preprocess_image(self, image: Image.Image) -> np.ndarray:
        """
        Preprocess image for model inference

        Args:
            image: PIL Image object

        Returns:
            Preprocessed numpy array ready for model input
        """
        try:
            # Resize to 128x128 (model was trained with IMG_SIZE=128)
            image = image.resize((128, 128), Image.Resampling.LANCZOS)

            # Convert to RGB if necessary (handle grayscale or RGBA)
            if image.mode != "RGB":
                image = image.convert("RGB")

            # Convert to numpy array
            img_array = np.array(image, dtype=np.float32)

            # Normalize (divide by 255)
            img_array = img_array / 255.0

            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)

            logger.debug("Image preprocessing completed successfully")
            return img_array

        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            raise

    def predict(self, image: Image.Image) -> Tuple[str, float]:
        """
        Make a prediction on the image

        Args:
            image: PIL Image object

        Returns:
            Tuple of (prediction_class, confidence_score)
        """
        try:
            if self.model is None:
                raise RuntimeError("Model is not loaded")

            # Preprocess the image
            processed_image = self.preprocess_image(image)

            # Make prediction
            prediction = self.model.predict(processed_image, verbose=0)

            # Get the probability
            confidence = float(np.max(prediction[0]))

            # Get the class (assuming binary classification output)
            class_idx = int(np.argmax(prediction[0]))
            prediction_class = self.class_names[class_idx]

            logger.debug(f"Prediction: {prediction_class}, Confidence: {confidence:.4f}")

            return prediction_class, confidence

        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            raise

    def is_loaded(self) -> bool:
        """Check if model is loaded successfully"""
        return self.model is not None
