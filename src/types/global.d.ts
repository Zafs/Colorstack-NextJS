/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-var, @next/next/no-assign-module-variable */
// Fix for NTC library module error
declare var module: any;

// Fix for other potential global issues
declare var exports: any;
declare var require: any;
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-var, @next/next/no-assign-module-variable */

// Legacy JavaScript global interfaces
declare global {
  // Interface for preserved app state in localStorage
  interface PreservedAppState {
    hasImage: boolean;
    numBands: number;
    layerHeight: number;
    baseThickness: number;
    bandThickness: number;
    xSize: number;
    ySize: number;
    aspectRatioLocked: boolean;
    originalAspectRatio: number;
    currentPalette: unknown[];
    suggestedPalette: unknown[];
    activePalette: string;
    currentLayer: number;
    isSingleLayerMode: boolean;
    imageDataUrl?: string;
  }

  interface Window {
    // Legacy app state
    appState?: {
      img: HTMLImageElement | null;
      bandMap: unknown | null;
      suggestedPalette: unknown[];
      activePalette: string;
      currentPalette?: unknown[];
      imageDataUrl?: string;
      imageWorker?: unknown;
      currentLayer?: number;
      isSingleLayerMode?: boolean;
      numBands?: number;
      layerHeight?: number;
      baseThickness?: number;
      bandThickness?: number;
      xSize?: number;
      ySize?: number;
      aspectRatioLocked?: boolean;
      originalAspectRatio?: number;
    };
    
    // Legacy DOM elements
    domElements?: {
      suggestedPaletteBtn?: HTMLElement;
      myPaletteBtn?: HTMLElement;
      numBandsInput?: HTMLInputElement;
      layerHeightInput?: HTMLInputElement;
      baseThicknessInput?: HTMLInputElement;
      bandThicknessInput?: HTMLInputElement;
      xSizeInput?: HTMLInputElement;
      ySizeInput?: HTMLInputElement;
      [key: string]: HTMLElement | HTMLInputElement | undefined;
    };
    
    // Legacy functions
    showSlicerInstructions?: (appState: unknown, domElements: unknown) => void;
    resetApp?: (domElements: unknown) => void;
    generateStl?: (appState: unknown, domElements: unknown) => Blob;
    handleFile?: (file: File) => void;
    updatePalette?: () => void;
    handleSettingsChange?: () => void;
    handleNumBandsChange?: (numBands: number) => void;
    
    // Legacy event handlers
    onload?: (event: Event) => void;
    
    // Custom flags
    skipFileInputSetup?: boolean;
    
    // Version configuration
    VERSION_CONFIG?: any;
    
    // Google Analytics
    gtag?: (
      command: string,
      action: string,
      parameters?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: unknown;
      }
    ) => void;
  }
}

export {};
