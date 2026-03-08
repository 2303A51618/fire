"""
Unit tests for image utilities
"""
import pytest
from PIL import Image
from io import BytesIO
from utils.image_hash import calculate_image_hash, validate_image_format, open_image_from_bytes


@pytest.fixture
def sample_image_bytes():
    """Create a sample image as bytes"""
    img = Image.new("RGB", (224, 224), color="red")
    img_bytes = BytesIO()
    img.save(img_bytes, format="JPEG")
    return img_bytes.getvalue()


def test_calculate_image_hash(sample_image_bytes):
    """Test image hash calculation"""
    hash1 = calculate_image_hash(sample_image_bytes)
    hash2 = calculate_image_hash(sample_image_bytes)

    # Same image should produce same hash
    assert hash1 == hash2
    # Hash should be valid hex string
    assert len(hash1) == 64  # SHA256 produces 64 character hex string
    assert all(c in "0123456789abcdef" for c in hash1)


def test_validate_image_format(sample_image_bytes):
    """Test image format validation"""
    assert validate_image_format(sample_image_bytes) is True
    assert validate_image_format(b"invalid data") is False
    assert validate_image_format(b"") is False


def test_open_image_from_bytes(sample_image_bytes):
    """Test opening image from bytes"""
    image = open_image_from_bytes(sample_image_bytes)
    assert image is not None
    assert image.size == (224, 224)
    assert image.mode == "RGB"


def test_open_image_from_invalid_bytes():
    """Test opening invalid image bytes raises exception"""
    with pytest.raises(Exception):
        open_image_from_bytes(b"invalid data")
