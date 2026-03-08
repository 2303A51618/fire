import React from 'react';
import { useHealth } from '../hooks/useApi';
import { StatusBadge, LoadingSpinner, Card } from '../components/UI';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { health, loading, error } = useHealth();

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 min-h-[calc(100vh-4rem)] border-y border-fire-300/30">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/AI_Forest_Fire_Detection_and_Prevention.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950/70 via-forest-900/55 to-fire-900/65"></div>
        <div className="absolute inset-0 hero-grid-overlay opacity-20"></div>
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-forest-300/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-fire-300/20 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.14),transparent_35%)]"></div>
        <div className="hero-scanline"></div>

        <div className="absolute -left-16 top-16 hidden lg:block">
          <div className="relative h-44 w-44">
            <div className="absolute inset-0 hero-radar-ring"></div>
            <div className="absolute inset-4 hero-radar-ring" style={{ animationDuration: '12s' }}></div>
            <div className="absolute inset-[34%] rounded-full bg-forest-300/70 animate-safe-pulse"></div>
          </div>
        </div>

        <div className="absolute left-8 bottom-10 hidden md:block">
          <div className="h-2 w-2 rounded-full bg-fire-200 animate-ember" style={{ animationDelay: '0s' }}></div>
          <div className="h-3 w-3 rounded-full bg-fire-300 animate-ember" style={{ animationDelay: '1.1s' }}></div>
          <div className="h-2.5 w-2.5 rounded-full bg-fire-100 animate-ember" style={{ animationDelay: '2.2s' }}></div>
        </div>

        <div className="absolute right-10 top-10 hidden md:flex items-center gap-3 bg-forest-300/15 border border-forest-100/35 px-4 py-2 rounded-full hero-safe-glow animate-safe-pulse">
          <span className="text-lg">🛡️</span>
          <span className="text-sm font-semibold tracking-wide">Safety Layer Active</span>
        </div>

        <div className="relative px-6 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20 min-h-[calc(100vh-4rem)] flex items-center">
          <div className="max-w-7xl w-full">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-5 rounded-full bg-white/15 px-4 py-2 border border-white/25 hero-fire-glow">
                <span className="text-xl animate-flame">🔥</span>
                <span className="text-sm md:text-base font-semibold tracking-wide">Early Detection. Faster Response.</span>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/20 border border-white/20 px-3 py-1 text-xs md:text-sm font-semibold hero-flicker">24/7 Watch</span>
                <span className="rounded-full bg-black/20 border border-white/20 px-3 py-1 text-xs md:text-sm font-semibold">Rapid Alerting</span>
                <span className="rounded-full bg-black/20 border border-white/20 px-3 py-1 text-xs md:text-sm font-semibold">Wildfire Risk AI</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-md hero-glow-sweep text-left">
                <span className="text-cyan-300">Forest Fire Detection</span>
                <span className="block text-orange-400">Control Room</span>
              </h1>

              <p className="mt-5 text-base md:text-lg text-fire-50 max-w-2xl leading-relaxed">
                Monitor high-risk zones with AI-based image analysis, trigger rapid alerts, and reduce response time before incidents escalate.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 bg-white text-fire-800 px-6 py-3 rounded-xl font-bold hover:bg-fire-50 transition-all duration-300 transform hover:scale-105 hero-fire-glow hero-cta-fire"
                >
                  <span>📤</span>
                  <span>Start Detection</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-black/20 text-white px-6 py-3 rounded-xl font-bold border border-white/30 hover:bg-black/30 transition-all duration-300 transform hover:scale-105 hero-safe-glow"
                >
                  <span>📊</span>
                  <span>Open Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
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
