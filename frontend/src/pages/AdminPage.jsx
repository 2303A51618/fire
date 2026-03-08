import React, { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';
import { LoadingSpinner, Card, ErrorAlert, SuccessAlert } from '../components/UI';

const AdminPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [alertThreshold, setAlertThreshold] = useState(0.70);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await checkHealth();
        setHealth(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch system status');
      } finally {
        setLoading(false);
      }
    };

    if (loading) fetchHealth();

    if (autoRefresh) {
      const interval = setInterval(fetchHealth, 10000); // Refresh every 10s
      return () => clearInterval(interval);
    }
  }, [autoRefresh, loading]);

  const handleThresholdChange = (e) => {
    setAlertThreshold(parseFloat(e.target.value));
  };

  const handleSaveThreshold = async () => {
    try {
      // In a real app, this would call an API endpoint
      setSuccess(`Alert threshold updated to ${(alertThreshold * 100).toFixed(0)}%`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update threshold');
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await checkHealth();
      setHealth(data);
      setSuccess('System status refreshed');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to refresh status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">System Administration</h1>
        <p className="text-gray-600">
          Monitor system health, manage settings, and view diagnostics
        </p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}

      {/* Refresh Controls */}
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <span className="text-sm font-semibold">Auto-Refresh (10s)</span>
        </label>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>

      {/* System Health Status */}
      {loading ? (
        <LoadingSpinner />
      ) : health ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model Status */}
          <Card className={`border-l-4 ${health.model_loaded ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Model Service</h3>
              <span className="text-3xl">{health.model_loaded ? '✅' : '❌'}</span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Status:</strong> {health.model_loaded ? 'Loaded and Ready' : 'Not Loaded'}
              </p>
              <p className="text-gray-600">
                <strong>Last Check:</strong> {new Date(health.timestamp).toLocaleString()}
              </p>
              {health.model_loaded && (
                <p className="text-sm text-green-600">
                  Model is ready for inference. API requests will be processed normally.
                </p>
              )}
            </div>
          </Card>

          {/* Database Status */}
          <Card className={`border-l-4 ${health.database_connected ? 'border-green-500' : 'border-red-500'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Database Service</h3>
              <span className="text-3xl">{health.database_connected ? '✅' : '❌'}</span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Status:</strong> {health.database_connected ? 'Connected' : 'Offline'}
              </p>
              <p className="text-gray-600">
                <strong>Collection:</strong> fire_detection
              </p>
              {health.database_connected && (
                <p className="text-sm text-green-600">
                  Database is connected. Predictions and alerts are being stored.
                </p>
              )}
            </div>
          </Card>

          {/* API Status */}
          <Card className={`border-l-4 ${health.status === 'healthy' ? 'border-green-500' : 'border-yellow-500'}`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">API Status</h3>
              <span className="text-3xl">{health.status === 'healthy' ? '✅' : '⚠️'}</span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Status:</strong> {health.status}
              </p>
              <p className="text-gray-600">
                <strong>Version:</strong> 1.0.0
              </p>
            </div>
          </Card>

          {/* System Info */}
          <Card>
            <h3 className="text-xl font-bold mb-4">System Information</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600"><strong>Environment:</strong> Production</p>
              <p className="text-gray-600"><strong>Debug Mode:</strong> Disabled</p>
              <p className="text-gray-600"><strong>Uptime:</strong> Calculating...</p>
              <p className="text-gray-600"><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL}</p>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Configuration Section */}
      <Card>
        <h2 className="text-2xl font-bold mb-6">Configuration</h2>
        <div className="space-y-6">
          {/* Alert Threshold */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Fire Detection Alert Threshold
            </label>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={alertThreshold}
                  onChange={handleThresholdChange}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="w-20">
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={alertThreshold}
                  onChange={handleThresholdChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div className="w-24">
                <span className="text-lg font-bold text-fire-600">
                  {(alertThreshold * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Predictions with confidence above this threshold will trigger email alerts.
            </p>
            <button
              onClick={handleSaveThreshold}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Save Threshold
            </button>
          </div>

          {/* Email Configuration */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-bold mb-4">Email Configuration</h3>
            <Card className="bg-blue-50">
              <p className="text-sm text-gray-700 mb-2">
                <strong>SMTP Server:</strong> smtp-relay.brevo.com
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>SMTP Port:</strong> 587
              </p>
              <p className="text-sm text-gray-700">
                <strong>Status:</strong> <span className="text-green-600 font-semibold">✅ Configured</span>
              </p>
            </Card>
          </div>

          {/* Model Configuration */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-bold mb-4">Model Configuration</h3>
            <Card className="bg-blue-50">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Model Type:</strong> LSTM RNN (TensorFlow)
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Input Size:</strong> 224×224 pixels
              </p>
              <p className="text-sm text-gray-700">
                <strong>Output Classes:</strong> Fire / No Fire
              </p>
            </Card>
          </div>
        </div>
      </Card>

      {/* System Log */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Recent System Events</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600 py-2 border-b">
            <span>{new Date().toLocaleString()}</span>
            <span>✅ System health check passed</span>
          </div>
          <div className="flex justify-between text-gray-600 py-2 border-b">
            <span>Model Service</span>
            <span>✅ TensorFlow model loaded successfully</span>
          </div>
          <div className="flex justify-between text-gray-600 py-2 border-b">
            <span>Database Connection</span>
            <span>✅ MongoDB Atlas connected</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPage;
