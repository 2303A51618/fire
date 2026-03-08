import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="fire-gradient text-white shadow-2xl backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center animate-slide-in-left">
            <Link to="/" className="flex items-center space-x-3 group">
              <span className="text-3xl animate-flame">🔥</span>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight">Forest Fire Detection</span>
                <span className="text-xs text-fire-100 opacity-90">AI-Powered Monitoring</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link to="/" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
              Home
            </Link>
            <Link to="/upload" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
              Upload
            </Link>
            <Link to="/dashboard" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:shadow-lg transform hover:scale-105"> 
              Dashboard
            </Link>
            <Link to="/alerts" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
              Alerts
            </Link>
            <Link to="/admin" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
