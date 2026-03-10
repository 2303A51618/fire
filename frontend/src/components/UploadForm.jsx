import React, { useState } from 'react';
import { predictFire } from '../services/api';
import { sendFireAlertEmail, formatAlertData, shouldSendAlert } from '../services/emailService';
import { LoadingSpinner, Card, ErrorAlert, SuccessAlert } from './UI';
import FireMap from './FireMap';

export const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setEmailStatus(null);
      setEmailError(null);
      
      const data = await predictFire(file);
      setResult(data);
      setSuccess('Prediction completed successfully!');

      // Check if fire alert should be sent
      if (shouldSendAlert(data.prediction, data.confidence)) {
        // Format alert data — reads lat/lon/map_url directly from backend response
        const alertData = formatAlertData(data);
        
        // Send fire alert email
        console.log('Sending fire alert email...');
        setEmailStatus('sending');
        const emailResult = await sendFireAlertEmail(alertData);
        
        if (emailResult.success) {
          setEmailStatus('sent');
          console.log('Fire alert email sent successfully');
        } else {
          setEmailStatus('failed');
          setEmailError(emailResult.error || 'Failed to send email');
          console.error('Email sending failed:', emailResult.error);
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to make prediction');
      setResult(null);
      setEmailStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}
      
      {/* Email Status Notifications */}
      {emailStatus === 'sending' && (
        <Card className="border-2 border-yellow-300 bg-yellow-50">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-spin">⏳</span>
            <div>
              <p className="font-semibold text-yellow-800">Sending fire alert email...</p>
              <p className="text-sm text-yellow-700">Notifying alert recipients</p>
            </div>
          </div>
        </Card>
      )}
      
      {emailStatus === 'sent' && (
        <SuccessAlert 
          message="✅ Fire alert email sent successfully to alert recipients!" 
          onDismiss={() => setEmailStatus(null)} 
        />
      )}
      
      {emailStatus === 'failed' && (
        <ErrorAlert 
          message={`Failed to send fire alert email: ${emailError || 'Unknown error'}`}
          onDismiss={() => {
            setEmailStatus(null);
            setEmailError(null);
          }} 
        />
      )}

      <Card>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Upload Satellite Image</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center cursor-pointer hover:border-fire-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              {preview ? (
                <div>
                  <img src={preview} alt="Preview" className="max-h-32 sm:max-h-48 mx-auto rounded mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 truncate px-2">{file.name}</p>
                </div>
              ) : (
                <div>
                  <p className="text-3xl sm:text-4xl mb-2">📁</p>
                  <p className="text-sm sm:text-base text-gray-600">Click to select image or drag and drop</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2">Supported formats: JPG, PNG, GIF</p>
                </div>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-fire-600 hover:bg-fire-700 text-white font-bold py-3 sm:py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition text-sm sm:text-base"
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </form>
      </Card>

      {/* Results */}
      {loading && (
        <Card>
          <LoadingSpinner />
          <p className="text-center mt-4 text-gray-600">Analyzing image...</p>
        </Card>
      )}

      {result && (
        <Card className="border-2 border-green-200 bg-green-50">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Analysis Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Prediction */}
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Prediction</p>
              <p className={`text-2xl sm:text-3xl font-bold ${result.prediction === 'Fire' ? 'text-fire-600' : 'text-green-600'}`}>
                {result.prediction}
              </p>
            </div>

            {/* Confidence */}
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Confidence Score</p>
              <div className="mb-2">
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{(result.confidence * 100).toFixed(2)}%</p>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    result.confidence >= 0.7 ? 'bg-fire-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Timestamp */}
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Timestamp</p>
              <p className="text-sm sm:text-base font-semibold">{new Date(result.timestamp).toLocaleString()}</p>
            </div>

            {/* Image Hash */}
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Image Hash</p>
              <p className="text-xs sm:text-sm font-mono truncate">{result.image_hash}</p>
            </div>

            {/* Location Identifier */}
            <div className="col-span-1 sm:col-span-2">
              <p className="text-gray-600 text-xs sm:text-sm">Location Identifier (Filename)</p>
              <p className="text-sm sm:text-base font-semibold break-all">
                {result.location || result.image_name || 'unknown_location'}
              </p>
            </div>

            {/* Coordinates */}
            <div className="col-span-1 sm:col-span-2">
              <p className="text-gray-600 text-xs sm:text-sm">Location</p>
              {result.latitude != null && result.longitude != null ? (
                <>
                  <p className="text-sm font-semibold">
                    Lat: {Number(result.latitude).toFixed(6)}&nbsp;&nbsp;
                    Lon: {Number(result.longitude).toFixed(6)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {result.image_name && /^-?\d/.test(result.image_name)
                      ? '📁 Coordinates extracted from filename'
                      : '📷 Coordinates extracted from image EXIF'}
                  </p>
                  {result.map_url && (
                    <a
                      href={result.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition"
                    >
                      🗺️ Open in Google Maps
                    </a>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">Not available in filename or image metadata</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {result?.prediction === 'Fire' && result.latitude != null && result.longitude != null && (
        <Card className="border-2 border-fire-300 bg-fire-50/60">
          <div className="flex items-start gap-3 mb-4">
            <span className="text-3xl">📍</span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-fire-700">Fire Location Detected</h3>
              <p className="text-xs sm:text-sm text-fire-700 mt-1">
                Lat: {Number(result.latitude).toFixed(6)}&nbsp;&nbsp;
                Lon: {Number(result.longitude).toFixed(6)}
              </p>
              {result.map_url && (
                <a
                  href={result.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition"
                >
                  🗺️ View on Google Maps
                </a>
              )}
              <p className="text-xs text-fire-600 mt-2">
                🔥 Highlighted on map below&nbsp;•&nbsp;📧 Coordinates sent in alert email
              </p>
            </div>
          </div>
          <FireMap
            fires={[
              {
                latitude: result.latitude,
                longitude: result.longitude,
                confidence: result.confidence,
                timestamp: result.timestamp,
              },
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default UploadForm;
