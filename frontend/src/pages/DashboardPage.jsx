import React, { useState, useEffect, useRef } from 'react';
import { getAlerts, getStatistics } from '../services/api';
import { LoadingSpinner, Card, ErrorAlert } from '../components/UI';
import FireMap from '../components/FireMap';
import { ConfidenceChart, StatisticsChart, PredictionTrendChart } from '../components/Charts';
import { formatToUserTime } from '../utils/time';
import { playFireAlertSound, isAlertMuted, setAlertMuted } from '../utils/alertSound';

const DashboardPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [isMuted, setIsMuted] = useState(isAlertMuted());
  const lastFireEventRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [alertsData, statsData] = await Promise.all([
          getAlerts(20),
          getStatistics(),
        ]);
        const nextAlerts = alertsData.alerts || [];
        setAlerts(nextAlerts);
        setStats(statsData);

        // Trigger audible + visual alert for newly observed fire event/email transition.
        const latestFire = nextAlerts.find((a) => a.prediction === 'Fire');
        if (latestFire) {
          const eventKey = `${latestFire._id || latestFire.timestamp}-${latestFire.email_sent ? 'email-sent' : 'email-pending'}`;

          if (lastFireEventRef.current === null) {
            // First poll snapshot: register baseline to avoid alerting old data.
            lastFireEventRef.current = eventKey;
          } else if (lastFireEventRef.current !== eventKey) {
            lastFireEventRef.current = eventKey;
            setShowEmergencyAlert(true);
            await playFireAlertSound(eventKey);
          }
        }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>
        <button
          onClick={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            setAlertMuted(nextMuted);
          }}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition ${
            isMuted
              ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
          }`}
        >
          {isMuted ? '🔇 Alarm Muted' : '🔊 Alarm On'}
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {showEmergencyAlert && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3">
          <p className="font-semibold text-red-700">🚨 Fire Detected — Alert Sent</p>
          <button
            onClick={() => setShowEmergencyAlert(false)}
            className="text-xs font-semibold text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
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
          <Card>
            <p className="text-gray-600 text-xs sm:text-sm">Emails Sent</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.sent_alert_emails || 0}</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-2xl font-bold">Fire Locations Map</h2>
          <span className="text-sm text-gray-500">
            {alerts.filter(a => a.latitude != null && a.longitude != null).length} of {alerts.length} alerts have coordinates
          </span>
        </div>

        {/* Latest Located Fire spotlight */}
        {(() => {
          const latest = alerts.find(a => a.latitude != null && a.longitude != null);
          if (!latest) return null;
          const isFromFilename = latest.image_name && /^-?\d/.test(latest.image_name) && latest.image_name.includes(',');
          const mapLink = latest.map_url || `https://maps.google.com/?q=${latest.latitude},${latest.longitude}`;
          return (
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 bg-fire-50 border border-fire-200 rounded-lg px-4 py-3">
              <span className="text-3xl">📍</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-fire-700 text-sm">Latest Located Fire</p>
                <p className="text-xs text-gray-700 mt-0.5 font-mono">
                  Lat: {Number(latest.latitude).toFixed(6)}&nbsp;&nbsp;
                  Lon: {Number(latest.longitude).toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isFromFilename ? '📁 Coordinates from filename' : '📷 Coordinates from EXIF'}
                  {latest.image_name && <span className="ml-2 text-gray-400">{latest.image_name}</span>}
                </p>
              </div>
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-full transition"
              >
                🗺️ Google Maps
              </a>
            </div>
          );
        })()}

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
                <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Location</th>
                <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Status</th>
                <th className="text-left p-2 sm:p-3 text-xs sm:text-sm">Email Sent</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, idx) => {
                const hasCoords = alert.latitude != null && alert.longitude != null;
                const mapLink = alert.map_url || (hasCoords ? `https://maps.google.com/?q=${alert.latitude},${alert.longitude}` : null);
                return (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{formatToUserTime(alert.timestamp)}</td>
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
                      {hasCoords ? (
                        <div className="space-y-0.5">
                          <p className="text-xs font-mono text-gray-700">
                            {Number(alert.latitude).toFixed(4)}, {Number(alert.longitude).toFixed(4)}
                          </p>
                          {mapLink && (
                            <a
                              href={mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              🗺️ Map
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No coords</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3">
                      <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm">
                        {alert.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">
                      {alert.email_sent ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-300 font-semibold">
                          ✅ Sent
                        </span>
                      ) : alert.email_status === 'failed' ? (
                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-300 font-semibold">
                          ❌ Failed
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300 font-semibold">
                          ⏳ Pending
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
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
