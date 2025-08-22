'use client';

import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import UploadArea from './UploadArea';
import MainContent from './MainContent';
import Modal from './Modal';
import Footer from './Footer';
import UpgradeModal from './UpgradeModal';
import AccountModal from './AccountModal';
import { useTierLimits } from '../hooks/useTierLimits';
import { UsageTracker } from '../lib/usageTracker';

interface ColorStackAppProps {
  // We'll keep the legacy script loading for now
  onLegacyScriptLoad?: () => void;
}

const ColorStackApp: React.FC<ColorStackAppProps> = ({ onLegacyScriptLoad }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLayerCount, setCurrentLayerCount] = useState(4); // Default to 4 bands
  const [currentLayer, setCurrentLayer] = useState(1); // Track current layer value
  const [activePalette, setActivePalette] = useState<'suggested' | 'my'>('suggested'); // Add state for active palette
  const [numBands, setNumBands] = useState(4); // State for number of bands
  const [upgradeModalState, setUpgradeModalState] = useState<{
    isOpen: boolean;
    reason: 'layers' | 'exports';
    currentCount: number;
    maxCount: number;
  }>({
    isOpen: false,
    reason: 'layers',
    currentCount: 0,
    maxCount: 8
  });
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  
  // Refs for legacy JavaScript compatibility
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);

  // Get tier limits
  const tierLimits = useTierLimits(numBands);

  // Debounced effect for numBands changes to reduce spammy image processing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.handleNumBandsChange) {
        window.handleNumBandsChange(numBands);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [numBands]);

  // Update current layer when layer slider changes
  useEffect(() => {
    const updateCurrentLayer = () => {
      const layerValueElement = document.getElementById('layerValue');
      if (layerValueElement) {
        const newLayer = parseInt(layerValueElement.textContent || '1', 10);
        if (!isNaN(newLayer)) {
          setCurrentLayer(newLayer);
        }
      }
    };

    // Set up observer to watch for changes to layerValue
    const layerValueElement = document.getElementById('layerValue');
    if (layerValueElement) {
      const observer = new MutationObserver(updateCurrentLayer);
      observer.observe(layerValueElement, { childList: true, subtree: true });
      
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    // Load CSS and external resources from legacy.html
    const loadLegacyResources = async () => {
      try {
        // Fetch the legacy HTML content
        const response = await fetch('/legacy.html');
        const html = await response.text();
        
        // Extract CSS styles from the head
        const styleMatch = html.match(/<style[^>]*>([\s\S]*)<\/style>/i);
        if (styleMatch) {
          const styleContent = styleMatch[1];
          // Create and inject the style tag
          const style = document.createElement('style');
          style.textContent = styleContent;
          document.head.appendChild(style);
        }
        
        // Extract external CSS links from the head
        const linkMatches = html.match(/<link[^>]*rel="stylesheet"[^>]*>/gi);
        if (linkMatches) {
          linkMatches.forEach(linkTag => {
            const hrefMatch = linkTag.match(/href="([^"]*)"/i);
            if (hrefMatch && !document.querySelector(`link[href="${hrefMatch[1]}"]`)) {
              const link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = hrefMatch[1];
              document.head.appendChild(link);
            }
          });
        }
        
        // Extract external script tags from the head
        const scriptMatches = html.match(/<script[^>]*src="([^"]*)"[^>]*>/gi);
        if (scriptMatches) {
          scriptMatches.forEach(scriptTag => {
            const srcMatch = scriptTag.match(/src="([^"]*)"/i);
            if (srcMatch && !document.querySelector(`script[src="${srcMatch[1]}"]`)) {
              const script = document.createElement('script');
              script.src = srcMatch[1];
              script.async = true;
              document.head.appendChild(script);
            }
          });
        }
        
        console.log('Legacy resources loaded successfully');
      } catch (error) {
        console.error('Failed to load legacy resources:', error);
      }
    };

    // Load legacy resources first
    loadLegacyResources();

    // Set a flag to prevent legacy JavaScript from setting up file input listeners
    window.skipFileInputSetup = true;

    // Then load the legacy script
    const script = document.createElement('script');
    script.src = '/js/main.js';
    script.onload = () => {
      console.log('Legacy script loaded');
      // Wait for React to finish rendering and DOM elements to be available
      const waitForElements = () => {
        const requiredElements = [
          'uploadArea', 'uploadCard', 'mainContent', 'fileInput',
          'origCanvas', 'procCanvas', 'palette', 'numBands',
          'layerHeight', 'bandThickness', 'baseThickness', 'xSize', 'ySize',
          'addFilamentBtn', 'myFilamentsList', 'numBandsValue',
          'aspectRatioLockBtn', 'layerSlider', 'layerValue', 'maxLayers',
          'singleLayerToggle', 'exportBtn', 'newImageBtn', 'instructionsBtn',
          'suggestedPaletteBtn', 'myPaletteBtn', 'invertPaletteBtn',
          'modal', 'modalTitle', 'modalBody', 'modalCloseBtn',
          'dimension-display-x', 'dimension-display-y'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
          console.log('Waiting for elements:', missingElements);
          setTimeout(waitForElements, 50);
        } else {
          console.log('All required elements found, initializing legacy app');
          // Trigger window.onload to start the legacy app
          if (window.onload) {
            window.onload(new Event('load'));
          }
          
                     // Add debugging for image worker
           setTimeout(() => {
             if (window.appState && window.appState.imageWorker) {
               console.log('✅ Image worker is initialized and ready');
             } else {
               console.log('⚠️ Image worker may not be initialized yet');
             }
           }, 1000);
           
           // Check for preserved state after authentication
           const preservedState = localStorage.getItem('colorstack_preserved_state');
           if (preservedState) {
             try {
               const state = JSON.parse(preservedState);
               if (state.hasImage && state.imageDataUrl) {
                 console.log('🔄 Restoring preserved app state after authentication...');
                 
                 // Restore the image
                 const img = new Image();
                 img.onload = async () => {
                   console.log('✅ Restored image from localStorage');
                   if (window.appState) {
                     window.appState.img = img;
                     
                     // Restore all the app state
                     Object.assign(window.appState, {
                     numBands: state.numBands,
                     layerHeight: state.layerHeight,
                     baseThickness: state.baseThickness,
                     bandThickness: state.bandThickness,
                     xSize: state.xSize,
                     ySize: state.ySize,
                     aspectRatioLocked: state.aspectRatioLocked,
                     originalAspectRatio: state.originalAspectRatio,
                     currentPalette: state.currentPalette,
                     suggestedPalette: state.suggestedPalette,
                     activePalette: state.activePalette,
                     currentLayer: state.currentLayer,
                     isSingleLayerMode: state.isSingleLayerMode
                   });
                   
                   // Update UI elements to reflect restored state
                   if (window.domElements) {
                     if (window.domElements.numBandsInput) {
                       window.domElements.numBandsInput.value = String(state.numBands);
                     }
                     if (window.domElements.layerHeightInput) {
                       window.domElements.layerHeightInput.value = String(state.layerHeight);
                     }
                     if (window.domElements.baseThicknessInput) {
                       window.domElements.baseThicknessInput.value = String(state.baseThickness);
                     }
                     if (window.domElements.bandThicknessInput) {
                       window.domElements.bandThicknessInput.value = String(state.bandThickness);
                     }
                     if (window.domElements.xSizeInput) {
                       window.domElements.xSizeInput.value = String(state.xSize);
                     }
                     if (window.domElements.ySizeInput) {
                       window.domElements.ySizeInput.value = String(state.ySize);
                     }
                   }
                   
                                       // Trigger the legacy app to process the restored image
                    if (typeof window.handleFile === 'function') {
                      // Convert data URL back to a File object
                      try {
                        const response = await fetch(state.imageDataUrl);
                        const blob = await response.blob();
                        const file = new File([blob], 'restored-image.png', { type: 'image/png' });
                        
                        // Call handleFile with the actual File object
                        window.handleFile(file);
                      } catch (error) {
                        console.error('Failed to convert data URL to file:', error);
                        // Fallback: try to trigger the legacy processing directly
                        if (window.appState && window.appState.img) {
                          // Trigger a settings change to update the UI
                          if (typeof window.handleSettingsChange === 'function') {
                            window.handleSettingsChange();
                          }
                        }
                      }
                    }
                   
                   // Show main content instead of upload area
                   const uploadArea = document.getElementById('uploadArea');
                   const mainContent = document.getElementById('mainContent');
                   if (uploadArea && mainContent) {
                     uploadArea.style.display = 'none';
                     mainContent.style.display = 'block';
                   }
                   
                   // Clean up localStorage
                   localStorage.removeItem('colorstack_preserved_state');
                   console.log('✅ App state restored successfully');
                   }
                 };
                 img.onerror = () => {
                   console.error('Failed to restore image from localStorage');
                   localStorage.removeItem('colorstack_preserved_state');
                 };
                 img.src = state.imageDataUrl;
               }
             } catch (error) {
               console.error('Error restoring app state:', error);
               localStorage.removeItem('colorstack_preserved_state');
             }
           }
           
           onLegacyScriptLoad?.();
        }
      };
      
      // Start waiting for elements
      setTimeout(waitForElements, 100);
    };
    script.onerror = (error) => {
      console.error('Failed to load legacy script:', error);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Clean up the flag
      delete window.skipFileInputSetup;
    };
  }, [onLegacyScriptLoad]);

  // Event handlers that will be passed to components
  const handleInstructionsClick = () => {
    // Directly call the legacy function instead of triggering a click event
    if (window.appState && window.domElements && typeof window.showSlicerInstructions === 'function') {
      window.showSlicerInstructions(window.appState, window.domElements);
    }
  };

  const handleNewImageClick = () => {
    // Directly call the legacy function instead of triggering a click event
    if (window.appState && window.domElements && typeof window.resetApp === 'function') {
      try {
        window.resetApp(window.domElements);
        window.appState.img = null;
        window.appState.bandMap = null;
        window.appState.suggestedPalette = [];
        window.appState.activePalette = 'suggested';
        if (window.domElements.suggestedPaletteBtn) {
          window.domElements.suggestedPaletteBtn.className =
            'px-3 py-1 text-sm font-medium rounded-md bg-indigo-600 text-white';
        }
        if (window.domElements.myPaletteBtn) {
          window.domElements.myPaletteBtn.className =
            'px-3 py-1 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700';
        }
      } catch (error) {
        console.error('Error resetting app:', error);
      }
    }
  };

  const handleUpgradeClick = () => {
    // Show upgrade modal for layer limit
    setUpgradeModalState({
      isOpen: true,
      reason: 'layers',
      currentCount: tierLimits.layerCount,
      maxCount: tierLimits.maxLayers
    });
  };

  const handleExportClick = () => {
    // Check tier limits before exporting
    if (!tierLimits.canExport) {
      // Track the blocked export
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'export_blocked_limit', {
          event_category: 'tier_gating',
          event_label: 'export_limit',
          value: tierLimits.exportCount
        });
      }
      
      // Show upgrade modal
      setUpgradeModalState({
        isOpen: true,
        reason: 'exports',
        currentCount: tierLimits.exportCount,
        maxCount: tierLimits.maxExports
      });
      return;
    }

    // Track export count before initiating download
    if (tierLimits.visitorId) {
      UsageTracker.incrementExportCount(tierLimits.visitorId);
    }
    
    // Directly call the legacy export function instead of triggering a click event
    if (window.appState && window.domElements) {
      try {
        // Check if the generateStl function is available
        if (typeof window.generateStl === 'function') {
          const blob = window.generateStl(window.appState, window.domElements);
          if (blob && typeof URL !== 'undefined' && URL.createObjectURL) {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'colorstack.stl';
            downloadLink.click();
            URL.revokeObjectURL(downloadLink.href);
            
            // Track successful export
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'export_successful', {
                event_category: 'tier_gating',
                event_label: 'export_success',
                value: tierLimits.exportCount + 1
              });
            }
          } else {
            console.error('Download not supported in this browser.');
          }
        } else {
          console.error('generateStl function not available');
        }
      } catch (error) {
        console.error('Error exporting STL:', error);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      // Let the legacy JavaScript handle the file
      if (window.handleFile) {
        window.handleFile(files[0]);
      }
    }
  };



  const handleLayerChange = (layer: number) => {
    // Update the layer value display
    const layerValueElement = document.getElementById('layerValue');
    if (layerValueElement) {
      layerValueElement.textContent = layer.toString();
    }
    // Trigger legacy update
    if (window.appState) {
      window.appState.currentLayer = layer;
      if (window.handleSettingsChange) {
        window.handleSettingsChange();
      }
    }
  };

  const handleAspectRatioLockToggle = () => {
    if (window.appState) {
      window.appState.aspectRatioLocked = !window.appState.aspectRatioLocked;
      // Update the button appearance
      const aspectRatioLockBtn = document.getElementById('aspectRatioLockBtn');
      if (aspectRatioLockBtn) {
        const icon = aspectRatioLockBtn.querySelector('.material-icons');
        if (icon) {
          icon.textContent = window.appState.aspectRatioLocked ? 'link' : 'link_off';
        }
      }
    }
  };

  const handlePaletteChange = (palette: 'suggested' | 'my') => {
    // Update React state
    setActivePalette(palette);
    
    if (window.appState) {
      window.appState.activePalette = palette;
      // Update button appearances
      const suggestedBtn = document.getElementById('suggestedPaletteBtn');
      const myBtn = document.getElementById('myPaletteBtn');
      if (suggestedBtn && myBtn) {
        if (palette === 'suggested') {
          suggestedBtn.className = 'px-3 py-1 text-sm font-medium rounded-md bg-indigo-600 text-white';
          myBtn.className = 'px-3 py-1 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700';
        } else {
          suggestedBtn.className = 'px-3 py-1 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700';
          myBtn.className = 'px-3 py-1 text-sm font-medium rounded-md bg-indigo-600 text-white';
        }
      }
      
      // Call the legacy updatePalette function to refresh the canvas and color swatches
      if (typeof window.updatePalette === 'function') {
        console.log('Calling updatePalette for palette:', palette);
        window.updatePalette();
      } else {
        console.error('updatePalette function not available on window object');
      }
    }
  };

  const handleInvertPalette = () => {
    // This will be handled by legacy JavaScript
    const invertBtn = document.getElementById('invertPaletteBtn');
    if (invertBtn) {
      invertBtn.click();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Hidden File Input - needed for legacy JavaScript */}
      <input 
        ref={fileInputRef}
        type="file" 
        id="fileInput" 
        accept="image/png,image/jpeg,image/bmp" 
        className="file-input" 
        max="10485760"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            console.log('File selected in React:', files[0]);
            if (window.handleFile) {
              window.handleFile(files[0]);
            }
          }
        }}
      />

      {/* Main App Container */}
      <div id="app" className="main-app">
        <div className="max-w-7xl mx-auto">
          <Header 
            onInstructionsClick={handleInstructionsClick}
            onNewImageClick={handleNewImageClick}
            onExportClick={handleExportClick}
            onAccountClick={() => setIsAccountModalOpen(true)}
          />

          <h1 className="sr-only">ColorStack: The Free, Browser-Based HueForge Alternative for Color 3D Printing</h1>

          {/* Upload Area (shown when no image is loaded) */}
          <div ref={uploadAreaRef} id="uploadArea" className="mb-8">
            <UploadArea 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          </div>

          {/* Main Content (hidden when no image is loaded) */}
          <div ref={mainContentRef} id="mainContent" className="hidden">
                         <MainContent 
               xDimension="150.0"
               yDimension="120.0"
               currentLayer={currentLayer}
               layerPreviewMaxLayers={numBands}
               onLayerChange={handleLayerChange}
               numBands={numBands}
               onNumBandsChange={setNumBands}
              layerHeight={0.2}
              baseThickness={3}
              bandThickness={2}
              xSize={150}
              ySize={120}
              isAspectRatioLocked={false}
              onAspectRatioLockToggle={handleAspectRatioLockToggle}
              activePalette={activePalette}
              onPaletteChange={handlePaletteChange}
              onInvertPalette={handleInvertPalette}

              canAddLayer={tierLimits.canAddLayer}
              layerCount={tierLimits.layerCount}
              maxLayers={tierLimits.maxLayers}
              onUpgradeClick={handleUpgradeClick}
              // These props will be populated by legacy JavaScript
              paletteChildren={null} // Will be populated by legacy JS
              filamentsChildren={null} // Will be populated by legacy JS
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen}
        title=""
        onClose={handleModalClose}
      >
        {null}
      </Modal>

      {/* Feedback Button */}
      <a 
        href="https://tally.so/r/3xW4ZG" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-32 left-6 z-50 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 border border-gray-700 hover:border-gray-600"
      >
        <span className="material-icons text-lg">feedback</span>
        <span className="text-sm font-medium">Feedback</span>
      </a>

      <Footer />
      
      <UpgradeModal
        isOpen={upgradeModalState.isOpen}
        onClose={() => setUpgradeModalState(prev => ({ ...prev, isOpen: false }))}
        reason={upgradeModalState.reason}
        currentCount={upgradeModalState.currentCount}
        maxCount={upgradeModalState.maxCount}
      />
      
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </div>
  );
};

export default ColorStackApp;
