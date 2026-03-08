# Forest Fire Monitoring Frontend - Quick Start

## 🚀 Get Up and Running in 5 Minutes

### 1. Install Node.js
Make sure you have Node.js 16+ installed:
```bash
node --version
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Create Environment File
```bash
cp .env.example .env
```

### 4. Update .env
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 5. Start Development Server
```bash
npm run dev
```

**Open browser:** http://localhost:3000

---

## 📋 What You Have

| Page | Purpose |
|------|---------|
| **Home** | System overview & status |
| **Upload** | Analyze satellite images |
| **Dashboard** | Real-time fire events & maps |
| **Alerts** | Fire detection history |
| **Admin** | System configuration |

---

## 🧪 Testing

### Test Image Upload
1. Go to http://localhost:3000/upload
2. Upload a test image
3. See prediction results

### View Dashboard
1. Go to http://localhost:3000/dashboard
2. See fire events and charts
3. View fire locations on map

### Check Alerts
1. Go to http://localhost:3000/alerts
2. See alert history
3. Filter by limit

---

## 📦 NPM Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

---

## 🔗 API Integration

Frontend connects to backend at:
```
VITE_API_BASE_URL=http://localhost:8000
```

Make sure backend is running:
```bash
cd backend
python main.py
```

---

## 🎨 Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Chart.js** - Analytics charts
- **Leaflet** - Interactive maps
- **React Router** - Navigation

---

## 📂 File Structure

```
src/
├── pages/          # Page components
├── components/     # Reusable UI
├── services/       # API calls
├── hooks/          # Custom hooks
├── App.jsx         # Main router
├── main.jsx        # Entry point
└── index.css       # Styles
```

---

## ⚙️ Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 3000 in use** | `npm run dev -- --port 3001` |
| **Module not found** | `npm install` again |
| **Can't connect to API** | Check backend is running & `VITE_API_BASE_URL` |
| **Styling not loading** | Clear cache, `npm run build` again |

---

## 📝 Next Steps

1. ✅ Install dependencies
2. ✅ Create .env file
3. ✅ Start dev server
4. ✅ Open http://localhost:3000
5. ✅ Start using!

---

**Enjoy the app!** 🔥
