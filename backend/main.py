"""
Forest Fire Detection System - FastAPI Backend
Production-ready API for forest fire detection using TensorFlow and MongoDB
"""
import logging
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import PredictionResponse, HealthResponse, ErrorResponse
from services.model_loader import ModelLoader
from services.database import DatabaseService
from services.email_service import EmailService
from utils.config import get_settings, validate_settings
from utils.logger import setup_logging
from utils.image_hash import calculate_image_hash, validate_image_format, open_image_from_bytes

# Setup logging
setup_logging(debug=False)
logger = logging.getLogger(__name__)

# Global instances
settings = None
model_loader = None
db_service = None
email_service = None


def initialize_services():
    """Initialize all services at startup"""
    global settings, model_loader, db_service, email_service

    try:
        # Load settings
        settings = get_settings()
        validate_settings(settings)
        logger.info(f"Environment: {settings.environment}")

        # Initialize model loader
        logger.info(f"Loading model from {settings.model_path}")
        model_loader = ModelLoader(settings.model_path)

        # Initialize database service
        logger.info("Initializing MongoDB connection")
        db_service = DatabaseService(settings.mongo_url)

        # Initialize email service
        logger.info("Initializing email service")
        email_service = EmailService(
            smtp_server=settings.smtp_server,
            smtp_port=settings.smtp_port,
            login=settings.smtp_login,
            password=settings.smtp_password,
            from_email=settings.alert_email_from,
        )

        # Test email connection
        if not email_service.test_connection():
            logger.warning("Email service connection test failed")

        logger.info("All services initialized successfully")

    except Exception as e:
        logger.error(f"Failed to initialize services: {str(e)}")
        raise


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    logger.info("Starting Forest Fire Detection API")
    initialize_services()
    yield
    # Shutdown
    logger.info("Shutting down Forest Fire Detection API")
    if db_service:
        db_service.close()


