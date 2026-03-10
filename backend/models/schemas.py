from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class PredictionResponse(BaseModel):
    """Response model for fire detection prediction"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "prediction": "Fire",
                "confidence": 0.95,
                "location": "-64.384,48.64359.jpg",
                "timestamp": "2024-01-15T10:30:00Z",
                "image_hash": "abc12345...",
                "latitude": -64.384,
                "longitude": 48.64359,
                "map_url": "https://maps.google.com/?q=-64.384,48.64359",
                "image_name": "-64.384,48.64359.jpg",
            }
        }
    )

    prediction: str = Field(..., description="Fire or No Fire")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    location: Optional[str] = Field(None, description="Location identifier (original uploaded filename)")
    timestamp: str = Field(..., description="ISO format timestamp")
    image_hash: Optional[str] = Field(None, description="SHA256 hash of the image")
    latitude: Optional[float] = Field(None, description="Latitude extracted from filename or EXIF")
    longitude: Optional[float] = Field(None, description="Longitude extracted from filename or EXIF")
    map_url: Optional[str] = Field(None, description="Google Maps URL for detection coordinates")
    image_name: Optional[str] = Field(None, description="Original uploaded filename")


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
    model_config = ConfigDict(
        protected_namespaces=(),
        json_schema_extra={
            "example": {
                "status": "healthy",
                "model_loaded": True,
                "database_connected": True,
                "timestamp": "2024-01-15T10:30:00Z",
            }
        },
    )

    status: str = Field(..., description="Service status")
    model_loaded: bool = Field(..., description="Whether the model is loaded")
    database_connected: bool = Field(..., description="Whether database is connected")
    timestamp: str = Field(..., description="ISO format timestamp")

class ErrorResponse(BaseModel):
    """Response model for error responses"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "error": "Bad Request",
                "detail": "Invalid image format",
                "timestamp": "2024-01-15T10:30:00Z",
            }
        }
    )

    error: str
    detail: Optional[str] = None
    timestamp: str
