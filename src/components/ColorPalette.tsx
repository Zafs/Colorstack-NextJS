'use client';

import React from 'react';

interface ColorPaletteProps {
  activePalette?: 'suggested' | 'my';
  onPaletteChange?: (palette: 'suggested' | 'my') => void;
  onInvertPalette?: () => void;
  children?: React.ReactNode; // For the palette colors that will be dynamically generated
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
  activePalette = 'suggested',
  onPaletteChange,
  onInvertPalette,
  children
}) => {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Color Palette</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center bg-gray-800 p-1 rounded-lg">
          <button 
            id="suggestedPaletteBtn" 
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              activePalette === 'suggested' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onPaletteChange?.('suggested')}
          >
            Suggested
          </button>
          <button 
            id="myPaletteBtn" 
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              activePalette === 'my' 
                ? 'bg-indigo-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onPaletteChange?.('my')}
          >
            My Palette
          </button>
        </div>
        <div className="relative has-tooltip">
          <button 
            id="invertPaletteBtn" 
            className="p-2 rounded-full hover:bg-gray-700"
            onClick={onInvertPalette}
          >
            <span className="material-icons text-gray-400">swap_vert</span>
          </button>
          <div className="tooltip -top-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded">
            Reverse color order
          </div>
        </div>
      </div>
      <div id="palette" className="grid grid-cols-8 gap-2">
        {children}
      </div>
      <p className="text-xs text-gray-400 mt-2">Drag to reorder layers (Z-Bands).</p>
    </div>
  );
};

export default ColorPalette;
