from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class PredictionResponse(BaseModel):
    """Response model for fire detection prediction"""
    prediction: str = Field(..., description="Fire or No Fire")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    timestamp: str = Field(..., description="ISO format timestamp")
    image_hash: Optional[str] = Field(None, description="SHA256 hash of the image")

    class Config:
        json_schema_extra = {
            "example": {
                "prediction": "Fire",
                "confidence": 0.95,
                "timestamp": "2024-01-15T10:30:00Z",
                "image_hash": "abc12345..."
            }
        }


class FireAlert(BaseModel):
    """Model for fire alert storage in MongoDB"""
    prediction: str
    confidence: float
    timestamp: datetime
    image_hash: str
    alert_threshold: float
    status: str = Field(default="triggered", description="Alert status")
    email_sent: bool = Field(default=False)


class HealthResponse(BaseModel):
    """Response model for health check endpoint"""
    status: str = Field(..., description="Service status")
    model_loaded: bool = Field(..., description="Whether the model is loaded")
    database_connected: bool = Field(..., description="Whether database is connected")
    timestamp: str = Field(..., description="ISO format timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "model_loaded": True,
                "database_connected": True,
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }


class ErrorResponse(BaseModel):
    """Response model for error responses"""
    error: str
    detail: Optional[str] = None
    timestamp: str

    class Config:
        json_schema_extra = {
            "example": {
                "error": "Bad Request",
                "detail": "Invalid image format",
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }
