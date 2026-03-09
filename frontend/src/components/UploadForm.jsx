import React, { useState } from 'react';
import { predictFire } from '../services/api';
import { LoadingSpinner, Card, ErrorAlert, SuccessAlert } from './UI';
import FireMap from './FireMap';

export const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [coords, setCoords] = useState(null);

  const getBrowserLocation = () => new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 120000 }
    );
  });

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
      const location = await getBrowserLocation();
      setCoords(location);
      const data = await predictFire(file, location);
      setResult(data);
      setSuccess('Prediction completed successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to make prediction');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}

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

            {/* Coordinates */}
            <div className="col-span-1 sm:col-span-2">
              <p className="text-gray-600 text-xs sm:text-sm">Coordinates</p>
              <p className="text-sm font-semibold">
                {result.latitude != null && result.longitude != null
                  ? `${Number(result.latitude).toFixed(6)}, ${Number(result.longitude).toFixed(6)}`
                  : coords
                    ? `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
                    : 'Not available'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {result?.prediction === 'Fire' && (result.latitude != null || coords) && (
        <Card className="border-2 border-fire-300 bg-fire-50/60">
          <h3 className="text-lg sm:text-xl font-bold mb-3 text-fire-700">Fire Detected Location</h3>
          <p className="text-xs sm:text-sm text-fire-700 mb-4">
            Highlighted on map and included in alert email coordinates.
          </p>
          <FireMap
            fires={[
              {
                latitude: result.latitude ?? coords?.latitude,
                longitude: result.longitude ?? coords?.longitude,
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
