"""
Configuration management using Pydantic Settings
"""
import logging
from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application settings from environment variables"""

    # MongoDB Configuration
    mongo_url: str

    # SMTP Configuration
    smtp_server: str = "smtp-relay.brevo.com"
    smtp_port: int = 587
    smtp_login: str
    smtp_password: str

    # Model Configuration
    model_path: str = "../lstm_rnn_model.h5"

    # Alert Configuration
    alert_threshold: float = 0.70
    alert_email_from: str
    alert_email_to: str

    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    # Environment
    environment: str = "production"
    debug: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        # Keep pydantic's protected namespace without warning on `model_path`.
        protected_namespaces=("settings_",),
    )


@lru_cache()
def get_settings() -> Settings:
    """
    Get application settings (cached)

    Returns:
        Settings instance
    """
    return Settings()


def validate_settings(settings: Settings) -> None:
    """
    Validate critical settings at startup

    Args:
        settings: Settings instance

    Raises:
        ValueError if critical settings are missing
    """
    required_fields = [
        "mongo_url",
        "smtp_login",
        "smtp_password",
        "alert_email_from",
        "alert_email_to",
    ]

    missing_fields = []
    for field in required_fields:
        value = getattr(settings, field, None)
        if not value:
            missing_fields.append(field)

    if missing_fields:
        error_msg = f"Missing required environment variables: {', '.join(missing_fields)}"
        logger.error(error_msg)
        raise ValueError(error_msg)

    # Validate model path
    model_path = Path(settings.model_path)
    if not model_path.exists():
        logger.warning(f"Model file not found at {model_path}")

    logger.info("Settings validation completed successfully")
