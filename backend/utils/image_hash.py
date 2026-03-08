"""
Utility functions for image hashing and validation
"""
import hashlib
import logging
from io import BytesIO
from PIL import Image

logger = logging.getLogger(__name__)


def calculate_image_hash(image_data: bytes) -> str:
    """
    Calculate SHA256 hash of image data

    Args:
        image_data: Raw image bytes

    Returns:
        Hexadecimal hash string
    """
    try:
        hash_obj = hashlib.sha256(image_data)
        return hash_obj.hexdigest()
    except Exception as e:
        logger.error(f"Error calculating image hash: {str(e)}")
        raise


def validate_image_format(image_data: bytes) -> bool:
    """
    Validate that the data is a valid image format

    Args:
        image_data: Raw image bytes

    Returns:
        True if valid image format, False otherwise
    """
    try:
        image = Image.open(BytesIO(image_data))
        image.verify()
        return True
    except Exception as e:
        logger.warning(f"Invalid image format: {str(e)}")
        return False


def open_image_from_bytes(image_data: bytes) -> Image.Image:
    """
    Open PIL Image from bytes

    Args:
        image_data: Raw image bytes

    Returns:
        PIL Image object

    Raises:
        Exception if image cannot be opened
    """
    try:
        image = Image.open(BytesIO(image_data))
        return image
    except Exception as e:
        logger.error(f"Error opening image from bytes: {str(e)}")
        raise
