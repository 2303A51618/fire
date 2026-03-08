"""
Unit tests for API endpoints
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from PIL import Image
from io import BytesIO


@pytest.fixture
def sample_image():
    """Create a sample image file"""
    img = Image.new("RGB", (224, 224), color="green")
    img_bytes = BytesIO()
    img.save(img_bytes, format="JPEG")
    img_bytes.seek(0)
    return img_bytes


def test_health_check(test_client):
    """Test health check endpoint"""
    response = test_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "model_loaded" in data
    assert "database_connected" in data
    assert "timestamp" in data


def test_root_endpoint(test_client):
    """Test root endpoint"""
    response = test_client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "version" in data
    assert "endpoints" in data


def test_predict_no_file(test_client):
    """Test prediction endpoint without file"""
    response = test_client.post("/predict")
    assert response.status_code == 422  # Unprocessable Entity


def test_statistics_endpoint(test_client):
    """Test statistics endpoint"""
    response = test_client.get("/statistics")
    # May fail if database not connected, but should handle gracefully
    assert response.status_code in [200, 503]


def test_alerts_endpoint(test_client):
    """Test alerts endpoint"""
    response = test_client.get("/alerts")
    # May fail if database not connected, but should handle gracefully
    assert response.status_code in [200, 503]


def test_alerts_with_limit(test_client):
    """Test alerts endpoint with limit parameter"""
    response = test_client.get("/alerts?limit=5")
    assert response.status_code in [200, 503]
