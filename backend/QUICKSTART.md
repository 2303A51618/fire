# 🚒 Forest Fire Detection System - quickstart Guide

## What You've Got

A **production-ready FastAPI backend** that:
- ✅ Loads TensorFlow model at startup
- ✅ Accepts image uploads via REST API
- ✅ Detects fire with confidence scores
- ✅ Stores predictions in MongoDB
- ✅ Sends email alerts when fire is detected
- ✅ Includes health checks and monitoring endpoints
- ✅ Deploy-ready for Render

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Step 2: Create .env File
```bash
# Copy template
copy .env.example .env

# Edit .env with your credentials:
# MONGO_URL=mongodb+srv://username:password@...
# SMTP_LOGIN=your_brevo_email@smtp-brevo.com
# etc.
```

### Step 3: Start the Server
```bash
python main.py
# or
uvicorn main:app --reload
```

### Step 4: Test It
Open in browser: **http://localhost:8000/docs**

---

## 📋 Project Structure

```
backend/
├── main.py                 # ⭐ FastAPI app - start here
├── requirements.txt        # All Python packages
├── .env.example           # Environment variables template
├── Dockerfile             # Docker container config
├── docker-compose.yml     # Local Docker setup
├── Procfile               # Render deployment config
├── runtime.txt            # Python version for Render
├── render_build.sh        # Render build script
│
├── services/              # Business logic
│   ├── model_loader.py    # TensorFlow model + inference
│   ├── database.py        # MongoDB operations
│   └── email_service.py   # Email alerts via Brevo
│
├── models/                # Data structures
│   └── schemas.py         # Pydantic models for API responses
│
├── utils/                 # Helper functions
│   ├── config.py          # Environment configuration
│   ├── logger.py          # Logging setup
│   └── image_hash.py      # Image processing utilities
│
├── tests/                 # Unit tests
│   ├── test_api.py        # API endpoint tests
│   └── test_image_utils.py
│
└── logs/                  # Application logs (auto-created)
```

---

## 🔗 API Endpoints

### Health Check
```bash
GET /health
# Returns: model status, database connection, timestamp
```

### Make Prediction
```bash
POST /predict
# Body: multipart/form-data with image file
# Returns: prediction ("Fire" or "No Fire"), confidence, timestamp
```

### Get Recent Alerts
```bash
GET /alerts?limit=10
# Returns: list of recent fire detection alerts
```

### Get Statistics
```bash
GET /statistics
# Returns: total predictions, fire count, alert count
```

### API Documentation
- Interactive: http://localhost:8000/docs (Swagger UI)
- Alternative: http://localhost:8000/redoc (ReDoc)

---

## 🧪 Testing with cURL

### Install an image to test with (if you don't have one)
```python
# Create a test image
from PIL import Image
img = Image.new('RGB', (224, 224), color='red')
img.save('test_fire.jpg')
```

### Make predictions
```bash
# Windows
curl -X POST http://localhost:8000/predict ^
  -F "file=@test_fire.jpg"

# Mac/Linux  
curl -X POST http://localhost:8000/predict \
  -F "file=@test_fire.jpg"
```

### Check health
```bash
curl http://localhost:8000/health
```

---

## 🔐 Environment Variables Required

```env
# MongoDB (Atlas)
MONGO_URL=mongodb+srv://username:password@cluster...

# Email via Brevo
SMTP_SERVER=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_LOGIN=your_brevo_email@smtp-brevo.com
SMTP_PASSWORD=your_brevo_smtp_password

# Detection
MODEL_PATH=../lstm_rnn_model.h5
ALERT_THRESHOLD=0.70
ALERT_EMAIL_TO=admin@example.com
ALERT_EMAIL_FROM=sender@example.com
```

---

## 🐳 Using Docker (Optional)

### Local Development
```bash
docker-compose up
# API available at http://localhost:8000
```

### Build for Production
```bash
docker build -t forest-fire-api .
docker run -p 8000:8000 --env-file .env forest-fire-api
```

