'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LayerPreviewProps {
  currentLayer?: number;
  maxLayers?: number;
  onLayerChange?: (layer: number) => void;
}

const LayerPreview: React.FC<LayerPreviewProps> = ({
  currentLayer = 1,
  maxLayers = 4
}) => {
  const layerSliderRef = useRef<HTMLInputElement>(null);
  const singleLayerToggleRef = useRef<HTMLInputElement>(null);
  const [debouncedLayer, setDebouncedLayer] = useState(currentLayer);

  // Update the maxLayers display when the prop changes
  useEffect(() => {
    const maxLayersElement = document.getElementById('maxLayers');
    if (maxLayersElement) {
      maxLayersElement.textContent = maxLayers.toString();
    }
    
    // Update the layer slider max value
    if (layerSliderRef.current) {
      layerSliderRef.current.max = (maxLayers - 1).toString();
    }
  }, [maxLayers]);

  // Debounced effect for layer changes to reduce spammy image processing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.appState && window.handleSettingsChange) {
        window.appState.currentLayer = debouncedLayer;
        window.handleSettingsChange();
      }
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [debouncedLayer]);

  useEffect(() => {
    // Set up event listeners for legacy JavaScript compatibility
    const setupEventListeners = () => {
      if (layerSliderRef.current) {
        layerSliderRef.current.addEventListener('input', (e) => {
          const value = parseInt((e.target as HTMLInputElement).value);
          const newLayer = value + 1;
          
          // Update the layer value display immediately for responsive UI
          const layerValueElement = document.getElementById('layerValue');
          if (layerValueElement) {
            layerValueElement.textContent = newLayer.toString();
          }
          
          // Update the debounced layer state (this will trigger the debounced effect)
          setDebouncedLayer(newLayer);
        });
      }

      if (singleLayerToggleRef.current) {
        singleLayerToggleRef.current.addEventListener('change', (e) => {
          const isChecked = (e.target as HTMLInputElement).checked;
          // Trigger legacy update
          if (window.appState) {
            window.appState.isSingleLayerMode = isChecked;
            if (window.handleSettingsChange) {
              window.handleSettingsChange();
            }
          }
        });
      }
    };

    // Wait for elements to be available
    const waitForElements = () => {
      if (layerSliderRef.current && singleLayerToggleRef.current) {
        setupEventListeners();
      } else {
        setTimeout(waitForElements, 50);
      }
    };

    waitForElements();
  }, []);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Layer Preview</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Layer <span id="layerValue">{currentLayer}</span> / <span id="maxLayers">{maxLayers}</span>
          </span>
          <div className="relative has-tooltip flex items-center gap-2">
            <input 
              ref={singleLayerToggleRef}
              id="singleLayerToggle" 
              type="checkbox"
              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2"
            />
            <label htmlFor="singleLayerToggle" className="text-sm text-gray-300 cursor-pointer">
              Single Layer
            </label>
            <div className="tooltip -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
              Toggle single layer view
            </div>
          </div>
        </div>
      </div>
      <div className="relative has-tooltip flex items-center gap-4">
        <span className="material-icons text-gray-400">layers</span>
        <input 
          ref={layerSliderRef}
          id="layerSlider" 
          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-track" 
          max={maxLayers - 1} 
          min="0" 
          type="range" 
          defaultValue={currentLayer - 1}
        />
        <div className="tooltip -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
          Scrub through layers
        </div>
      </div>
    </div>
  );
};

export default LayerPreview;
