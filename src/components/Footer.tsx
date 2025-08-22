'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © 2025 ColorStack. Free browser-based tool for color-layered 3D printing.
          </div>
          <div className="flex items-center gap-6">
            <a href="/privacy.html" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
              <span className="material-icons text-lg">privacy_tip</span>
              <span className="text-sm font-medium">Privacy Policy</span>
            </a>
            <a href="/terms.html" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
              <span className="material-icons text-lg">description</span>
              <span className="text-sm font-medium">Terms of Service</span>
            </a>
            <a href="https://discord.gg/P4VyGBvzZS" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
              <span className="material-icons text-lg">chat</span>
              <span className="text-sm font-medium">Join our Discord</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
