import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="neon-navbar text-white sticky top-0 z-50 overflow-hidden">
      <div className="neon-nav-box neon-nav-box-1"></div>
      <div className="neon-nav-box neon-nav-box-2"></div>
      <div className="neon-nav-box neon-nav-box-3"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center animate-slide-in-left">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <span className="text-2xl sm:text-3xl animate-flame">🔥</span>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-xl tracking-tight neon-title">Forest Fire Detection</span>
                <span className="text-xs text-cyan-100/90 hidden sm:inline">AI-Powered Monitoring</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="neon-nav-link px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm lg:text-base">
              Home
            </Link>
            <Link to="/upload" className="neon-nav-link px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm lg:text-base">
              Upload
            </Link>
            <Link to="/dashboard" className="neon-nav-link px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"> 
              Dashboard
            </Link>
            <Link to="/alerts" className="neon-nav-link px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm lg:text-base">
              Alerts
            </Link>
            <Link to="/admin" className="neon-nav-link px-3 lg:px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm lg:text-base">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="neon-nav-link p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            <Link 
              to="/" 
              className="block neon-nav-link px-4 py-3 rounded-lg transition-all duration-300 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link 
              to="/upload" 
              className="block neon-nav-link px-4 py-3 rounded-lg transition-all duration-300 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              📤 Upload
            </Link>
            <Link 
              to="/dashboard" 
              className="block neon-nav-link px-4 py-3 rounded-lg transition-all duration-300 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/alerts" 
              className="block neon-nav-link px-4 py-3 rounded-lg transition-all duration-300 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              🚨 Alerts
            </Link>
            <Link 
              to="/admin" 
              className="block neon-nav-link px-4 py-3 rounded-lg transition-all duration-300 text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              👤 Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
