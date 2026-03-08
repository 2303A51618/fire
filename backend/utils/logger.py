"""
Logging configuration for the application
"""
import logging
import logging.config
import os
from datetime import datetime
from pathlib import Path


def setup_logging(debug: bool = False) -> None:
    """
    Configure logging for the application

    Args:
        debug: Enable debug logging
    """
    log_level = logging.DEBUG if debug else logging.INFO
    
    # Ensure logs directory exists
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": log_level,
                "formatter": "standard",
                "stream": "ext://sys.stdout",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": log_level,
                "formatter": "detailed",
                "filename": "logs/app.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 10,
            },
        },
        "loggers": {
            "": {
                "level": log_level,
                "handlers": ["console", "file"],
                "propagate": True,
            },
            "uvicorn.access": {
                "level": log_level,
                "handlers": ["console"],
                "propagate": False,
            },
        },
    }

    logging.config.dictConfig(logging_config)
    logger = logging.getLogger(__name__)
    logger.info(f"Logging initialized - Level: {logging.getLevelName(log_level)}")
