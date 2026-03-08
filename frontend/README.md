# Forest Fire Monitoring System - Frontend

Production-ready React + Vite frontend for the Forest Fire Detection System.

## Features

- ✅ **Modern React 18** with Vite for fast development and optimized builds
- ✅ **Responsive Design** with TailwindCSS for all screen sizes
- ✅ **Real-time Maps** using Leaflet.js for fire location visualization
- ✅ **Interactive Charts** with Chart.js for analytics and trends
- ✅ **Image Upload** with preview and instant analysis
- ✅ **System Monitoring** dashboard and health checks
- ✅ **Alert Management** with severity indicators
- ✅ **Admin Panel** for system configuration and diagnostics
- ✅ **Axios API Integration** with error handling and interceptors
- ✅ **Global API Base URL** from environment variables

## Project Structure

```
frontend/
├── src/
│   ├── pages/                # Page components
│   │   ├── HomePage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AlertsPage.jsx
│   │   └── AdminPage.jsx
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── UI.jsx           # UI primitives
│   │   ├── UploadForm.jsx
│   │   ├── FireMap.jsx      # Leaflet map
│   │   └── Charts.jsx       # Chart.js visualizations
│   ├── services/
│   │   └── api.js           # Axios API client
│   ├── hooks/
│   │   └── useApi.js        # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind styles
├── public/                  # Static files
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # TailwindCSS config
├── postcss.config.js        # PostCSS config
├── index.html               # HTML entry point
└── .env.example             # Environment variables template
```

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Development

```bash
# Clone and navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API base URL
# VITE_API_BASE_URL=http://localhost:8000

# Start development server
npm run dev

# API available at http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Output goes to dist/ folder
```

## Pages

### 1. Home Page (`/`)
- Welcome message and project overview
- Feature highlights
- Live system status
- Quick navigation buttons

### 2. Upload Page (`/upload`)
- Drag-and-drop image upload
- Image preview before analysis
- Real-time predictions with confidence scores
- Timestamp and image hash tracking

### 3. Dashboard Page (`/dashboard`)
- System statistics (total predictions, fire count, alerts)
- Interactive charts and graphs
- Prediction trends analysis
- Fire location map
- Recent alerts table

### 4. Alerts Page (`/alerts`)
- Complete alert history
- Severity indicators
- Email notification status
- Confidence score progress bars
- Filterable by limit (10, 25, 50, 100)

### 5. Admin Page (`/admin`)
- System health monitoring
- Model and database status
- Alert threshold configuration
- Email configuration details
- System logs and events

## Components

### Navbar
- Navigation links to all pages
- Responsive mobile menu
- Project branding

### Footer
- Quick links
- Contact information
- Copyright notice

### UI Components
- `LoadingSpinner` - Loading state indicator
- `StatusBadge` - Status display component
- `Card` - Reusable card layout
- `ErrorAlert` - Error message display
- `SuccessAlert` - Success message display

### UploadForm
- File input with drag-and-drop
- Image preview
- Submission handling
- Result display

### FireMap
- Leaflet map integration
- Custom fire markers
- Popup information
- OpenStreetMap tiles

### Charts
- Confidence chart (Line chart)
- Statistics chart (Doughnut chart)
- Prediction trends (Bar chart)

## API Integration

### API Service (`src/services/api.js`)

```javascript
// Health check
await checkHealth();

// Make prediction
await predictFire(imageFile);

// Get alerts
await getAlerts(limit);

// Get statistics
await getStatistics();
```

All API calls include:
- Automatic request/response logging
- Error handling
- 30-second timeout
- Configurable base URL from environment

## Styling

### TailwindCSS Configuration

Custom colors and utilities:
- Custom fire colors (red palette)
- Custom forest colors (green palette)
- Animation configurations
- Responsive design breakpoints

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts using TailwindCSS
- Flexible containers

## Dependencies

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

## Environment Variables

Create `.env` file from `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

In production, update to your deployed backend URL:
```env
VITE_API_BASE_URL=https://api.example.com
```

## Deployment

### Render.com

1. Connect GitHub repository
2. Set Environment: Node
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run preview` or use static site with `dist/` folder
5. Add environment variables
6. Deploy!

### Vercel

1. Import GitHub project
2. Vercel auto-detects Vite
3. Add `VITE_API_BASE_URL` environment variable
4. Deploy!

### GitHub Pages

```bash
# Build
npm run build

# Deploy dist/ folder to gh-pages
```

### Self-Hosted

```bash
# Build production bundle
npm run build

# Serve dist/ folder with any web server
# Example with Python:
python -m http.server -d dist/ 3000
```

## Configuration

### Vite Config (`vite.config.js`)
- Port: 3000
- Hot Module Replacement (HMR) enabled
- Source maps disabled in production

### TailwindCSS Config (`tailwind.config.js`)
- Custom color palette (fire, forest)
- Animation presets
- Content paths for purging

## Error Handling

- Try-catch blocks in all API calls
- User-friendly error messages
- Error recovery and retry logic
- Console logging for debugging

## Performance

- Code splitting with React Router
- Lazy loading components
- Image optimization
- Efficient re-renders with React hooks
- Chart.js canvas rendering optimization

## Security

- Environment variables for sensitive data
- No credentials in code
- HTTPS-only in production
- CORS handling with API
- Input validation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Development Tips

1. Use React DevTools extension
2. Check Network tab for API calls
3. Console logs for debugging
4. Hot reloading for fast development

## Troubleshooting

### API Connection Issues
- Check `VITE_API_BASE_URL` in `.env`
- Verify backend is running
- Check browser console for errors
- Verify CORS configuration on backend

### Build Errors
- Clear `node_modules` and reinstall
- Clear `.vite` cache
- Update Node.js to latest LTS

### Styling Issues
- Clear browser cache
- Check TailwindCSS configuration
- Verify imports in components

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

Proprietary - Forest Fire Detection System

## Support

For issues or questions:
1. Check console for errors
2. Review API response in Network tab
3. Verify environment configuration
4. Check backend API status
