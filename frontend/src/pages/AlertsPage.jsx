import React, { useState, useEffect } from 'react';
import { getAlerts } from '../services/api';
import { LoadingSpinner, Card, ErrorAlert, StatusBadge } from '../components/UI';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(25);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await getAlerts(limit);
        setAlerts(data.alerts || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [limit]);

  const getSeverityLevel = (confidence) => {
    if (confidence >= 0.9) return { level: 'Critical', color: 'bg-red-100 text-red-800' };
    if (confidence >= 0.8) return { level: 'High', color: 'bg-orange-100 text-orange-800' };
    if (confidence >= 0.7) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Low', color: 'bg-blue-100 text-blue-800' };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Fire Alerts</h1>
        <p className="text-gray-600">
          All fire detection alerts with confidence scores and email notification status
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Load more button */}
      <div className="flex gap-2">
        {[10, 25, 50, 100].map(val => (
          <button
            key={val}
            onClick={() => setLimit(val)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              limit === val
                ? 'bg-fire-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {val}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : alerts.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-xl font-bold text-green-600">No Fire Alerts</p>
          <p className="text-gray-600 mt-2">Great news! No fires have been detected recently.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <p className="text-gray-600 text-sm">Total Alerts</p>
              <p className="text-3xl font-bold text-fire-600">{alerts.length}</p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm">Average Confidence</p>
              <p className="text-3xl font-bold text-blue-600">
                {(
                  (alerts.reduce((sum, a) => sum + a.confidence, 0) / alerts.length) * 100
                ).toFixed(2)}%
              </p>
            </Card>
            <Card>
              <p className="text-gray-600 text-sm">Emails Sent</p>
              <p className="text-3xl font-bold text-green-600">
                {alerts.filter(a => a.email_sent).length}
              </p>
            </Card>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {alerts.map((alert, idx) => {
              const severity = getSeverityLevel(alert.confidence);
              return (
                <Card key={idx} className="border-l-4 border-fire-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Time */}
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Detection Time</p>
                      <p className="text-sm">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>

                    {/* Confidence */}
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Confidence</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-16 bg-gray-300 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-fire-600"
                            style={{ width: `${alert.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">
                          {(alert.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Severity */}
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Severity</p>
                      <StatusBadge
                        status={severity.level.toLowerCase()}
                        text={severity.level}
                      />
                    </div>

                    {/* Email Status */}
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Email Sent</p>
                      <p className={`text-sm font-semibold ${alert.email_sent ? 'text-green-600' : 'text-red-600'}`}>
                        {alert.email_sent ? '✅ Yes' : '❌ No'}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Status</p>
                      <StatusBadge status="warning" text={alert.status || 'Active'} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
