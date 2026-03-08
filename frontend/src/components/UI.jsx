import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fire-600"></div>
    </div>
  );
};

export const StatusBadge = ({ status, text }) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${colors[status] || colors.info}`}>
      {text}
    </span>
  );
};

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export const ErrorAlert = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <span className="block sm:inline">{message}</span>
      {onDismiss && (
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={onDismiss}>
          ×
        </span>
      )}
    </div>
  );
};

export const SuccessAlert = ({ message, onDismiss }) => {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
      <span className="block sm:inline">{message}</span>
      {onDismiss && (
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={onDismiss}>
          ×
        </span>
      )}
    </div>
  );
};

export default {
  LoadingSpinner,
  StatusBadge,
  Card,
  ErrorAlert,
  SuccessAlert,
};
