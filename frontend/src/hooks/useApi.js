import { useState, useEffect } from 'react';
import { checkHealth, warmUpApi } from '../services/api';

export const useHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        await warmUpApi();
        const data = await checkHealth();
        setHealth(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setHealth(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return { health, loading, error };
};

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return { execute, status, data, error };
};
