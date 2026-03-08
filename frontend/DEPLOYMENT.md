# Frontend Deployment Guide

## Overview

The React frontend can be deployed to multiple platforms with minimal configuration.

## Deployment Platforms

### 1. Vercel (Recommended - Free)

**Easiest deployment option:**

1. **Sign up** at vercel.com
2. **Import project** from GitHub
3. **Configure environment:**
   - Add `VITE_API_BASE_URL` in Environment Variables
   - Example: `https://your-backend.onrender.com`
4. **Deploy!** Vercel auto-detects Vite

**Benefits:**
- Free plan includes unlimited deployments
- Automatic HTTPS
- Global CDN
- Automatic previews on pull requests

### 2. Render.com

1. **Create account** at render.com
2. **New Static Site**
3. **Connect GitHub**
4. **Build Settings:**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. **Environment Variables:**
   - `VITE_API_BASE_URL=https://your-backend.onrender.com`
6. **Deploy**

### 3. Netlify

1. **Sign up** at netlify.com
2. **New site from Git**
3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Add environment variables**
5. **Deploy**

### 4. GitHub Pages

```bash
# Update package.json
"homepage": "https://username.github.io/repo-name"

# Build
npm run build

# Deploy to gh-pages branch
npm run deploy
```

### 5. Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Deploy with:
```bash
docker build -t forest-fire-frontend .
docker run -p 3000:3000 -e VITE_API_BASE_URL=http://api.example.com forest-fire-frontend
```

## Environment Configuration

### Development
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Production
```env
VITE_API_BASE_URL=https://api.example.com
```

## Build Optimization

```bash
# Production build (optimized)
npm run build

# Check bundle size
npm run build -- --report

# Preview production build locally
npm run preview
```

## Performance Tips

1. **Enable Code Splitting** - React Router already does this
2. **Lazy Load Components** - Use React.lazy() for routes
3. **Image Optimization** - Use modern formats (WebP)
4. **Caching** - Static assets cached by CDN
5. **Compression** - Most platforms auto-compress

## Security

1. **Never commit .env** - Use environment variables
2. **HTTPS only** - All platforms provide free SSL
3. **CORS** - Configured on backend, not needed here
4. **API Keys** - Store in backend environment, not frontend

## Domain Configuration

### Custom Domain on Vercel
1. Go to project settings
2. Add domain under "Domains"
3. Update DNS records

### Custom Domain on Render
1. Project settings → Custom Domains
2. Point nameservers or add CNAME

## Monitoring & Analytics

Add tracking (optional):
```javascript
// src/main.jsx
import { inject } from '@vercel/analytics';

inject();
```

## Troubleshooting

### Build Fails
- Check Node version: `node --version` (need 16+)
- Clear cache: `rm -rf node_modules && npm install`
- Check for TypeScript errors

### App doesn't connect to API
- Verify `VITE_API_BASE_URL` environment variable
- Check backend is running and accessible
- Check CORS on backend

### Styling breaks after deploy
- Clear browser cache
- Run `npm run build` locally to test
- Check TailwindCSS purge configuration

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## DNS & SSL

Most platforms provide:
- ✅ Free SSL/TLS (HTTPS)
- ✅ Automatic certificate renewal
- ✅ Custom domain support
- ✅ DDoS protection

## Maintenance

1. **Keep dependencies updated:**
   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor performance:**
   - Use Lighthouse in DevTools
   - Check Core Web Vitals

3. **Regular deploys:**
   - Push to main branch
   - Automatic deployment triggers

## Scaling for High Traffic

- All mentioned platforms auto-scale
- CDN distribution included
- No additional configuration needed light-weight static files

## Cost Estimation

| Platform | Cost | Notes |
|----------|------|-------|
| Vercel | Free | Unlimited deployments |
| Render | Free | Rebuilds on push |
| Netlify | Free | 300 minutes/month build time |
| GitHub Pages | Free | No server cost |

## Recommended Setup

**For Production:**
1. **Frontend:** Vercel (best performance + UX)
2. **Backend:** Render.com (free tier)
3. **Database:** MongoDB Atlas (free tier)
4. **Email:** Brevo (free tier)

**Total Cost:** $0 (all free tiers!)

---

**Next Steps:**
1. Choose deployment platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy!
5. Monitor performance
