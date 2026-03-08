import React from 'react';
import { useHealth } from '../hooks/useApi';
import { StatusBadge, LoadingSpinner, Card } from '../components/UI';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { health, loading, error } = useHealth();

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="fire-gradient text-white py-24 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <div className="animate-float mb-6">
            <span className="text-7xl">🔥</span>
          </div>
          <h1 className="text-6xl font-bold mb-6 animate-slide-in-left drop-shadow-lg">
            Forest Fire Detection System
          </h1>
          <p className="text-2xl mb-8 text-fire-50 leading-relaxed animate-fade-in">
            Advanced AI-powered early detection for forest fire prevention and response
          </p>
          <p className="text-lg mb-10 text-fire-100 animate-fade-in">
            🌲 Protecting our forests with cutting-edge technology 🌳
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-white text-fire-700 px-10 py-4 rounded-xl font-bold hover:bg-fire-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Go to Dashboard →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-fire-500">
          <div className="text-5xl mb-4 animate-float">🤖</div>
          <h3 className="text-2xl font-bold mb-3 text-fire-700">AI-Powered Detection</h3>
          <p className="text-gray-600 leading-relaxed">
            Advanced Keras/TensorFlow models detect fires with high accuracy using deep learning
          </p>
        </Card>
        <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-forest-500">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-2xl font-bold mb-3 text-forest-700">Real-time Analytics</h3>
          <p className="text-gray-600 leading-relaxed">
            Monitor predictions and trends with interactive dashboards and live updates
          </p>
        </Card>
        <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-safety-500">
          <div className="text-5xl mb-4">📧</div>
          <h3 className="text-2xl font-bold mb-3 text-safety-700">Instant Alerts</h3>
          <p className="text-gray-600 leading-relaxed">
            Receive email notifications when fire is detected above threshold
          </p>
        </Card>
      </section>

      {/* System Status */}
      <section className="animate-fade-in">
        <h2 className="text-4xl font-bold mb-8 text-forest-800 flex items-center">
          <span className="mr-3">🖥️</span>
          System Status
        </h2>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Card className="bg-red-50 border-2 border-red-300 animate-pulse">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⚠️</span>
              <p className="text-red-700 font-semibold">Error connecting to API: {error}</p>
            </div>
          </Card>
        ) : health ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="fire-glow hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold mb-2">API Status</p>
                  <p className="text-3xl font-bold flex items-center">
                    {health.status === 'healthy' ? (
                      <span className="text-green-500 animate-pulse">✅</span>
                    ) : (
                      <span className="text-yellow-500">⚠️</span>
                    )}
                    <span className="ml-3">{health.status}</span>
                  </p>
                </div>
                <StatusBadge
                  status={health.status === 'healthy' ? 'success' : 'warning'}
                  text={health.status}
                />
              </div>
            </Card>

            <Card className="forest-gradient text-white hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-forest-50 text-sm font-semibold mb-2">Model Status</p>
                  <p className="text-3xl font-bold flex items-center">
                    {health.model_loaded ? (
                      <span className="animate-pulse">✅</span>
                    ) : (
                      <span>❌</span>
                    )}
                    <span className="ml-3">{health.model_loaded ? 'Loaded' : 'Not Loaded'}</span>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="safety-badge text-white hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-safety-50 text-sm font-semibold mb-2">Database</p>
                  <p className="text-3xl font-bold flex items-center">
                    {health.database_connected ? (
                      <span className="animate-pulse">✅</span>
                    ) : (
                      <span>❌</span>
                    )}
                    <span className="ml-3">{health.database_connected ? 'Connected' : 'Offline'}</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </section>

      {/* CTA Section */}
      <section className="forest-gradient p-10 rounded-2xl shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-10">🌲</div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4 flex items-center">
            <span className="mr-3">🚀</span>
            Ready to Get Started?
          </h2>
          <p className="text-forest-50 mb-8 text-lg leading-relaxed max-w-2xl">
            Upload satellite images to detect potential forest fires or monitor the dashboard for real-time alerts and analytics.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              to="/upload"
              className="fire-gradient px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
            >
              <span>🔥</span>
              <span>Upload Image</span>
            </Link>
            <Link
              to="/alerts"
              className="bg-white text-forest-700 px-8 py-4 rounded-xl font-bold hover:bg-forest-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
            >
              <span>🚨</span>
              <span>View Alerts</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
