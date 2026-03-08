# Forest Fire Detection System - Complete Documentation

## 📋 Project Overview

This is a **production-ready FastAPI backend** for a Forest Fire Detection System that:

- Loads a trained TensorFlow LSTM model at startup
- Accepts image uploads and makes fire detection predictions
- Stores predictions in MongoDB Atlas
- Sends email alerts when fire is detected with high confidence
- Provides monitoring endpoints and comprehensive logging
- Is configured for immediate deployment to Render.com

---

## 🏗️ Architecture

### Three-Tier Service Architecture

```
┌─────────────────────────────────────────────────────┐
│              FastAPI Application                    │
│  (main.py - HTTP endpoints, request handling)       │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┼─────────────────┐
        │         │                 │
        ↓         ↓                 ↓
   ┌──────────┐ ┌──────────┐  ┌──────────────┐
   │ Model    │ │Database  │  │ Email        │
   │ Loader   │ │ Service  │  │ Service      │
   │ (TF)     │ │ (MongoDB)│  │ (SMTP)       │
   │          │ │          │  │              │
   │TensorFlow│ │ PyMongo  │  │Python SMTP   │
   └──────────┘ └──────────┘  └──────────────┘
```

### Data Flow for Fire Detection

```
1. User uploads image
   ↓
2. main.py receives POST /predict
   ↓
3. Validate image format
   ↓
4. Calculate SHA256 hash
   ↓
5. Open image as PIL Image
   ↓
6. ModelLoader processes:
   - Resize to 224x224
   - Normalize (divide by 255)
   - Make TensorFlow prediction
   ↓
7. Get predicted class & confidence
   ↓
8. Store in MongoDB (predictions collection)
   ↓
9. If Fire AND confidence >= threshold:
   → Store in alerts collection
   → Queue email in background
   → Return response immediately
   ↓
10. Return JSON response to user
```

---

## 📁 File Structure

```
backend/
│
├── 📄 Core Application Files
│   ├── main.py                  # ⭐ FastAPI app entry point
│   ├── requirements.txt         # All Python dependencies
│   ├── .env.example             # Environment variables template
│   ├── .gitignore               # Git ignore rules
│   ├── conftest.py              # Pytest configuration
│   │
│   ├── 🐳 Docker & Deployment
│   ├── Dockerfile               # Docker container config
│   ├── docker-compose.yml       # Local Docker Compose
│   ├── Procfile                 # Render deployment config
│   ├── runtime.txt              # Python 3.11 specification
│   ├── render_build.sh          # Render build script
│   │
│   └── 📚 Documentation
│       ├── README.md             # Deployment guide
│       ├── QUICKSTART.md         # 5-minute quick start
│       ├── TESTING.md            # Testing guide
│       └── RENDER_DEPLOYMENT.md # Render-specific setup
│
├── services/                    # Core business logic
│   ├── __init__.py
│   ├── model_loader.py          # TensorFlow model loading
│   │   ├── Load model from .h5
│   │   ├── Preprocess images
│   │   └── Make predictions
│   │
│   ├── database.py              # MongoDB operations
│   │   ├── Store predictions
│   │   ├── Store alerts
│   │   ├── Retrieve stats
│   │   └── Connection management
│   │
│   └── email_service.py         # Brevo SMTP alerts
│       ├── Send alert emails
│       ├── HTML formatting
│       └── Connection testing
│
├── models/                      # Pydantic data models
│   ├── __init__.py
│   └── schemas.py               # API response schemas
│       ├── PredictionResponse
│       ├── HealthResponse
│       ├── ErrorResponse
│       └── FireAlert
│
├── utils/                       # Helper functions
│   ├── __init__.py
│   ├── config.py                # Settings management
│   │   ├── Load from .env
│   │   ├── Validate needed vars
│   │   └── Type-safe config
│   │
│   ├── logger.py                # Logging configuration
│   │   ├── Console output
│   │   ├── Rotating file logs
│   │   └── Structured formatting
│   │
│   └── image_hash.py            # Image utilities
│       ├── Calculate SHA256
│       ├── Validate format
│       └── Open from bytes
│
├── tests/                       # Automated tests
│   ├── __init__.py
│   ├── conftest.py              # Pytest fixtures
│   ├── test_api.py              # Endpoint tests
│   └── test_image_utils.py      # Utility tests
│
└── logs/                        # Application logs
    └── app.log                  # Rotating log file
```

---

## 🔧 Core Components

### 1. ModelLoader (`services/model_loader.py`)

**Purpose**: Load TensorFlow model and make predictions

```python
loader = ModelLoader("lstm_rnn_model.h5")
prediction, confidence = loader.predict(image)
# Returns: ("Fire", 0.95) or ("No Fire", 0.12)
```

**Key Methods**:
- `_load_model()` - Load H5 file at startup
- `preprocess_image()` - Resize to 224x224, normalize
- `predict()` - Make inference
- `is_loaded()` - Check model status

**Error Handling**: 
- Validates model file exists
- Handles image format issues
- Logs all operations

