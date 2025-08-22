import { render, screen, fireEvent } from '@testing-library/react';
import PrimaryControls from './PrimaryControls';

// Mock the legacy JavaScript globals
const mockUpdateNumBands = jest.fn();
const mockUpdateLayerHeight = jest.fn();
const mockUpdateBaseThickness = jest.fn();
const mockUpdateBandThickness = jest.fn();
const mockUpdateXSize = jest.fn();
const mockUpdateYSize = jest.fn();

// Mock window.appState
Object.defineProperty(window, 'appState', {
  value: {
    numBands: 4,
    layerHeight: 0.2,
    baseThickness: 3,
    bandThickness: 2,
    xSize: 150,
    ySize: 120,
    aspectRatioLocked: false,
    originalAspectRatio: 1.25
  },
  writable: true
});

// Mock window.updatePalette
Object.defineProperty(window, 'updatePalette', {
  value: jest.fn(),
  writable: true
});

describe('PrimaryControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<PrimaryControls />);
    
    expect(screen.getByText('Primary Controls')).toBeInTheDocument();
    expect(screen.getByText('Z-Bands (Colors)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
  });

  it('shows layer limit warning when canAddLayer is false', () => {
    render(
      <PrimaryControls 
        canAddLayer={false}
        layerCount={8}
        maxLayers={8}
      />
    );
    
    expect(screen.getByText('Limit: 8')).toBeInTheDocument();
    expect(screen.getByText('Free tier limit reached. Upgrade to Pro for up to 24 colors.')).toBeInTheDocument();
  });

  it('allows decreasing slider value when at maximum', () => {
    render(
      <PrimaryControls 
        numBands={8}
        canAddLayer={false}
        layerCount={8}
        maxLayers={8}
      />
    );
    
    const slider = screen.getByDisplayValue('8') as HTMLInputElement;
    
    // Try to decrease the value
    fireEvent.input(slider, { target: { value: '6' } });
    
    // The slider should allow decreasing the value
    expect(slider.value).toBe('6');
  });

  it('clamps slider value to maximum when trying to increase beyond limit', () => {
    render(
      <PrimaryControls 
        numBands={6}
        canAddLayer={false}
        layerCount={6}
        maxLayers={8}
      />
    );
    
    const slider = screen.getByDisplayValue('6') as HTMLInputElement;
    
    // Try to increase beyond the maximum
    fireEvent.input(slider, { target: { value: '10' } });
    
    // The slider should clamp to the maximum value
    expect(slider.value).toBe('8');
  });

  it('allows full range when canAddLayer is true', () => {
    render(
      <PrimaryControls 
        numBands={4}
        canAddLayer={true}
        layerCount={4}
        maxLayers={8}
      />
    );
    
    const slider = screen.getByDisplayValue('4') as HTMLInputElement;
    
    // Should be able to increase to maximum
    fireEvent.input(slider, { target: { value: '8' } });
    expect(slider.value).toBe('8');
    
    // Should be able to decrease
    fireEvent.input(slider, { target: { value: '2' } });
    expect(slider.value).toBe('2');
  });

  it('does not show limit warning when canAddLayer is true', () => {
    render(
      <PrimaryControls 
        canAddLayer={true}
        layerCount={4}
        maxLayers={8}
      />
    );
    
    expect(screen.queryByText('Limit: 8')).not.toBeInTheDocument();
    expect(screen.queryByText('Free tier limit reached. Upgrade to Pro for up to 24 colors.')).not.toBeInTheDocument();
  });

  it('renders all control inputs', () => {
    render(<PrimaryControls />);
    
    expect(screen.getByDisplayValue('0.2')).toBeInTheDocument(); // layerHeight
    expect(screen.getByDisplayValue('150')).toBeInTheDocument(); // xSize
    expect(screen.getByDisplayValue('120')).toBeInTheDocument(); // ySize
    
    // Verify both inputs with value "1" exist (baseThickness and bandThickness)
    const inputsWithValue1 = screen.getAllByDisplayValue('1');
    expect(inputsWithValue1).toHaveLength(2);
  });
});
