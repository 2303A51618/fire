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
from utils.exif_extractor import extract_gps_coordinates
from utils.location_utils import get_location_from_filename, generate_google_maps_url

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
        logger.info(f"Preparing model loader for {settings.model_path} (lazy load)")
        model_loader = ModelLoader(settings.model_path, load_on_init=False)

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
    alert_id: str,
    to_email: str,
    confidence: float,
    timestamp: datetime,
    alert_threshold: float,
    latitude: float = None,
    longitude: float = None,
    map_url: str = None,
    image_name: str = None,
):
    """
    Background task to send alert email

    Args:
        to_email: Recipient email
        confidence: Confidence score
        timestamp: Detection timestamp
        alert_threshold: Alert threshold value
        latitude: Fire latitude coordinate
        longitude: Fire longitude coordinate
        map_url: Google Maps URL for the fire location
        image_name: Original uploaded filename
    """
    try:
        email_sent = False
        error_message = None

        if email_service:
            email_sent = email_service.send_alert_email(
                to_email=to_email,
                confidence=confidence,
                timestamp=timestamp,
                alert_threshold=alert_threshold,
                latitude=latitude,
                longitude=longitude,
                map_url=map_url,
                image_name=image_name,
            )
            if not email_sent:
                error_message = "SMTP send failed"
        else:
            error_message = "Email service unavailable"

        if db_service and db_service.is_connected() and alert_id:
            db_service.update_alert_email_status(
                alert_id=alert_id,
                email_sent=email_sent,
                error_message=error_message,
            )

        if email_sent:
            logger.info(f"Alert email delivered for alert {alert_id}")
        else:
            logger.warning(f"Alert email not delivered for alert {alert_id}: {error_message}")
    except Exception as e:
        logger.error(f"Error in background email task: {str(e)}")
        if db_service and db_service.is_connected() and alert_id:
            db_service.update_alert_email_status(
                alert_id=alert_id,
                email_sent=False,
                error_message=str(e),
            )


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
        if model_loader is None:
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

        # Preserve the original filename and use it as location identifier.
        # Keep robust fallback for missing filename.
        raw_filename = (file.filename or "").strip()
        if raw_filename:
            image_name = raw_filename
            location_identifier = raw_filename
        else:
            image_name = "unknown_image"
            location_identifier = "unknown_location"
            logger.warning("Uploaded file is missing original filename; using fallback location identifier")

        # Open image
        image = open_image_from_bytes(image_data)

        # ── Coordinate resolution priority ──────────────────────────────────
        # 1st: filename  (e.g. "-64.384,48.64359.jpg")
        # 2nd: EXIF GPS tags embedded in the image
        # Fallback: None (map will not be shown)
        fn_lat, fn_lon, fn_map_url = get_location_from_filename(image_name or "")

        if fn_lat is not None and fn_lon is not None:
            final_latitude = fn_lat
            final_longitude = fn_lon
            map_url = fn_map_url
            logger.info(
                f"Using coordinates from filename '{image_name}': "
                f"({final_latitude}, {final_longitude})"
            )
        else:
            # Fall back to EXIF GPS data
            exif_lat, exif_lon = extract_gps_coordinates(image)
            final_latitude = exif_lat
            final_longitude = exif_lon
            map_url = generate_google_maps_url(final_latitude, final_longitude)

            if final_latitude is not None and final_longitude is not None:
                logger.info(
                    f"Using GPS coordinates from image EXIF: "
                    f"({final_latitude:.6f}, {final_longitude:.6f})"
                )
            else:
                logger.debug(
                    "No GPS coordinates found in filename or EXIF metadata"
                )

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
                latitude=final_latitude,
                longitude=final_longitude,
                map_url=map_url,
                image_name=image_name,
                location=location_identifier,
            )

        # If Fire detected above threshold, trigger alerts
        if (
            prediction == "Fire"
            and confidence > settings.alert_threshold
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
                latitude=final_latitude,
                longitude=final_longitude,
                map_url=map_url,
                image_name=image_name,
                location=location_identifier,
            )

            # Send email alert in background
            if background_tasks and email_service:
                background_tasks.add_task(
                    send_alert_email_background,
                    alert_id=alert_id,
                    to_email=settings.alert_email_to,
                    confidence=confidence,
                    timestamp=timestamp,
                    alert_threshold=settings.alert_threshold,
                    latitude=final_latitude,
                    longitude=final_longitude,
                    map_url=map_url,
                    image_name=image_name,
                )

                # Update email_sent status if alert was stored
                if alert_id:
                    logger.info(f"Background email task queued for alert {alert_id}")

        # Return response
        response = PredictionResponse(
            prediction=prediction,
            confidence=confidence,
            location=location_identifier,
            timestamp=timestamp.isoformat() + "Z",
            image_hash=image_hash,
            latitude=final_latitude,
            longitude=final_longitude,
            map_url=map_url,
            image_name=image_name,
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
