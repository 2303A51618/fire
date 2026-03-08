"""
MongoDB database service for storing fire detection events and alerts
"""
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, PyMongoError

logger = logging.getLogger(__name__)


class DatabaseService:
    """Handles all MongoDB operations"""

    def __init__(self, mongo_url: str):
        self.mongo_url = mongo_url
        self.client = None
        self.db = None
        self._connect()

    def _connect(self) -> None:
        """Establish connection to MongoDB"""
        try:
            self.client = MongoClient(self.mongo_url, serverSelectionTimeoutMS=5000)
            # Verify connection
            self.client.admin.command("ping")
            self.db = self.client["fire_detection"]
            logger.info("Successfully connected to MongoDB")
        except ServerSelectionTimeoutError:
            logger.error("Failed to connect to MongoDB - timeout")
            self.client = None
            self.db = None
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            self.client = None
            self.db = None

    def is_connected(self) -> bool:
        """Check if connected to database"""
        try:
            if self.client is None:
                return False
            self.client.admin.command("ping")
            return True
        except Exception:
            return False

    def store_prediction(
        self,
        prediction: str,
        confidence: float,
        timestamp: datetime,
        image_hash: str,
        alert_threshold: float,
    ) -> Optional[str]:
        """
        Store a prediction record in the database

        Args:
            prediction: "Fire" or "No Fire"
            confidence: Confidence score
            timestamp: Datetime of prediction
            image_hash: SHA256 hash of the image
            alert_threshold: Threshold used for alert

        Returns:
            Inserted document ID or None if failed
        """
        try:
            if not self.is_connected():
                logger.warning("Database not connected, skipping prediction storage")
                return None

            collection = self.db["predictions"]
            document = {
                "prediction": prediction,
                "confidence": confidence,
                "timestamp": timestamp,
                "image_hash": image_hash,
                "alert_threshold": alert_threshold,
                "created_at": datetime.utcnow(),
            }

            result = collection.insert_one(document)
            logger.info(f"Prediction stored with ID: {result.inserted_id}")
            return str(result.inserted_id)

        except PyMongoError as e:
            logger.error(f"Error storing prediction: {str(e)}")
            return None

    def store_alert(
        self,
        prediction: str,
        confidence: float,
        timestamp: datetime,
        image_hash: str,
        alert_threshold: float,
        email_sent: bool = False,
    ) -> Optional[str]:
        """
        Store a fire alert in the database

        Args:
            prediction: "Fire" or "No Fire"
            confidence: Confidence score
            timestamp: Datetime of prediction
            image_hash: SHA256 hash of the image
            alert_threshold: Threshold used for alert
            email_sent: Whether email alert was sent

        Returns:
            Inserted document ID or None if failed
        """
        try:
            if not self.is_connected():
                logger.warning("Database not connected, skipping alert storage")
                return None

            collection = self.db["alerts"]
            document = {
                "prediction": prediction,
                "confidence": confidence,
                "timestamp": timestamp,
                "image_hash": image_hash,
                "alert_threshold": alert_threshold,
                "status": "triggered",
                "email_sent": email_sent,
                "created_at": datetime.utcnow(),
                "acknowledged": False,
            }

            result = collection.insert_one(document)
            logger.info(f"Alert stored with ID: {result.inserted_id}")
            return str(result.inserted_id)

        except PyMongoError as e:
            logger.error(f"Error storing alert: {str(e)}")
            return None

    def get_recent_alerts(self, limit: int = 10) -> list:
        """
        Get recent fire alerts

        Args:
            limit: Number of alerts to retrieve

        Returns:
            List of alert documents
        """
        try:
            if not self.is_connected():
                return []

            collection = self.db["alerts"]
            alerts = list(
                collection.find()
                .sort("timestamp", -1)
                .limit(limit)
            )

            # Convert ObjectId to string for JSON serialization
            for alert in alerts:
                alert["_id"] = str(alert["_id"])

            return alerts

        except PyMongoError as e:
            logger.error(f"Error retrieving alerts: {str(e)}")
            return []

    def get_statistics(self) -> Dict[str, Any]:
        """
        Get fire detection statistics

        Returns:
            Statistics dictionary
        """
        try:
            if not self.is_connected():
                return {}

            predictions_collection = self.db["predictions"]
            alerts_collection = self.db["alerts"]

            total_predictions = predictions_collection.count_documents({})
            fire_predictions = predictions_collection.count_documents(
                {"prediction": "Fire"}
            )
            no_fire_predictions = predictions_collection.count_documents(
                {"prediction": "No Fire"}
            )
            total_alerts = alerts_collection.count_documents({})

            return {
                "total_predictions": total_predictions,
                "fire_predictions": fire_predictions,
                "no_fire_predictions": no_fire_predictions,
                "total_alerts": total_alerts,
            }

        except PyMongoError as e:
            logger.error(f"Error retrieving statistics: {str(e)}")
            return {}

    def close(self) -> None:
        """Close database connection"""
        if self.client:
            self.client.close()
            logger.info("Database connection closed")