---

## 🌐 Deploy to Render (Free)

### Prerequisites
1. GitHub account (push code there)
2. MongoDB Atlas account (free tier OK)
3. Brevo account (free SMTP)
4. Render.com account (sign up free)

### Deploy Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Forest Fire Detection API"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to render.com/dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repo

3. **Configure Service**
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Region**: Choose closest to you

4. **Add Environment Variables**
   - In Render dashboard → "Environment"
   - Add all variables from `.env`

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - Get your URL: `https://forest-fire-api.onrender.com`

---

## 🔥 Key Features Explained

### Fire Detection Prediction
1. Upload image via `/predict` endpoint
2. Image is resized to 224x224 and normalized
3. TensorFlow model makes prediction
4. Returns probability for "Fire" vs "No Fire"

### Alert System
- If `confidence >= ALERT_THRESHOLD` AND prediction is "Fire":
  - Event stored in MongoDB
  - Email alert sent to ALERT_EMAIL_TO
  - Alert logged for monitoring

### Database Integration
- **predictions** collection: All analyses
- **alerts** collection: High-confidence fire detections
- Statistics available via `/statistics` endpoint

### Monitoring
- Health check endpoint for load balancers
- Structured logging to file + console
- Request tracking with timestamps

---

## 📊 Example Workflow

```
1. User uploads forest image via POST /predict
   ↓
2. Server loads image → resize → normalize
   ↓
3. TensorFlow model predicts: Fire (0.92 confidence)
   ↓
4. 0.92 >= 0.70 threshold → ALERT!
   ↓
5. MongoDB stores alert with metadata
   ↓
6. Email sent to admin@example.com
   ↓
7. Response returned immediately (email in background)
```

---

## 🛠️ Common Tasks

### View Recent Alerts
```bash
curl http://localhost:8000/alerts?limit=5
```

### Get Statistics
```bash
curl http://localhost:8000/statistics
```

### Run Tests
```bash
pip install pytest
pytest tests/
```

### View Logs
```bash
# Development console logs appear here:
tail -f logs/app.log
```

---

## ⚙️ Production Checklist

- [ ] Add `.env` (not committed to git)
- [ ] Configure CORS for specific domains
- [ ] Set up MongoDB backups
- [ ] Test email alerts work
- [ ] Set up monitoring/alerts for API errors
- [ ] Use HTTPS (Render provides free SSL)
- [ ] Set DEBUG=false in production
- [ ] Configure model auto-download if needed
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Monitor model performance over time

---

## 📚 Documentation Files

- **README.md** - Detailed deployment guide
- **TESTING.md** - Testing approaches and examples
- **RENDER_DEPLOYMENT.md** - Render-specific configuration
- **.env.example** - Template for environment variables

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Model not loaded` | Check MODEL_PATH in `.env` points to correct file |
| `Database connection failed` | Verify MONGO_URL, check IP whitelist in MongoDB Atlas |
| `Email not sending` | Test SMTP credentials, verify Brevo account active |
| `Port 8000 in use` | Use `uvicorn main:app --port 8001` instead |
| `Module not found` | Run `pip install -r requirements.txt` again |

---

## 📞 Next Steps

1. ✅ Install dependencies (`pip install -r requirements.txt`)
2. ✅ Create `.env` file with your credentials
3. ✅ Run `python main.py` to start server
4. ✅ Open http://localhost:8000/docs to test API
5. ✅ Upload an image to test predictions
6. ✅ Deploy to Render when ready!

---

## 📝 Notes

- Model is loaded **once at startup** for performance
- Images are **resized to 224x224** before prediction
- Confidence scores are **0.0 to 1.0** float values
- All timestamps are in **UTC/ISO format**
- Emails are sent **asynchronously** (non-blocking)
- Predictions stored permanently in **MongoDB**

---

**Happy detecting! 🔥 Let the API handle the fire, you focus on safety!**
