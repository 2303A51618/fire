# Forest Fire Monitoring - Frontend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                  React + Vite Frontend              │
│           (Port 3000 - Development)                 │
└──────────────────────┬──────────────────────────────┘
                       │
                   HTTP/REST
                       │
                       ↓
     ┌────────────────────────────────────┐
     │   FastAPI Backend (Port 8000)      │
     │  (Loads TensorFlow Model, MongoDB) │
     └────────────────────────────────────┘
```

## Frontend Architecture

```
Components Hierarchy:

App.jsx
├── Navbar (Header Navigation)
├── Routes
│   ├── HomePage
│   │   ├── Hero Section
│   │   ├── Features Cards
│   │   └── System Status
│   ├── UploadPage
│   │   └── UploadForm
│   │       ├── File Input
│   │       ├── Preview
│   │       └── Results
│   ├── DashboardPage
│   │   ├── Statistics Cards
│   │   ├── Charts
│   │   │   ├── ConfidenceChart (Line)
│   │   │   ├── StatisticsChart (Doughnut)
│   │   │   └── PredictionTrendChart (Bar)
│   │   ├── FireMap (Leaflet)
│   │   └── Alerts Table
│   ├── AlertsPage
│   │   ├── Filter Controls
│   │   ├── Summary Cards
│   │   └── Alerts List
│   └── AdminPage
│       ├── Health Status
│       ├── Configuration Section
│       └── System Logs
└── Footer (Copyright & Links)
```

## Data Flow

### Image Upload Flow
```
1. User selects image
   ↓
2. File preview displayed
   ↓
3. User submits form
   ↓
4. UploadForm component sends to API
   ↓
5. API returns prediction
   ↓
6. Results displayed
   ↓
7. Response includes:
   - prediction (Fire/No Fire)
   - confidence (0-1)
   - timestamp (ISO)
   - image_hash (SHA256)
```

### Dashboard Data Flow
```
1. DashboardPage loads
   ↓
2. Fetch alerts and statistics in parallel
   ↓
3. Display statistics cards
   ↓
4. Render charts:
   - Confidence trends
   - Prediction distribution
   - Statistics summary
   ↓
5. Display map with markers
   ↓
6. Display recent alerts table
   ↓
7. Auto-refresh every 30 seconds
```

## State Management

### Local Component State
- File upload state
- Form submission state
- Loading/error states
- UI toggles and filters

### API State (Real-time)
- Health status (auto-refresh)
- Predictions and alerts
- Statistics
- System configuration

## API Service Layer

```
services/api.js
├── checkHealth()       → GET /health
├── predictFire()       → POST /predict
├── getAlerts()         → GET /alerts?limit=
└── getStatistics()     → GET /statistics
```

All API calls include:
- Automatic logging
- Error handling
- Request/response interceptors
- 30-second timeout

## Hooks (Custom React Hooks)

### useHealth()
- Auto-fetches health status
- Refreshes every 30 seconds
- Returns: health, loading, error

### useAsync()
- Generic async data fetching
- Manual or auto-execute
- Returns: execute, status, data, error

## Component Communication

- **Parent → Child:** Props drilling
- **Child → Parent:** Callbacks
- **Sibling:** Shared parent state
- **Global:** Context API (if needed)

## Page Structure

### Each Page Includes
1. **Page Title & Description**
2. **Content Section**
3. **Error/Success Alerts** (conditional)
4. **Loading State** (spinner)
5. **Empty State** (if no data)

### Responsive Design
- Mobile first approach
- Grid layouts
- Flex containers
- Breakpoints: sm, md, lg, xl

## Styling System

### TailwindCSS
- Utility-first styling
- Custom color palette:
  - Fire colors (red)
  - Forest colors (green)
- Animations
- Responsive utilities

### Component CSS Classes
```
bg-fire-600          // Fire red background
text-fire-700        // Fire red text
bg-forest-50         // Forest light background
hover:bg-fire-700    // Hover effects
```

## Performance Optimizations

1. **Code Splitting**
   - React Router lazy loading
   - Route-based code splitting

2. **Re-render Optimization**
   - Functional components
   - Proper key usage in lists
   - Callback memoization

3. **Image Optimization**
   - Image preview in memory
   - No unnecessary reflows

4. **Chart Optimization**
   - Chart.js canvas rendering
   - Responsive container

5. **API Efficiency**
   - Parallel requests (Promise.all)
   - Auto-refresh intervals
   - Proper cache handling

## Error Handling

### API Errors
```javascript
try {
  const data = await apiCall();
  setData(data);
} catch (err) {
  setError(err.message);
  // User sees error alert
}
```

### Validation
- File type validation
- File size checks
- Form field validation
- Range checks for sliders

## Browser Storage

Currently: No persistence
Future: Could add localStorage for:
- User preferences
- Recent uploads
- Threshold settings

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast compliance
- Screen reader friendly

## Mobile Responsive

### Breakpoints
```
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px
```

### Mobile Optimizations
- Touch-friendly buttons
- Stacked layouts
- Readable text size
- Gesture support where applicable

## Security Considerations

1. **API Communication**
   - HTTPS in production
   - No credentials in frontend code

2. **Input Validation**
   - File type checking
   - Size validation
   - Sanitization

3. **Environment Variables**
   - Never commit .env
   - Public only (VITE_)

4. **CORS**
   - Handled by backend
   - Credentials not passed

## Deployment Architecture

```
Source Code (GitHub)
        ↓
  Build Process
  (npm run build)
        ↓
    dist/ folder
   (Static files)
        ↓
   CDN / Web Server
   (Vercel/Netlify/Render)
        ↓
   User Browser (HTTPS)
```

## External Dependencies

### Core
- react: UI library
- react-dom: React renderer
- react-router-dom: Routing

### API
- axios: HTTP client

### Visualization
- leaflet: Maps
- react-leaflet: React wrapper
- chart.js: Charts
- react-chartjs-2: React wrapper

### UI
- lucide-react: Icons (optional)

### Styling
- tailwindcss: CSS utilities

## Build Output

```
dist/
├── index.html        # Entry point
├── assets/
│   ├── *.js          # Bundled JS
│   ├── *.css         # Extracted CSS
│   └── *.map         # Source maps (dev)
└── manifest.json     # Build metadata
```

- **Size optimized:** Tree-shaking, minification
- **Asset fingerprinting:** Cache busting
- **Source maps:** Error tracking (optional)

## Development Workflow

1. **Feature branch** created
2. **Local development** (npm run dev)
3. **Hot reload** on file changes
4. **Testing** in browser
5. **Build verification** (npm run build)
6. **Push to GitHub**
7. **Auto-deploy** on main branch

## Monitoring & Analytics

Optional additions:
- Sentry for error tracking
- Google Analytics
- Performance monitoring
- Real User Monitoring (RUM)

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Offline support (PWA)
- [ ] Real-time updates (WebSocket)
- [ ] Export reports (PDF/CSV)
- [ ] Custom map layers
- [ ] User authentication
- [ ] Permission management
- [ ] Advanced filtering
- [ ] Notification center

## Technology Decisions

| Decision | Why |
|----------|-----|
| React | Component-based, large ecosystem |
| Vite | Fast dev server, optimized builds |
| TailwindCSS | Utility-first, consistent styling |
| Leaflet | Lightweight, feature-rich maps |
| Chart.js | Simple, flexible charting |
| Axios | Promise-based, powerful requests |

---

**Frontend is a lightweight, responsive SPA that communicates with the FastAPI backend.**
