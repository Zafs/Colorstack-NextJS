'use client';

import React from 'react';

interface UploadAreaProps {
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  const handleUploadCardClick = () => {
    // Trigger the file input click
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div id="uploadArea" className="mb-8">
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">Start with an Image</h2>
              <div 
                className="upload-area" 
                id="uploadCard"
                onClick={handleUploadCardClick}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                <div className="text-6xl text-gray-400 mb-4">↑</div>
                <div className="text-xl font-medium text-gray-300 mb-2">Upload Image</div>
                <div className="text-sm text-gray-500 mb-4">PNG, JPEG, or BMP files</div>
                <div className="text-xs text-gray-600">Drag and drop or click to browse</div>
              </div>
            </div>
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">How to Create Your 3D Model</h2>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="material-icons text-indigo-400 mt-1">upload</span>
                  <div>
                    <h3 className="font-medium text-white">Upload Your Image</h3>
                    <p className="text-sm text-gray-400">Click the upload area or drag and drop an image file to get started.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-icons text-indigo-400 mt-1">palette</span>
                  <div>
                    <h3 className="font-medium text-white">Color Processing</h3>
                    <p className="text-sm text-gray-400">ColorStack will automatically detect colors and create a palette for your 3D print.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-icons text-indigo-400 mt-1">3d_rotation</span>
                  <div>
                    <h3 className="font-medium text-white">Export STL</h3>
                    <p className="text-sm text-gray-400">Generate a multi-color STL file ready for your 3D printer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Compatible Image Formats</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-icons text-green-400">check_circle</span>
                <span className="text-gray-300">PNG files</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons text-green-400">check_circle</span>
                <span className="text-gray-300">JPEG files</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons text-green-400">check_circle</span>
                <span className="text-gray-300">BMP files</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-icons text-blue-400">info</span>
                <span className="text-gray-300">Max 10MB file size</span>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Tips</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p>• Use high contrast images for best results</p>
              <p>• Simple designs work better than complex photos</p>
              <p>• Avoid images with too many similar colors</p>
              <p>• Test with different color band settings</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default UploadArea;
