import React from 'react';
import UploadForm from '../components/UploadForm';
import { Card } from '../components/UI';

const UploadPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Upload & Analyze</h1>
        <p className="text-gray-600 text-lg">
          Upload satellite or aerial images to detect potential forest fires. The system will analyze
          the image using advanced deep learning models and provide a confidence score.
        </p>
      </div>

      <UploadForm />

      {/* How It Works */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="space-y-3 list-decimal list-inside text-gray-700">
          <li><strong>Upload Image:</strong> Select a satellite or aerial image of the forest area</li>
          <li><strong>Image Processing:</strong> System resizes and normalizes the image to 224x224 pixels</li>
          <li><strong>AI Analysis:</strong> TensorFlow model analyzes the image for fire indicators</li>
          <li><strong>Results:</strong> Get instant prediction (Fire/No Fire) with confidence score</li>
          <li><strong>Alerts:</strong> If fire is detected, automated alerts are sent to administrators</li>
        </ol>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-l-4 border-blue-500">
        <h3 className="text-xl font-bold mb-3 flex items-center">
          💡 Tips for Best Results
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Use high-resolution satellite or drone images</li>
          <li>• Clear images provide better detection accuracy</li>
          <li>• Best results with images taken during daytime</li>
          <li>• File size should be less than 25MB</li>
        </ul>
      </Card>
    </div>
  );
};

export default UploadPage;
