# 🔥 Forest Fire Monitoring System - Complete Guide

## Frontend Overview

A **production-ready React + Vite frontend** for the Forest Fire Detection System with real-time monitoring, interactive maps, and data visualization.

---

## 📋 Quick Facts

| Aspect | Details |
|--------|---------|
| **Framework** | React 18 + Vite |
| **Styling** | TailwindCSS |
| **Maps** | Leaflet.js |
| **Charts** | Chart.js + React-ChartJS-2 |
| **HTTP Client** | Axios |
| **Routing** | React Router v6 |
| **Build Time** | ~2s development, optimized production |
| **Bundle Size** | ~150KB gzipped |
| **Node Version** | 16+ |

---

## 🎯 Key Features

✅ **5 Main Pages:**
- Home Page - Project overview
- Upload Page - Image analysis  
- Dashboard - Real-time monitoring
- Alerts - Alert history
- Admin - Configuration

✅ **Interactive Components:**
- Drag-and-drop file upload
- Real-time prediction display
- Responsive data tables
- Interactive charts
- Fire location map

✅ **Real-time Features:**
- Auto-refresh (30s intervals)
- Health status monitoring
- Live statistics
- Email alert tracking

✅ **User Experience:**
- Fully responsive design
- Loading states and spinners
- Error handling with user alerts
- Success notifications
- Empty state messages

---

## 📁 Project Structure

```
frontend/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # TailwindCSS theme
│   ├── postcss.config.js         # PostCSS config
│   ├── .eslintrc.json            # ESLint rules
│   ├── .prettierrc                # Code formatting
│   ├── .gitignore                 # Git ignore rules
│   ├── .env.example               # Environment template
│   └── index.html                 # HTML entry point
│
├── 📚 Documentation
│   ├── README.md                  # Full documentation
│   ├── QUICKSTART.md             # 5-minute setup
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── ARCHITECTURE.md           # System architecture
│
├── 🎨 Source Code (src/)
│   ├── main.jsx                  # App entry point
│   ├── App.jsx                   # Router & layout
│   ├── index.css                 # Global styles
│   │
│   ├── pages/                    # Page components
│   │   ├── HomePage.jsx           # Welcome page
│   │   ├── UploadPage.jsx         # Image upload
│   │   ├── DashboardPage.jsx      # Main dashboard
│   │   ├── AlertsPage.jsx         # Alert history
│   │   └── AdminPage.jsx          # Admin panel
│   │
│   ├── components/               # Reusable components
│   │   ├── Navbar.jsx             # Top navigation
│   │   ├── Footer.jsx             # Bottom footer
│   │   ├── UI.jsx                 # UI primitives
│   │   ├── UploadForm.jsx         # Upload component
│   │   ├── FireMap.jsx            # Leaflet map
│   │   └── Charts.jsx             # Chart visualizations
│   │
│   ├── services/                 # Business logic
│   │   └── api.js                 # Axios API client
│   │
│   ├── hooks/                    # Custom hooks
│   │   └── useApi.js              # useHealth, useAsync
│   │
│   └── utils/                    # Utilities
│       ├── constants.js           # App constants
│       └── helpers.js             # Helper functions
│
├── 🎁 Public Assets (public/)
│   └── [static files]
│
└── 📦 Build Output (dist/)
    └── [generated on npm run build]
```

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 16+
npm or yarn
```

### Installation
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

**Open browser:** http://localhost:3000

---

## 🌐 Pages & Features

### 1️⃣ Home Page (`/`)
```
Features:
- Hero section with project description
- Features highlights (3 cards)
- Live system status indicators
- Call-to-action buttons
- Quick access navigation
```

### 2️⃣ Upload Page (`/upload`)
```
Features:
- Drag-and-drop file input
- Image preview before upload
- Loading spinner during analysis
- Fire/No Fire prediction result
- Confidence score with progress bar
- Timestamp and image hash tracking
- How-it-works guide
- Tips for best results
```

### 3️⃣ Dashboard Page (`/dashboard`)
```
Features:
- 4 statistics cards (total, fire, no-fire, alerts)
- Confidence trend line chart
- Prediction distribution doughnut chart
- System statistics bar chart
- Interactive Leaflet fire location map
- Recent alerts data table
- Auto-refresh every 30 seconds
```

### 4️⃣ Alerts Page (`/alerts`)
```
Features:
- Alert count summary
- Average confidence calculation
- Email sent count
- Filterable alert list (10/25/50/100)
- Severity level indicators
- Email status badges
- Time, confidence, status display
- Empty state message
```

### 5️⃣ Admin Page (`/admin`)
```
Features:
- System health status (3 services)
- Model service status
- Database connection status
- API health check
- Alert threshold configuration slider
- Email SMTP configuration display
- Model specifications
- System event log
- Auto-refresh toggle
- Manual refresh button
```

---

## 🔧 API Integration

### Available Endpoints

```javascript
// Health Check
checkHealth()
// Response: { status, model_loaded, database_connected, timestamp }

// Make Prediction
predictFire(imageFile)
// Response: { prediction, confidence, timestamp, image_hash }

// Get Alerts
getAlerts(limit = 10)
// Response: { alerts: [...], count }

