# Python 3.11 Setup Guide for TensorFlow Compatibility

## Problem
The backend requires TensorFlow, which doesn't support Python 3.14. You need Python 3.11 or 3.12.

## Solution Options

### Option 1: Manual Python 3.11 Installation (Recommended)

1. **Download Python 3.11.9**:
   - Go to: https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe
   - Download the installer

2. **Run Installer as Administrator**:
   - Right-click the downloaded file
   - Select "Run as Administrator"
   - ✅ Check "Add Python 3.11 to PATH"
   - Click "Install Now"

3. **Create New Virtual Environment**:
   ```powershell
   cd "c:\Users\PC\Documents\web projects\CC\CP\java\fire\backend"
   # Remove old venv
   Remove-Item -Recurse -Force venv
   # Create new venv with Python 3.11
   py -3.11 -m venv venv
   # Activate
   .\venv\Scripts\Activate.ps1
   # Install dependencies
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Run Backend**:
   ```powershell
   python main.py
   ```

### Option 2: Use Chocolatey with Admin Rights

Open PowerShell **as Administrator**:
```powershell
choco install python311 -y
```

Then follow step 3 and 4 from Option 1.

### Option 3: Docker (Best for Production)

1. **Install Docker Desktop**:
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and restart your computer

2. **Build and Run**:
   ```powershell
   cd "c:\Users\PC\Documents\web projects\CC\CP\java\fire"
   # Build Docker image
   docker build -t fire-detection-backend -f backend/Dockerfile .
   # Run container
   docker run -p 8000:8000 --env-file backend/.env fire-detection-backend
   ```

## Verification

After setup, test the backend:
1. Open http://localhost:8000/health
2. Should see: `{"status":"healthy","model_loaded":true}`

## Current Configuration

- ✅ Frontend running on port 3000
- ❌ Backend needs Python 3.11 with TensorFlow 2.15
- ✅ Model file: `backend/cpu_fire_model.h5`
- ✅ Updated requirements.txt with TensorFlow 2.15

## Next Steps

1. Install Python 3.11 using any option above
2. Run the backend
3. Test image upload at http://localhost:3000/upload
4. Predictions should work!
