import axios from 'axios';

const resolveApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  // Safe local fallback for development only.
  if (import.meta.env.DEV) return 'http://localhost:8000';

  // Production fallback to deployed backend if env vars are missing.
  return 'https://fire-pzy4.onrender.com';
};

const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const status = error?.response?.status;
  const code = error?.code;
  const message = String(error?.message || '').toLowerCase();

  if ([502, 503, 504].includes(status)) return true;
  if (code === 'ECONNABORTED') return true;
  if (message.includes('network error')) return true;
  return false;
};

const withRetry = async (requestFn, { retries = 3, initialDelayMs = 1500 } = {}) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (attempt === retries || !isRetryableError(error)) {
        throw error;
      }
      const delayMs = initialDelayMs * (attempt + 1);
      await wait(delayMs);
    }
  }
  throw lastError;
};

export const warmUpApi = async () => {
  // Trigger backend wake-up after idle periods (Render cold starts).
  return withRetry(() => api.get('/health', { timeout: 10000 }), {
    retries: 5,
    initialDelayMs: 2000,
  });
};

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
    const response = await withRetry(() => api.get('/health'), {
      retries: 4,
      initialDelayMs: 2000,
    });
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error.message);
    throw error;
  }
};

// Make prediction
export const predictFire = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 45000,
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
    const response = await withRetry(() => api.get('/alerts', {
      params: { limit },
    }), {
      retries: 4,
      initialDelayMs: 1500,
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
    const response = await withRetry(() => api.get('/statistics'), {
      retries: 4,
      initialDelayMs: 1500,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch statistics:', error.message);
    throw error;
  }
};

export default api;