// Get Statistics
getStatistics()
// Response: { total_predictions, fire_predictions, no_fire_predictions, total_alerts }
```

### Error Handling
- Try-catch blocks on all endpoints
- User-friendly error messages
- Automatic retry with exponential backoff
- Detailed console logging

### Request/Response Logging
- Automatic request logging
- Response status codes
- Error details
- Performance monitoring

---

## 🎨 UI Components

### Primitive Components
```
LoadingSpinner      - Animated loading indicator
StatusBadge        - Colored status display
Card               - Reusable card container
ErrorAlert         - Error message box
SuccessAlert       - Success message box
```

### Composite Components
```
UploadForm         - Image upload with preview
FireMap            - Leaflet map with fire markers
Charts             - Chart.js visualizations
AlertsTable        - Sortable alerts table
```

### Layout Components
```
Navbar             - Top navigation
Footer             - Bottom footer
```

---

## 📊 Data Visualization

### Charts

**ConfidenceChart** (Line Chart)
- Shows confidence scores over time
- Last 10 alerts
- Fire detection trends

**StatisticsChart** (Doughnut Chart)
- Fire vs No Fire distribution
- Pie-style visualization
- Real-time ratio

**PredictionTrendChart** (Bar Chart)
- Total predictions
- Fire predictions
- No-fire predictions
- Total alerts
- System-wide metrics

### Maps

**FireMap** (Leaflet)
- OpenStreetMap tiles
- Custom fire markers
- Marker popups with details
- Click-to-view information
- Zoom and pan support

---

## ⚙️ Configuration

### Vite Config
```javascript
{
  port: 3000,
  sourcemap: false,
  build: {
    outDir: 'dist',
  }
}
```

### TailwindCSS
```javascript
{
  colors: {
    fire: { 50, 100, 500, 600, 700, 900 },
    forest: { 50, 500, 600, 700, 900 }
  }
}
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🚀 Deployment

### Quick Deploy to Vercel
```bash
# 1. Connect to GitHub
# 2. Vercel auto-detects Vite
# 3. Add VITE_API_BASE_URL
# 4. Deploy!
```

### Other Platforms
- **Render.com** - Static site generator
- **Netlify** - Git-based deployment
- **GitHub Pages** - Free static hosting
- **Docker** - Containerized deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.7",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "lucide-react": "^0.292.0"
}
```

---

## 🧪 Development

### Available Commands
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Hot Module Replacement
- Automatic reload on file changes
- State preservation in components
- Fast iteration cycle

### Development Tools
- React DevTools browser extension
- Vite DevServer with HMR
- ESLint for code quality
- Prettier for consistent formatting

---

## 📱 Responsive Design

### Breakpoints
```
Mobile:     < 640px   (sm)
Tablet:     640-1024px (md-lg)
Desktop:    > 1024px   (xl)
```

### Mobile Optimizations
- Touch-friendly buttons
- Stacked layout on mobile
- Readable font sizes
- Proper spacing and padding

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🔒 Security

✅ **Best Practices:**
- Environment variables for sensitive data
- No credentials in source code
- HTTPS in production
- CORS handled by backend
- Input validation on file uploads
- Safe dependencies (npm audit)

---

## 🎯 Performance

### Optimizations
- **Code Splitting** - Route-based chunks
- **Tree Shaking** - Unused code eliminated
- **Minification** - Gzipped output
- **Image Optimization** - Lazy loading
- **Efficient Re-renders** - React best practices

### Bundle Analysis
```bash
npm run build -- --report
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 3000 in use** | `npm run dev -- --port 3001` |
| **API connection fails** | Check `VITE_API_BASE_URL` in .env |
| **Styles not loading** | Clear browser cache, rebuild |
| **Module not found** | `npm install && npm run dev` |
| **Build errors** | Clear `node_modules`, reinstall |

---

## 📝 Next Steps

1. ✅ Clone repository
2. ✅ Install dependencies: `npm install`
3. ✅ Create .env file
4. ✅ Start dev server: `npm run dev`
5. ✅ Open http://localhost:3000
6. ✅ Start monitoring!

---

## 🔗 Related Documentation

- [Backend Guide](../backend/README.md)
- [Full Architecture](ARCHITECTURE.md)
- [Deployment Options](DEPLOYMENT.md)
- [Quick Start (5 min)](QUICKSTART.md)

---

## 📊 System Overview

```
┌─────────────────────────────────────────────┐
│   React Frontend (Port 3000)                │
│   - Upload images                           │
│   - View dashboards                         │
│   - Monitor alerts                          │
│   - Configure system                        │
└─────────────────────────────────────────────┘
              ↕ (Axios)
┌─────────────────────────────────────────────┐
│   FastAPI Backend (Port 8000)               │
│   - Load TensorFlow model                   │
│   - Make predictions                        │
│   - Store in MongoDB                        │
│   - Send email alerts                       │
└─────────────────────────────────────────────┘
              ↕ (MongoDB Driver)
┌─────────────────────────────────────────────┐
│   MongoDB Atlas Database                    │
│   - Store predictions                       │
│   - Store alerts                            │
│   - Query statistics                        │
└─────────────────────────────────────────────┘
```

---

## 👨‍💻 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Build to verify
5. Submit pull request

---

## 📄 License

Proprietary - Forest Fire Detection System

---

**🔥 Ready to detect fires? Start with `npm install` and `npm run dev`! 🔥**
