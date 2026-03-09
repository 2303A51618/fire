import React, { useState, useEffect } from 'react';
import { getAlerts, getStatistics } from '../services/api';
import { LoadingSpinner, Card, ErrorAlert } from '../components/UI';
import FireMap from '../components/FireMap';
import { ConfidenceChart, StatisticsChart, PredictionTrendChart } from '../components/Charts';

const DashboardPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [alertsData, statsData] = await Promise.all([
          getAlerts(20),
          getStatistics(),
        ]);
        setAlerts(alertsData.alerts || []);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>

      {error && <ErrorAlert message={error} />}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <p className="text-gray-600 text-xs sm:text-sm">Total Predictions</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.total_predictions || 0}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-xs sm:text-sm">Fire Detected</p>
            <p className="text-2xl sm:text-3xl font-bold text-fire-600">{stats.fire_predictions || 0}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-xs sm:text-sm">No Fire</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.no_fire_predictions || 0}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-xs sm:text-sm">Active Alerts</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.total_alerts || 0}</p>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          {stats && <PredictionTrendChart stats={stats} />}
        </Card>
        <Card>
          {stats && <StatisticsChart stats={stats} />}
        </Card>
      </div>

      {/* Confidence Chart */}
      <Card>
        {alerts.length > 0 ? (
          <ConfidenceChart alerts={alerts} />
        ) : (
          <p className="text-center text-gray-600">No alerts yet</p>
        )}
      </Card>

      {/* Map */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Fire Locations Map</h2>
        <FireMap fires={alerts} />
      </Card>

      {/* Recent Alerts Table */}
      <Card>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Recent Alerts</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Time</th>
                <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Confidence</th>
                <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Status</th>
                <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Email Sent</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{new Date(alert.timestamp).toLocaleString()}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-8 sm:w-12 bg-gray-300 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-fire-600"
                          style={{ width: `${alert.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold">{(alert.confidence * 100).toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="p-2 sm:p-3">
                    <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm">
                      {alert.status}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{alert.email_sent ? '✅ Yes' : '❌ No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {alerts.length === 0 && (
            <p className="text-center text-gray-600 py-8">No recent alerts</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
