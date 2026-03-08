# Deployment Guide

Complete guide to deploy Forest Fire Detection application.

## 📦 Frontend Deployment (Netlify)

### Prerequisites
- GitHub account
- Netlify account (free tier works)
- Code pushed to GitHub repository

### Step-by-Step Instructions

#### Method 1: Deploy via Netlify Dashboard (Recommended)

1. **Sign Up / Login to Netlify**
   - Go to https://www.netlify.com/
   - Click "Sign up" and choose "Sign up with GitHub"
   - Authorize Netlify to access your GitHub repositories

2. **Import Your Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify if prompted
   - Select your repository: `2303A51618/fire`

3. **Configure Build Settings**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Environment Variables** (Important!)
   - Click "Show advanced" → "New variable"
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - (You'll get the backend URL after deploying to Render - Step 2)

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at: `https://random-name-12345.netlify.app`

6. **Custom Domain (Optional)**
   - Go to "Site settings" → "Domain management"
   - Click "Add custom domain" to use your own domain

7. **Update Backend URL**
   - Once you have your Render backend URL, update the environment variable:
   - Go to "Site settings" → "Environment variables"
   - Edit `VITE_API_URL` with your Render backend URL
   - Go to "Deploys" → "Trigger deploy" → "Clear cache and deploy site"

#### Method 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from frontend directory
cd frontend
netlify deploy --prod
```

---

## 🚀 Backend Deployment (Render)

### Prerequisites
- GitHub account
- Render account (free tier available)
- MongoDB Atlas account (for database)
- Brevo account (for email alerts)

### Step-by-Step Instructions

1. **Prepare Environment Variables**
   
   Before deployment, prepare these values:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fire_detection
   EMAIL_API_KEY=your_brevo_api_key
   EMAIL_FROM=your_verified_email@domain.com
   EMAIL_TO=vikascharythangallapally@gmail.com
   ALERT_THRESHOLD=0.70
   CORS_ORIGINS=https://your-netlify-site.netlify.app
   ```

2. **Sign Up / Login to Render**
   - Go to https://render.com/
   - Click "Get Started" → "Sign up with GitHub"
   - Authorize Render to access your repositories

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Choose "Build and deploy from a Git repository"
   - Click "Connect" next to your `fire` repository
   - If you don't see it, click "Configure account" to grant access

4. **Configure Service**
   ```
   Name: forest-fire-backend (or your preferred name)
   Region: Choose closest to your users (e.g., Oregon, Frankfurt)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free
   ```

5. **Add Environment Variables**
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable" for each:
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `EMAIL_API_KEY` | Your Brevo API key |
   | `EMAIL_FROM` | Your verified sender email |
   | `EMAIL_TO` | Alert recipient email |
   | `ALERT_THRESHOLD` | `0.70` |
   | `CORS_ORIGINS` | `https://your-netlify-site.netlify.app` |
   | `PYTHON_VERSION` | `3.11.0` |

6. **Deploy**
   - Click "Create Web Service"
   - Render will start building (takes 5-10 minutes first time)
   - Watch the logs for any errors
   - Once complete, you'll get a URL like: `https://forest-fire-backend.onrender.com`

7. **Verify Deployment**
   - Open: `https://your-backend-url.onrender.com/health`
   - You should see: `{"status":"healthy","model_loaded":true,...}`

8. **Important: Update Frontend Environment Variable**
   - Copy your Render backend URL
   - Go back to Netlify
   - Update `VITE_API_URL` environment variable
   - Redeploy frontend

---

## 🔗 Connecting Frontend and Backend

1. **Update Frontend API URL**
   
   In Netlify environment variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. **Update Backend CORS**
   
   In Render environment variables:
   ```
   CORS_ORIGINS=https://your-netlify-site.netlify.app
   ```

3. **Test the Connection**
   - Visit your Netlify site
   - Try uploading an image
   - Check if prediction works
   - Verify dashboard loads data

---

## 🛠️ Troubleshooting

### Frontend Issues

**Build Fails on Netlify**
- Check build logs in Netlify dashboard
- Verify `package.json` has all dependencies
- Ensure `vite.config.js` is present

**API Requests Fail**
- Verify `VITE_API_URL` environment variable is set correctly
- Check browser console for CORS errors
- Ensure backend URL doesn't have trailing slash

**404 Errors on Page Refresh**
- Verify `netlify.toml` has redirect rules
- Should redirect all routes to `/index.html`

### Backend Issues

**Build Fails on Render**
- Check Render logs for specific error
- Verify `requirements.txt` is correct
- Ensure `runtime.txt` specifies Python 3.11

**Model Won't Load**
- Check if `cpu_fire_model.h5` is in repository
- Verify file size isn't too large (should be ~9MB)
- Check logs for TensorFlow/Keras errors

**Database Connection Fails**
- Verify MongoDB Atlas connection string
- Check IP whitelist (allow 0.0.0.0/0 for Render)
- Ensure database user has correct permissions

**CORS Errors**
- Update `CORS_ORIGINS` in Render environment variables
- Include full Netlify URL with https://
- Restart the Render service after updating

**Free Tier Sleep Mode**
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Consider upgrading for always-on service

---

## 📊 Post-Deployment Checklist

- [ ] Frontend builds successfully on Netlify
- [ ] Backend builds successfully on Render
- [ ] Health endpoint returns 200 OK
- [ ] Model loads without errors
- [ ] Database connection works
- [ ] Email alerts are sent correctly
- [ ] CORS is configured properly
- [ ] File upload works from frontend
- [ ] Predictions are displayed correctly
- [ ] Dashboard loads data
- [ ] All navigation links work

---

## 💰 Cost Considerations

### Netlify (Free Tier)
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic SSL
- ✅ CDN included

### Render (Free Tier)
- ✅ 750 hours/month
- ✅ Automatic SSL
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ 512 MB RAM (may be tight for TensorFlow)

### Recommendations
- Free tiers work for development/demo
- For production, consider Render's Starter plan ($7/mo) for always-on backend
- Monitor Render logs for memory issues
- Consider upgrading if you see frequent out-of-memory errors

---

## 🔄 Continuous Deployment

Both platforms support automatic deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Builds**
   - Netlify automatically rebuilds frontend
   - Render automatically rebuilds backend
   - Takes 2-5 minutes typically

3. **Manual Redeploy**
   - Netlify: "Deploys" → "Trigger deploy"
   - Render: "Manual Deploy" → "Deploy latest commit"

---

## 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com/
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Brevo (Email)**: https://help.brevo.com/

---

## 🎉 Success!

If everything is working:
- Visit your Netlify URL
- Upload a test image
- Verify prediction appears
- Check email for fire detection alerts (if confidence > 70%)

Your Forest Fire Detection system is now live! 🔥🌲
