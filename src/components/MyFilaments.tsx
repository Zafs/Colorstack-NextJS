'use client';

import React from 'react';

interface MyFilamentsProps {
  children?: React.ReactNode; // For the filaments list that will be dynamically generated
}

const MyFilaments: React.FC<MyFilamentsProps> = ({
  children
}) => {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Filaments</h2>
        <div className="relative has-tooltip">
          <button 
            id="addFilamentBtn" 
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 text-sm"
          >
            <span className="material-icons text-lg">add_circle_outline</span>
            Add New
          </button>
          <div className="tooltip -top-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded">
            Add a new filament
          </div>
        </div>
      </div>
      <div id="myFilamentsList" className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );
};

export default MyFilaments;
