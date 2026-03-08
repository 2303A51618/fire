import React, { useState } from 'react';
import { predictFire } from '../services/api';
import { LoadingSpinner, Card, ErrorAlert, SuccessAlert } from './UI';

export const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      const data = await predictFire(file);
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
    <div className="space-y-6">
      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}

      <Card>
        <h2 className="text-2xl font-bold mb-4">Upload Satellite Image</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-fire-500 transition">
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
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded mb-4" />
                  <p className="text-gray-600">{file.name}</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl mb-2">📁</p>
                  <p className="text-gray-600">Click to select image or drag and drop</p>
                  <p className="text-sm text-gray-400 mt-2">Supported formats: JPG, PNG, GIF</p>
                </div>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-fire-600 hover:bg-fire-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
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
          <h3 className="text-xl font-bold mb-4">Analysis Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Prediction */}
            <div>
              <p className="text-gray-600 text-sm">Prediction</p>
              <p className={`text-3xl font-bold ${result.prediction === 'Fire' ? 'text-fire-600' : 'text-green-600'}`}>
                {result.prediction}
              </p>
            </div>

            {/* Confidence */}
            <div>
              <p className="text-gray-600 text-sm">Confidence Score</p>
              <div className="mb-2">
                <p className="text-3xl font-bold text-blue-600">{(result.confidence * 100).toFixed(2)}%</p>
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
              <p className="text-gray-600 text-sm">Timestamp</p>
              <p className="text-lg font-semibold">{new Date(result.timestamp).toLocaleString()}</p>
            </div>

            {/* Image Hash */}
            <div>
              <p className="text-gray-600 text-sm">Image Hash</p>
              <p className="text-sm font-mono truncate">{result.image_hash}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UploadForm;