# Create FastAPI application
app = FastAPI(
    title="Forest Fire Detection API",
    description="Production-ready API for detecting forest fires using deep learning",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def send_alert_email_background(
    to_email: str,
    confidence: float,
    timestamp: datetime,
    alert_threshold: float,
    latitude: float = None,
    longitude: float = None,
):
    """
    Background task to send alert email

    Args:
        to_email: Recipient email
        confidence: Confidence score
        timestamp: Detection timestamp
        alert_threshold: Alert threshold value
    """
    try:
        if email_service:
            email_service.send_alert_email(
                to_email=to_email,
                confidence=confidence,
                timestamp=timestamp,
                alert_threshold=alert_threshold,
                latitude=latitude,
                longitude=longitude,
            )
    except Exception as e:
        logger.error(f"Error in background email task: {str(e)}")


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint

    Returns:
        HealthResponse with service status
    """
    try:
        model_loaded = model_loader is not None and model_loader.is_loaded()
        db_connected = db_service is not None and db_service.is_connected()

        response = HealthResponse(
            status="healthy" if (model_loaded and db_connected) else "degraded",
            model_loaded=model_loaded,
            database_connected=db_connected,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )
        return response

    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "detail": str(e),
                "timestamp": datetime.utcnow().isoformat() + "Z",
            },
        )


@app.post("/predict", response_model=PredictionResponse, tags=["Predictions"])
async def predict(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    latitude: float = Form(None),
    longitude: float = Form(None),
):
    """
    Make fire detection prediction on uploaded image

    Args:
        file: Image file to analyze
        background_tasks: Background task runner for sending alerts

    Returns:
        PredictionResponse with prediction, confidence, and timestamp
    """
    try:
        # Validate services are ready
        if model_loader is None or not model_loader.is_loaded():
            logger.error("Model not loaded")
            raise HTTPException(status_code=503, detail="Model service unavailable")

        # Read uploaded file
        image_data = await file.read()

        if not image_data:
            raise HTTPException(status_code=400, detail="Empty file received")

        # Validate image format
        if not validate_image_format(image_data):
            raise HTTPException(status_code=400, detail="Invalid image format")

        # Calculate image hash
        image_hash = calculate_image_hash(image_data)
        logger.debug(f"Processing image with hash: {image_hash}")

        # Open image
        image = open_image_from_bytes(image_data)

        # Get prediction
        prediction, confidence = model_loader.predict(image)

        # Get current timestamp
        timestamp = datetime.utcnow()

        # Store prediction in database (fire alert if threshold exceeded)
        if db_service and db_service.is_connected():
            db_service.store_prediction(
                prediction=prediction,
                confidence=confidence,
                timestamp=timestamp,
                image_hash=image_hash,
                alert_threshold=settings.alert_threshold,
                latitude=latitude,
                longitude=longitude,
            )

        # If Fire detected above threshold, trigger alerts
        if (
            prediction == "Fire"
            and confidence >= settings.alert_threshold
            and db_service
            and db_service.is_connected()
        ):
            logger.warning(
                f"FIRE ALERT: Confidence {confidence:.2%} exceeds threshold {settings.alert_threshold:.2%}"
            )

            # Store alert in database
            alert_id = db_service.store_alert(
                prediction=prediction,
                confidence=confidence,
                timestamp=timestamp,
                image_hash=image_hash,
                alert_threshold=settings.alert_threshold,
                email_sent=False,
                latitude=latitude,
                longitude=longitude,
            )

            # Send email alert in background
            if background_tasks and email_service:
                background_tasks.add_task(
                    send_alert_email_background,
                    to_email=settings.alert_email_to,
                    confidence=confidence,
                    timestamp=timestamp,
                    alert_threshold=settings.alert_threshold,
                    latitude=latitude,
                    longitude=longitude,
                )

                # Update email_sent status if alert was stored
                if alert_id:
                    logger.info(f"Background email task queued for alert {alert_id}")

        # Return response
        response = PredictionResponse(
            prediction=prediction,
            confidence=confidence,
            timestamp=timestamp.isoformat() + "Z",
            image_hash=image_hash,
            latitude=latitude,
            longitude=longitude,
        )

        logger.info(
            f"Prediction completed: {prediction} ({confidence:.2%}) - Hash: {image_hash}"
        )
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred during prediction",
        )


@app.get("/alerts", tags=["Alerts"])
async def get_recent_alerts(limit: int = 10):
    """
    Get recent fire alerts

    Args:
        limit: Number of alerts to retrieve (default: 10)

    Returns:
        List of recent alerts
    """
    try:
        if db_service is None or not db_service.is_connected():
            raise HTTPException(status_code=503, detail="Database service unavailable")

        alerts = db_service.get_recent_alerts(limit=min(limit, 100))
        return {"alerts": alerts, "count": len(alerts)}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving alerts: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving alerts")


@app.get("/statistics", tags=["Statistics"])
async def get_statistics():
    """
    Get fire detection statistics

    Returns:
        Statistics dictionary
    """
    try:
        if db_service is None or not db_service.is_connected():
            raise HTTPException(status_code=503, detail="Database service unavailable")

        stats = db_service.get_statistics()
        stats["timestamp"] = datetime.utcnow().isoformat() + "Z"
        return stats

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving statistics: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving statistics")


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with API information

    Returns:
        API information
    """
    return {
        "name": "Forest Fire Detection API",
        "version": "1.0.0",
        "description": "Production-ready API for detecting forest fires using deep learning",
        "endpoints": {
            "health": "/health",
            "predict": "POST /predict",
            "alerts": "/alerts",
            "statistics": "/statistics",
            "docs": "/docs",
            "redoc": "/redoc",
        },
    }


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Exception",
            "detail": exc.detail,
            "timestamp": datetime.utcnow().isoformat() + "Z",
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": "An unexpected error occurred",
            "timestamp": datetime.utcnow().isoformat() + "Z",
        },
    )


if __name__ == "__main__":
    import uvicorn

    app_settings = get_settings()
    uvicorn.run(
        "main:app",
        host=app_settings.api_host,
        port=app_settings.api_port,
        reload=app_settings.debug,
    )
