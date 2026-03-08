import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="neon-navbar text-white sticky top-0 z-50 overflow-hidden">
      <div className="neon-nav-box neon-nav-box-1"></div>
      <div className="neon-nav-box neon-nav-box-2"></div>
      <div className="neon-nav-box neon-nav-box-3"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center animate-slide-in-left">
            <Link to="/" className="flex items-center space-x-3 group">
              <span className="text-3xl animate-flame">🔥</span>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight neon-title">Forest Fire Detection</span>
                <span className="text-xs text-cyan-100/90">AI-Powered Monitoring</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link to="/" className="neon-nav-link px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
              Home
            </Link>
            <Link to="/upload" className="neon-nav-link px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
              Upload
            </Link>
            <Link to="/dashboard" className="neon-nav-link px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"> 
              Dashboard
            </Link>
            <Link to="/alerts" className="neon-nav-link px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
              Alerts
            </Link>
            <Link to="/admin" className="neon-nav-link px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