### 2. DatabaseService (`services/database.py`)

**Purpose**: All MongoDB operations

```python
db = DatabaseService(mongo_url)
db.store_prediction(prediction, confidence, timestamp, hash, threshold)
db.store_alert(prediction, confidence, timestamp, hash, threshold)
alerts = db.get_recent_alerts(limit=10)
stats = db.get_statistics()
```

**Collections**:
- `predictions` - All predictions with metadata
- `alerts` - High-confidence fire detections

**Features**:
- Connection pooling
- Error recovery
- Statistics aggregation
- Transaction safety

### 3. EmailService (`services/email_service.py`)

**Purpose**: Send SMTP alerts via Brevo

```python
email = EmailService(
    smtp_server="smtp-relay.brevo.com",
    smtp_port=587,
    login="user@smtp-brevo.com",
    password="password"
)
email.send_alert_email(to_email, confidence, timestamp, threshold)
```

**Features**:
- HTML + text email formats
- Professional formatting with inline CSS
- Connection testing
- Error logging

### 4. Main FastAPI App (`main.py`)

**Startup Process**:
1. Load settings from `.env`
2. Validate all required variables
3. Initialize ModelLoader (load TensorFlow model)
4. Initialize DatabaseService (connect to MongoDB)
5. Initialize EmailService (configure SMTP)

**Endpoints**:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | API info endpoint |
| `/health` | GET | Health check for monitoring |
| `/predict` | POST | Make fire prediction on image |
| `/alerts` | GET | Get recent fire alerts |
| `/statistics` | GET | Get detection statistics |
| `/docs` | GET | Interactive API documentation |
| `/redoc` | GET | Alternative documentation |

### 5. Configuration (`utils/config.py`)

Uses Pydantic Settings for type-safe environment variable management:

```python
MONGO_URL              # MongoDB connection string
SMTP_SERVER           # SMTP server address
SMTP_PORT             # SMTP port (usually 587)
SMTP_LOGIN            # SMTP username
SMTP_PASSWORD         # SMTP password
MODEL_PATH            # Path to .h5 model file
ALERT_THRESHOLD       # Confidence threshold for alerts (0-1)
ALERT_EMAIL_FROM      # Sender email address
ALERT_EMAIL_TO        # Recipient email address
API_HOST              # API host (0.0.0.0 for production)
API_PORT              # API port (8000)
ENVIRONMENT           # "development" or "production"
DEBUG                 # false for production
```

---

## 🌐 API Endpoints

### 1. GET `/health`
**Purpose**: Health check for monitoring and load balancers

**Response**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "database_connected": true,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. POST `/predict`
**Purpose**: Make fire detection prediction

**Input**: Multipart form-data with image file

**Response**:
```json
{
  "prediction": "Fire",
  "confidence": 0.95,
  "timestamp": "2024-01-15T10:30:00Z",
  "image_hash": "abc123def456..."
}
```

**Process**:
1. Validate image format
2. Calculate SHA256 hash
3. Preprocess image (224x224, normalization)
4. Run TensorFlow inference
5. Store in MongoDB
6. If Fire + high confidence:
   - Store in alerts collection
   - Send email in background
7. Return immediately

### 3. GET `/alerts`
**Purpose**: Retrieve recent fire alerts

**Query Parameters**:
- `limit` (optional): Number of alerts to retrieve (default: 10, max: 100)

