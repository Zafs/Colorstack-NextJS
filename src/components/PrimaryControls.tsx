'use client';

import React, { useRef } from 'react';

interface PrimaryControlsProps {
  numBands?: number;
  onNumBandsChange?: (value: number) => void;
  layerHeight?: number;
  baseThickness?: number;
  bandThickness?: number;
  xSize?: number;
  ySize?: number;
  isAspectRatioLocked?: boolean;
  onAspectRatioLockToggle?: () => void;
  canAddLayer?: boolean;
  layerCount?: number;
  maxLayers?: number;
  onUpgradeClick?: () => void;
}

const PrimaryControls: React.FC<PrimaryControlsProps> = ({
  numBands = 4,
  onNumBandsChange,
  layerHeight = 0.2,
  baseThickness = 3,
  bandThickness = 2,
  xSize = 150,
  ySize = 120,
  isAspectRatioLocked = false,
  onAspectRatioLockToggle,
  canAddLayer = true,
  layerCount = 4,
  maxLayers = 8,
  onUpgradeClick
}) => {
  // Refs for other input elements (still needed for legacy compatibility)
  const layerHeightRef = useRef<HTMLInputElement>(null);
  const baseThicknessRef = useRef<HTMLInputElement>(null);
  const bandThicknessRef = useRef<HTMLInputElement>(null);
  const xSizeRef = useRef<HTMLInputElement>(null);
  const ySizeRef = useRef<HTMLInputElement>(null);

  // Handle Z-Bands slider input
  const handleNumBandsInput = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.currentTarget.value);
    onNumBandsChange?.(newValue);
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Primary Controls</h2>
      <div className="space-y-6">
        <div className="input-group">
          <div className="flex justify-between items-center">
            <label htmlFor="numBands">Z-Bands (Colors)</label>
            <div className="flex items-center gap-2">
              {!canAddLayer && (
                <span className="text-xs text-orange-400 bg-orange-900/20 px-2 py-1 rounded">
                  Limit: {maxLayers}
                </span>
              )}
              <div className="relative has-tooltip">
                <span className="material-icons text-gray-400 text-base cursor-help">help_outline</span>
                <div className="tooltip -top-8 right-0 px-2 py-1 bg-gray-900 text-white text-xs rounded w-40">
                  Number of color layers in the final model.
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input 
              id="numBands" 
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-track"
              max={maxLayers}
              min="2" 
              type="range" 
              value={numBands}
              onInput={handleNumBandsInput}
            />
            <span id="numBandsValue" className="font-semibold text-white">{numBands}</span>
          </div>
          {!canAddLayer && (
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-orange-400">
                Upgrade to Pro for up to 24 colors.
              </p>
              {onUpgradeClick && (
                <button
                  onClick={onUpgradeClick}
                  className="px-3 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Upgrade
                </button>
              )}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-base font-medium text-gray-300 mb-3">Layer Parameters</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="relative has-tooltip">
              <label className="text-xs text-gray-400 block mb-1" htmlFor="layerHeight">Layer Height</label>
              <input 
                ref={layerHeightRef}
                id="layerHeight" 
                className="input-field text-sm p-2 text-center" 
                type="number" 
                min="0.1" 
                max="10" 
                step="0.1" 
                defaultValue={layerHeight}
              />
              <div className="tooltip -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                Height of each layer
              </div>
            </div>
            <div className="relative has-tooltip">
              <label className="text-xs text-gray-400 block mb-1" htmlFor="baseThickness">Base Thick.</label>
              <input 
                ref={baseThicknessRef}
                id="baseThickness" 
                className="input-field text-sm p-2 text-center" 
                type="number" 
                min="0.1" 
                max="50" 
                step="0.1" 
                defaultValue={baseThickness}
              />
              <div className="tooltip -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                Base thickness
              </div>
            </div>
            <div className="relative has-tooltip">
              <label className="text-xs text-gray-400 block mb-1" htmlFor="bandThickness">Band Thick.</label>
              <input 
                ref={bandThicknessRef}
                id="bandThickness" 
                className="input-field text-sm p-2 text-center" 
                type="number" 
                min="0.1" 
                max="50" 
                step="0.1" 
                defaultValue={bandThickness}
              />
              <div className="tooltip -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                Color band thickness
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-base font-medium text-gray-300 mb-3">Model Dimensions</h3>
          <div className="flex items-end gap-3">
            <div className="flex-1 relative has-tooltip">
              <label className="text-xs text-gray-400 block mb-1" htmlFor="xSize">X Size</label>
              <input 
                ref={xSizeRef}
                id="xSize" 
                className="input-field text-sm p-2 text-center" 
                type="number" 
                min="10" 
                max="500" 
                step="1" 
                defaultValue={xSize}
              />
              <div className="tooltip -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                Width of the model
              </div>
            </div>
            <div className="flex-shrink-0 relative has-tooltip">
              <button 
                id="aspectRatioLockBtn" 
                className="w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors duration-200 border border-gray-600 hover:border-gray-500"
                onClick={onAspectRatioLockToggle}
              >
                <span className="material-icons text-lg">
                  {isAspectRatioLocked ? 'link' : 'link_off'}
                </span>
              </button>
              <div className="tooltip -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                Toggle aspect ratio lock
              </div>
            </div>
            <div className="flex-1 relative has-tooltip">
              <label className="text-xs text-gray-400 block mb-1" htmlFor="ySize">Y Size</label>
              <input 
                ref={ySizeRef}
                id="ySize" 
                className="input-field text-sm p-2 text-center" 
                type="number" 
                min="10" 
                max="500" 
                step="1" 
                defaultValue={ySize}
              />
              <div className="tooltip -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                Depth of the model
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryControls;
