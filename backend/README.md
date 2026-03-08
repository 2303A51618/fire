# Forest Fire Detection API - Deployment Guide

## Overview
This is a production-ready FastAPI backend for the Forest Fire Detection System. The API loads a trained TensorFlow model, accepts image uploads, performs fire detection predictions, and can send alerts via email when fire is detected.

## System Architecture

### Services
- **ModelLoader**: Loads and manages TensorFlow model inference
- **DatabaseService**: MongoDB integration for storing predictions and alerts
- **EmailService**: SMTP-based email alerts using Brevo

### API Endpoints

#### Health Check
- **GET /health**: System health status
  - Returns: model loaded status, database connection status
  - Use for monitoring and load balancer health checks

#### Fire Prediction
- **POST /predict**: Make fire detection prediction
  - Input: Image file (multipart/form-data)
  - Output: Prediction ("Fire" or "No Fire"), confidence score, timestamp
  - Triggers alerts if fire detected above threshold

#### Monitoring
- **GET /alerts**: Get recent fire alerts
- **GET /statistics**: Get detection statistics
- **GET /**: API information and endpoint list

## Environment Setup

### 1. Local Development

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from .env.example
cp .env.example .env

# Update .env with your credentials:
# - MongoDB URL
# - Brevo SMTP credentials
# - Model path
# - Alert threshold
# - Alert recipient email

# Run development server
python main.py
# or
uvicorn main:app --reload
```

### 2. Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB (MongoDB Atlas)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?appName=fire

# SMTP (Brevo)
SMTP_SERVER=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_LOGIN=your_brevo_email@smtp-brevo.com
SMTP_PASSWORD=your_brevo_smtp_password

# Model and Alert Configuration
MODEL_PATH=../lstm_rnn_model.h5
ALERT_THRESHOLD=0.70
ALERT_EMAIL_FROM=your_email@example.com
ALERT_EMAIL_TO=admin@example.com

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Other
ENVIRONMENT=production
DEBUG=false
```

## Testing the API

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Fire Prediction
```bash
curl -X POST http://localhost:8000/predict \
  -F "file=@path/to/image.jpg"
```

### 3. Get Alerts
```bash
curl http://localhost:8000/alerts?limit=10
```

### 4. Get Statistics
```bash
curl http://localhost:8000/statistics
```

### Interactive Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment to Render

### Prerequisites
- Render.com account
- GitHub repository with this code
- MongoDB Atlas cluster
- Brevo account for SMTP

### Steps

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Forest Fire Detection API"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to https://render.com/dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name**: forest-fire-api
   - **Environment**: Python 3
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Build Command**: 
     ```
     pip install --upgrade pip && pip install -r backend/requirements.txt
     ```
   - **Start Command**:
     ```
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

4. **Add Environment Variables**
   In Render dashboard, add all `.env` variables:
   - MONGO_URL
   - SMTP_SERVER
   - SMTP_PORT
   - SMTP_LOGIN
   - SMTP_PASSWORD
   - MODEL_PATH (adjust path as needed)
   - ALERT_THRESHOLD
   - ALERT_EMAIL_FROM
   - ALERT_EMAIL_TO
   - ENVIRONMENT=production
   - DEBUG=false

5. **Upload Model File**
   - Since `.h5` files are large, consider:
     - Storing in MongoDB GridFS
     - Using AWS S3 or similar cloud storage
     - Downloading from a cloud storage during startup
   
   For now, ensure `lstm_rnn_model.h5` is in the repository root or adjust `MODEL_PATH` accordingly.

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Monitor build and deployment logs

## Production Considerations

### Security
- [ ] Disable CORS for production (`allow_origins` should specify actual domains)
- [ ] Use HTTPS only (Render provides free SSL)
- [ ] Implement API key authentication for sensitive endpoints
- [ ] Validate file uploads (size, format, content)
- [ ] Use environment-specific configurations

### Scalability
- [ ] Model caching: Load model once at startup
- [ ] Database connection pooling (already implemented)
- [ ] Add request rate limiting
- [ ] Implement request queuing for high load
- [ ] Use CDN for static content if needed

### Monitoring & Logging
- [ ] Structured logging to file and stdout
- [ ] Monitor API response times
- [ ] Track error rates
- [ ] Set up alerts for errors/failures
- [ ] Implement request tracing/IDs

### Database
- [ ] MongoDB connection pooling (implemented)
- [ ] Automatic backups enabled
- [ ] Database indexes on frequently queried fields
- [ ] Retention policies for old predictions/alerts

### Email Alerts
- [ ] Store email retry logic
- [ ] Rate limit alert emails to prevent spam
- [ ] Include unsubscribe/settings link in emails
- [ ] Monitor email delivery status

### Model Management
- [ ] Version control for models
- [ ] A/B testing capability
- [ ] Model retraining pipeline
- [ ] Performance monitoring and evaluation

## File Structure

```
backend/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── Procfile               # Render/Heroku deployment config
├── runtime.txt            # Python runtime version
├── services/
│   ├── __init__.py
│   ├── model_loader.py    # TensorFlow model loading
│   ├── database.py        # MongoDB operations
│   └── email_service.py   # SMTP email alerts
├── models/
│   ├── __init__.py
│   └── schemas.py         # Pydantic models for API
└── utils/
    ├── __init__.py
    ├── config.py          # Configuration management
    ├── logger.py          # Logging setup
    └── image_hash.py      # Image utilities
```

## Troubleshooting

### Model Loading Fails
- Check `MODEL_PATH` points to correct file
- Verify TensorFlow version compatibility
- Check file permissions

### Database Connection Fails
- Verify `MONGO_URL` is correct
- Check MongoDB Atlas IP whitelist includes Render's IP
- Ensure database exists and is accessible

### Email Not Sending
- Verify SMTP credentials are correct
- Check Brevo account is active and has email quota
- Verify sender email is verified in Brevo
- Check recipient email is valid

### Health Check Shows Degraded
- Check all environment variables are set
- Verify database and email service connectivity
- Check model file exists and is readable

## Support
For issues or questions:
1. Check logs: `render logs` if deployed on Render
2. Test locally first with same `.env` values
3. Verify all external services (MongoDB, Brevo) are accessible
4. Check API documentation at `/docs` endpoint

## License
Proprietary - Forest Fire Detection System
