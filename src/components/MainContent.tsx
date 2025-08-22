'use client';

import React from 'react';
import ImagePreview from './ImagePreview';
import LayerPreview from './LayerPreview';
import PrimaryControls from './PrimaryControls';
import ColorPalette from './ColorPalette';
import MyFilaments from './MyFilaments';

interface MainContentProps {
  // Image preview props
  xDimension?: string;
  yDimension?: string;
  
  // Layer preview props
  currentLayer?: number;
  layerPreviewMaxLayers?: number;
  onLayerChange?: (layer: number) => void;
  
  // Primary controls props
  numBands?: number;
  onNumBandsChange?: (value: number) => void;
  layerHeight?: number;
  baseThickness?: number;
  bandThickness?: number;
  xSize?: number;
  ySize?: number;
  isAspectRatioLocked?: boolean;
  onAspectRatioLockToggle?: () => void;
  
  // Color palette props
  activePalette?: 'suggested' | 'my';
  onPaletteChange?: (palette: 'suggested' | 'my') => void;
  onInvertPalette?: () => void;
  
  // Tier limits props
  canAddLayer?: boolean;
  layerCount?: number;
  maxLayers?: number;
  
  // Upgrade handler
  onUpgradeClick?: () => void;
  
  // Children for dynamic content
  paletteChildren?: React.ReactNode;
  filamentsChildren?: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({
  xDimension = "150.0",
  yDimension = "120.0",
  currentLayer = 1,
  layerPreviewMaxLayers = 4,
  onLayerChange,
  numBands = 4,
  onNumBandsChange,
  layerHeight = 0.2,
  baseThickness = 3,
  bandThickness = 2,
  xSize = 150,
  ySize = 120,
  isAspectRatioLocked = false,
  onAspectRatioLockToggle,
  activePalette = 'suggested',
  onPaletteChange,
  onInvertPalette,
  canAddLayer = true,
  layerCount = 4,
  maxLayers: tierMaxLayers = 8,
  onUpgradeClick,
  paletteChildren,
  filamentsChildren
}) => {
  return (
    <div id="mainContent">
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ImagePreview 
            xDimension={xDimension}
            yDimension={yDimension}
          />
          <LayerPreview 
            currentLayer={currentLayer}
            maxLayers={layerPreviewMaxLayers}
            onLayerChange={onLayerChange}
          />
        </div>
        <aside className="flex flex-col gap-6">
          <PrimaryControls 
            numBands={numBands}
            onNumBandsChange={onNumBandsChange}
            layerHeight={layerHeight}
            baseThickness={baseThickness}
            bandThickness={bandThickness}
            xSize={xSize}
            ySize={ySize}
            isAspectRatioLocked={isAspectRatioLocked}
            onAspectRatioLockToggle={onAspectRatioLockToggle}
            canAddLayer={canAddLayer}
            layerCount={layerCount}
            maxLayers={tierMaxLayers}
            onUpgradeClick={onUpgradeClick}
          />
          <ColorPalette 
            activePalette={activePalette}
            onPaletteChange={onPaletteChange}
            onInvertPalette={onInvertPalette}
          >
            {paletteChildren}
          </ColorPalette>
          <MyFilaments>
            {filamentsChildren}
          </MyFilaments>
        </aside>
      </main>
    </div>
  );
};

export default MainContent;
