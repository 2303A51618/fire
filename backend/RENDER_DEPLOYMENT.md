c"""
Deployment configuration for Render platform
Reference: https://render.com/docs
"""

# Key deployment notes:

# 1. Python Version
# Ensure runtime.txt specifies python-3.11

# 2. Build Command
# pip install --upgrade pip && pip install -r backend/requirements.txt

# 3. Start Command  
# cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT

# 4. Environment Variables Required
# - MONGO_URL
# - SMTP_SERVER
# - SMTP_PORT
# - SMTP_LOGIN
# - SMTP_PASSWORD
# - MODEL_PATH
# - ALERT_THRESHOLD
# - ALERT_EMAIL_FROM
# - ALERT_EMAIL_TO
# - ENVIRONMENT=production
# - DEBUG=false

# 5. Model File Handling
# Option A: Include in repository (if < 100MB)
# Option B: Download from cloud storage during startup
# Option C: Store in MongoDB GridFS and load on demand

# 6. Static Files (if needed)
# Add 'static_path = "static"' in main.py
# Add static files to render_build.sh

# 7. Health Check
# Render will use /health endpoint for monitoring
# Make sure it responds with 200 status

# 8. Custom Domain
# Add custom domain in Render dashboard
# Configure DNS CNAME to render.com domain

# 9. Logs
# Logs are captured to stdout and available in Render dashboard
# Cannot configure persistent log files on Render's free tier

# 10. Database
# MongoDB Atlas free tier:
# - 512 MB storage
# - Shared cluster
# - IP whitelist required (use 0.0.0.0/0 for Render)

# 11. Auto-Deploy
# Connected GitHub repo will auto-deploy on push to main branch
# Configure deployment triggers in Render dashboard

# 12. Scaling
# Free tier:
# - Single instance
# - Auto-spins down after 15 minutes of inactivity
# - Cold starts add 5-10 seconds delay
# 
# Paid tier:
# - No auto-shutdown
# - Multiple instances
# - Load balancing
