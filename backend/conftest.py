"""
Pytest configuration and fixtures
"""
import pytest
import os
from pathlib import Path
from dotenv import load_dotenv


@pytest.fixture(scope="session")
def env_setup():
    """Load environment variables from .env file"""
    env_file = Path(__file__).parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)


@pytest.fixture
def mock_settings(env_setup):
    """Create mock settings for testing"""
    from utils.config import Settings

    return Settings(
        mongo_url="mongodb://localhost:27017",
        smtp_server="smtp.example.com",
        smtp_port=587,
        smtp_login="test@example.com",
        smtp_password="test_password",
        model_path="test_model.h5",
        alert_threshold=0.70,
        alert_email_from="sender@example.com",
        alert_email_to="recipient@example.com",
        api_host="0.0.0.0",
        api_port=8000,
        environment="testing",
        debug=True,
    )


@pytest.fixture
def test_client():
    """Create FastAPI test client"""
    from fastapi.testclient import TestClient
    from main import app

    return TestClient(app)
