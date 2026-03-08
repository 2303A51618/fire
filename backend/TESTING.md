# Forest Fire Detection API - Local Testing Guide

## Quick Start

### 1. Setup Python Environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux
```

### 2. Create .env File
Copy `.env.example` to `.env` and update with your credentials.

### 3. Test Image Upload

#### Using cURL
```bash
# Health check
curl http://localhost:8000/health

# Make prediction (Windows)
curl -X POST http://localhost:8000/predict ^
  -F "file=@C:\path\to\test-image.jpg"

# Make prediction (Mac/Linux)
curl -X POST http://localhost:8000/predict \
  -F "file=@/path/to/test-image.jpg"
```

#### Using Python
```python
import requests

# Test health
response = requests.get("http://localhost:8000/health")
print(response.json())

# Test prediction
with open("test-image.jpg", "rb") as f:
    files = {"file": f}
    response = requests.post("http://localhost:8000/predict", files=files)
    print(response.json())
```

#### Using Postman
1. Create POST request to `http://localhost:8000/predict`
2. Go to "Body" tab
3. Select "form-data"
4. Add key "file" with type "File" and select your image
5. Send request

### 4. Interactive API Documentation
- Open http://localhost:8000/docs (Swagger UI)
- Open http://localhost:8000/redoc (ReDoc)

## Example Responses

### Health Check
```json
{
  "status": "healthy",
  "model_loaded": true,
  "database_connected": true,
  "timestamp": "2024-01-15T10:30:00.123456Z"
}
```

### Prediction Response
```json
{
  "prediction": "Fire",
  "confidence": 0.95,
  "timestamp": "2024-01-15T10:30:00.123456Z",
  "image_hash": "abc123def456..."
}
```

### Alerts List
```json
{
  "alerts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "prediction": "Fire",
      "confidence": 0.95,
      "timestamp": "2024-01-15T10:30:00.123456Z",
      "status": "triggered",
      "email_sent": true
    }
  ],
  "count": 1
}
```

### Statistics
```json
{
  "total_predictions": 150,
  "fire_predictions": 12,
  "no_fire_predictions": 138,
  "total_alerts": 8,
  "timestamp": "2024-01-15T10:30:00.123456Z"
}
```

## Test Using Docker

Create a `Dockerfile` in the `backend/` directory:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Then run:
```bash
docker build -t forest-fire-api .
docker run -p 8000:8000 --env-file .env forest-fire-api
```

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:8000/health

# Test with ApacheBench-POST (for file uploads)
# Note: Requires wrk or alternative tool
```

### Using wrk
```bash
# Health check load test
wrk -t4 -c100 -d30s http://localhost:8000/health
```

## Debugging

### Enable Debug Logging
Set `DEBUG=true` in `.env` to see detailed logs.

### Check Service Status
```bash
# Terminal 1: Run server with logs
python main.py

# Terminal 2: Check status
curl http://localhost:8000/health | python -m json.tool
```

### Test Database Connection
```python
from services.database import DatabaseService
from utils.config import get_settings

settings = get_settings()
db = DatabaseService(settings.mongo_url)
print(f"Connected: {db.is_connected()}")
print(f"Statistics: {db.get_statistics()}")
db.close()
```

### Test Email Service
```python
from services.email_service import EmailService
from utils.config import get_settings
from datetime import datetime

settings = get_settings()
email = EmailService(
    smtp_server=settings.smtp_server,
    smtp_port=settings.smtp_port,
    login=settings.smtp_login,
    password=settings.smtp_password,
    from_email=settings.alert_email_from,
)

# Test connection
print(f"Email connection OK: {email.test_connection()}")

# Send test email
email.send_alert_email(
    to_email=settings.alert_email_to,
    confidence=0.95,
    timestamp=datetime.utcnow(),
    alert_threshold=settings.alert_threshold,
)
```

## Common Issues

### ModuleNotFoundError
```bash
# Ensure you're in the backend directory
cd backend

# Verify all packages are installed
pip install -r requirements.txt
```

### Port Already in Use
```bash
# Use a different port
uvicorn main:app --port 8001
```

### Image Upload Returns 400
- Verify image is in supported format (JPG, PNG, etc.)
- Check image is not corrupted
- Ensure file size is reasonable (< 25MB)
