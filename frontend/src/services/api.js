import axios from 'axios';

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  // Safe local fallback for development only.
  if (import.meta.env.DEV) return 'http://localhost:8000';

  // Prevent accidental localhost calls from production builds.
  return `${window.location.protocol}//${window.location.hostname}:8000`;
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error.message);
    throw error;
  }
};

// Make prediction
export const predictFire = async (imageFile, coords = null) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    if (coords?.latitude != null && coords?.longitude != null) {
      formData.append('latitude', String(coords.latitude));
      formData.append('longitude', String(coords.longitude));
    }
    
    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Prediction error:', error.message);
    throw error;
  }
};

// Get recent alerts
export const getAlerts = async (limit = 10) => {
  try {
    const response = await api.get('/alerts', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch alerts:', error.message);
    throw error;
  }
};

// Get statistics
export const getStatistics = async () => {
  try {
    const response = await api.get('/statistics');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch statistics:', error.message);
    throw error;
  }
};

export default api;
