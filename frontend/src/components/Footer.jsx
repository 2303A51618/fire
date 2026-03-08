import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-forest-900 to-forest-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🌲</span>
              <h3 className="text-xl font-bold">Forest Fire Detection</h3>
            </div>
            <p className="text-forest-100 leading-relaxed">
              Advanced AI-powered system for early forest fire detection and monitoring.
              Protecting our forests with cutting-edge technology and real-time alerts.
            </p>
            <div className="flex space-x-4 mt-4">
              <span className="text-2xl">🔥</span>
              <span className="text-2xl">🚨</span>
              <span className="text-2xl">🌳</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-fire-300">Quick Links</h3>
            <ul className="space-y-2 text-forest-100">
              <li><Link to="/" className="hover:text-fire-300 transition-colors duration-200">🏠 Home</Link></li>
              <li><Link to="/upload" className="hover:text-fire-300 transition-colors duration-200">📤 Upload</Link></li>
              <li><Link to="/dashboard" className="hover:text-fire-300 transition-colors duration-200">📊 Dashboard</Link></li>
              <li><Link to="/alerts" className="hover:text-fire-300 transition-colors duration-200">🚨 Alerts</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-fire-300">Contact</h3>
            <div className="space-y-2 text-forest-100">
              <p className="flex items-center space-x-2">
                <span>📧</span>
                <span>vasu18vk@gmail.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>📍</span>
                <span>Forest Safety Division</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-forest-700 mt-8 pt-8 text-center text-forest-200">
          <p className="flex items-center justify-center space-x-2">
            <span>©</span>
            <span>2026 Forest Fire Detection System</span>
            <span>•</span>
            <span>All rights reserved</span>
            <span>🌿</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
