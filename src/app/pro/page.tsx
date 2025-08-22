import React from 'react';
import Link from 'next/link';

export default function ProPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Welcome to Pro!
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            Congratulations on upgrading to ColorStack Pro! You now have access to unlimited layers, 
            unlimited exports, and all premium features.
          </p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Your Pro Benefits:</h2>
          <ul className="text-gray-300 space-y-2 text-left">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Up to 24 layers per model
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Unlimited daily exports
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              High-resolution STL export
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Save & load project files
            </li>
          </ul>
        </div>
        
        <Link 
          href="/" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          Start Creating
        </Link>
      </div>
    </div>
  );
}
