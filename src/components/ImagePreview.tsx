'use client';

import React from 'react';

interface ImagePreviewProps {
  xDimension?: string;
  yDimension?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  xDimension = "150.0",
  yDimension = "120.0"
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Original Image</h2>
        <div className="canvas-container">
          <canvas id="origCanvas" className="rounded-lg object-cover w-full h-full"></canvas>
        </div>
      </div>
      <div className="card p-6 relative">
        <h2 className="text-lg font-semibold mb-4">Processed Preview</h2>
        <div className="canvas-container relative">
          <canvas id="procCanvas" className="rounded-lg object-cover w-full h-full"></canvas>
          <div className="absolute top-2 right-2 px-3 py-1.5 bg-indigo-600 bg-opacity-90 border border-indigo-500 rounded-lg text-xs text-white font-medium shadow-lg">
            <span id="dimension-display-x">{xDimension}</span> mm × <span id="dimension-display-y">{yDimension}</span> mm
          </div>
          
          {/* Localized spinner for processed preview */}
          <div id="spinner" className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center rounded-lg z-10" style={{ display: 'none' }}>
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="mt-4 text-sm text-gray-300">Processing image...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
