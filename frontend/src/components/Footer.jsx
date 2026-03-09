import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-forest-900 to-forest-800 text-white mt-8 sm:mt-12 lg:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About */}
          <div className="col-span-1 sm:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl sm:text-3xl">🌲</span>
              <h3 className="text-lg sm:text-xl font-bold">Forest Fire Detection</h3>
            </div>
            <p className="text-sm sm:text-base text-forest-100 leading-relaxed">
              Advanced AI-powered system for early forest fire detection and monitoring.
              Protecting our forests with cutting-edge technology and real-time alerts.
            </p>
            <div className="flex space-x-3 sm:space-x-4 mt-4">
              <span className="text-xl sm:text-2xl">🔥</span>
              <span className="text-xl sm:text-2xl">🚨</span>
              <span className="text-xl sm:text-2xl">🌳</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-fire-300">Quick Links</h3>
            <ul className="space-y-2 text-sm sm:text-base text-forest-100">
              <li><Link to="/" className="hover:text-fire-300 transition-colors duration-200">🏠 Home</Link></li>
              <li><Link to="/upload" className="hover:text-fire-300 transition-colors duration-200">📤 Upload</Link></li>
              <li><Link to="/dashboard" className="hover:text-fire-300 transition-colors duration-200">📊 Dashboard</Link></li>
              <li><Link to="/alerts" className="hover:text-fire-300 transition-colors duration-200">🚨 Alerts</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-fire-300">Contact</h3>
            <div className="space-y-2 text-sm sm:text-base text-forest-100">
              <p className="flex items-center space-x-2">
                <span>📧</span>
                <span className="break-all">vasu18vk@gmail.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>📍</span>
                <span>Forest Safety Division</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-forest-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-forest-200">
          <p className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 text-xs sm:text-sm">
            <span className="flex items-center space-x-2">
              <span>©</span>
              <span>2026 Forest Fire Detection System</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center space-x-2 mt-1 sm:mt-0">
              <span>All rights reserved</span>
              <span>🌿</span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