**Response**:
```json
{
  "alerts": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "prediction": "Fire",
      "confidence": 0.95,
      "timestamp": "2024-01-15T10:30:00Z",
      "image_hash": "abc123def456...",
      "alert_threshold": 0.70,
      "status": "triggered",
      "email_sent": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### 4. GET `/statistics`
**Purpose**: Get detection statistics

**Response**:
```json
{
  "total_predictions": 150,
  "fire_predictions": 12,
  "no_fire_predictions": 138,
  "total_alerts": 8,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 5. GET `/`
**Purpose**: Root endpoint with API information

**Response**:
```json
{
  "name": "Forest Fire Detection API",
  "version": "1.0.0",
  "description": "...",
  "endpoints": {
    "health": "/health",
    "predict": "POST /predict",
    "alerts": "/alerts",
    "statistics": "/statistics",
    "docs": "/docs",
    "redoc": "/redoc"
  }
}
```

---

## ⚙️ Configuration

### Environment Variables

**MongoDB** (Required):
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=fire
```

**SMTP Configuration** (Required):
```env
SMTP_SERVER=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_LOGIN=your_brevo_email@smtp-brevo.com
SMTP_PASSWORD=your_brevo_smtp_password
```

**Model & Alerts** (Required):
```env
MODEL_PATH=../lstm_rnn_model.h5
ALERT_THRESHOLD=0.70
ALERT_EMAIL_FROM=sender@example.com
ALERT_EMAIL_TO=admin@example.com
```

**API Configuration** (Optional):
```env
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=production
DEBUG=false
```

### Setup Instructions

1. **Copy template**:
   ```bash
   cp .env.example .env
   ```

2. **Edit .env** with your actual values

3. **Never commit .env** to git (included in .gitignore)

---

## 🚀 Deployment

### Local Development

```bash
# 1. Virtual environment
python -m venv venv
venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
cp .env.example .env
# Edit .env with your credentials

# 4. Run server
python main.py
# or with reload:
uvicorn main:app --reload

# 5. API available at http://localhost:8000
```

### Docker Local

```bash
# Build and run
docker-compose up

# Access at http://localhost:8000
```

### Render.com Production

**Prerequisites**:
- GitHub repository
- MongoDB Atlas cluster
- Brevo SMTP account

**Steps**:
1. Push code to GitHub
2. Create new Web Service on render.com
3. Connect GitHub repository
4. Set Build Command: `pip install -r backend/requirements.txt`
5. Set Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add all environment variables
7. Deploy!

**No Configuration Needed** - Procfile and runtime.txt are included

---

## 🔒 Security Considerations

### In Production:
- [ ] Set `DEBUG=false`
- [ ] Add API key authentication
- [ ] Restrict CORS origins to specific domains
- [ ] Use HTTPS only (Render provides free SSL)
- [ ] Validate file uploads (size, format, content)
- [ ] Rate limit endpoints to prevent abuse
- [ ] Monitor for unusual activity
- [ ] Keep dependencies updated

### Current Defaults:
- CORS: Allow all origins (restrict in production)
- Debug: Disabled by default
- Authentication: None (add as needed)

---

## 📊 Monitoring

### Health Check for Load Balancers
```bash
curl http://localhost:8000/health
```

Returns 200 if everything is working, includes:
- Model loaded status
- Database connection status
- Timestamp

### Application Logs
- Console output: Real-time events
- File logs: `logs/app.log` (rotating, up to 100MB across 10 files)
- Log level: INFO (or DEBUG if enabled)

### Monitor These Metrics:
- API response times
- Error rates
- Model inference speed
- Database connection issues
- Email delivery status
- Fire detection frequency

---

## 🧪 Testing

### Run Tests
```bash
pip install pytest
pytest tests/
```

### Test Coverage

**API Tests** (`test_api.py`):
- Health check endpoint
- Root endpoint
- Prediction endpoint (error handling)
- Alerts endpoint
- Statistics endpoint

**Utility Tests** (`test_image_utils.py`):
- Image hash calculation
- Image format validation
- Image loading from bytes

### Manual Testing

See `TESTING.md` for detailed testing examples with cURL, Python, and Postman.

---

## 📈 Scalability

**Current Architecture** (Suitable for):
- Small to medium fire detection systems
- Real-time single concurrent requests
- Local or small cloud deployment

**Future Improvements**:
- Add request queuing for high load
- Implement model caching/optimization
- Add database connection pooling
- Use async image processing
- Add API rate limiting
- Implement request throttling
- Use CDN for static files

---

## 🐛 Troubleshooting

### Model Not Loading
```
Error: "Model file not found at ../lstm_rnn_model.h5"
Solution: Check MODEL_PATH in .env, verify file exists
```

### Database Connection Failed
```
Error: "Failed to connect to MongoDB"
Solution: Verify MONGO_URL, check IP whitelist in Atlas
```

### Email Not Sending
```
Error: "SMTP connection failed"
Solution: Verify SMTP credentials, check Brevo account active
```

### Port Already in Use
```
Error: "Address already in use"
Solution: Use different port: uvicorn main:app --port 8001
```

---

## 📚 Additional Resources

- **main.py** - Full FastAPI implementation with detailed comments
- **README.md** - Comprehensive deployment guide
- **QUICKSTART.md** - 5-minute setup guide
- **TESTING.md** - Testing approaches and examples
- **RENDER_DEPLOYMENT.md** - Render-specific configuration
- **API Documentation** - http://localhost:8000/docs (interactive)

---

## 📝 Key Features Summary

✅ **Fast Image Processing**
- Images resized to 224x224 in milliseconds
- Batch preprocessing support

✅ **Accurate Predictions**
- LSTM/CNN TensorFlow model
- Confidence scores 0-1
- Configurable alert threshold

✅ **Reliable Alerts**
- Email notifications with HTML formatting
- Automatic retry on failure
- Background task processing

✅ **Persistent Storage**
- MongoDB for predictions and alerts
- Statistics aggregation
- Alert history

✅ **Production Ready**
- Structured logging
- Error handling
- Health checks
- CORS middleware
- Environment configuration
- Docker support

✅ **Easy Deployment**
- Works with Render.com (free tier)
- Minimal configuration needed
- Auto-reload for development
- Load balancer compatible

---

## 🎯 Next Steps

1. **Local Setup** (5 minutes)
   - Install dependencies
   - Create .env file
   - Run server

2. **Test API** (10 minutes)
   - Visit http://localhost:8000/docs
   - Upload test images
   - Check responses

3. **Deploy to Render** (15 minutes)
   - Push to GitHub
   - Create Render service
   - Add environment variables
   - Deploy!

---

**Ready to detect fires? Let's go! 🔥**
