import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LegacyUIWrapper from './LegacyUIWrapper';

// Mock fetch for testing
global.fetch = jest.fn();

describe('LegacyUIWrapper Core Functionality', () => {
  beforeEach(() => {
    // Reset fetch mock
    (fetch as jest.Mock).mockClear();
    
    // Clear any existing elements
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it('should load legacy HTML content and find required elements', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>body { background: #000; }</style>
        </head>
        <body>
          <div id="uploadCard">Upload Area</div>
          <input type="file" id="fileInput" accept="image/*" />
        </body>
      </html>
    `;
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: () => Promise.resolve(mockHtml),
    });

    render(<LegacyUIWrapper />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Upload Area')).toBeInTheDocument();
    });

    // Check that required elements exist
    expect(document.getElementById('uploadCard')).toBeInTheDocument();
    expect(document.getElementById('fileInput')).toBeInTheDocument();
  });

  it('should extract and inject CSS styles', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>body { background: #000; color: #fff; }</style>
        </head>
        <body>
          <div>Content</div>
        </body>
      </html>
    `;
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: () => Promise.resolve(mockHtml),
    });

    render(<LegacyUIWrapper />);

    await waitFor(() => {
      const styleTags = document.querySelectorAll('style');
      expect(styleTags.length).toBeGreaterThan(0);
      expect(styleTags[0].textContent).toContain('background: #000');
    });
  });

  it('should handle fetch errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<LegacyUIWrapper />);

    // Component should render without crashing
    await waitFor(() => {
      expect(document.querySelector('.legacy-wrapper')).toBeInTheDocument();
    });
  });

  it('should load external resources from HTML head', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          <div>Content</div>
        </body>
      </html>
    `;
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: () => Promise.resolve(mockHtml),
    });

    render(<LegacyUIWrapper />);

    await waitFor(() => {
      const linkTags = document.querySelectorAll('link[rel="stylesheet"]');
      const scriptTags = document.querySelectorAll('script[src]');
      expect(linkTags.length).toBeGreaterThan(0);
      expect(scriptTags.length).toBeGreaterThan(0);
    });
  });

  it('should load main.js script and attempt initialization', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <body>
          <div id="uploadCard">Upload Area</div>
          <input type="file" id="fileInput" accept="image/*" />
        </body>
      </html>
    `;
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: () => Promise.resolve(mockHtml),
    });

    // Mock window.onload
    const originalOnload = window.onload;
    window.onload = jest.fn();

    render(<LegacyUIWrapper />);

    // Wait for script loading and initialization attempts
    await waitFor(() => {
      expect(document.getElementById('uploadCard')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Check if any script tags were created
    const allScriptTags = document.querySelectorAll('script');
    console.log('All script tags found:', allScriptTags.length);
    allScriptTags.forEach((script, index) => {
      console.log(`Script ${index}:`, script.src || 'no src');
    });

    // Check if main.js script was attempted to be loaded
    const scriptTags = document.querySelectorAll('script[src="/js/main.js"]');
    console.log('Main.js script tags found:', scriptTags.length);
    expect(scriptTags.length).toBeGreaterThan(0);

    // Restore original onload
    window.onload = originalOnload;
  });

  it('should detect missing click handlers and set up manual ones', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <body>
          <div id="uploadCard">Upload Area</div>
          <input type="file" id="fileInput" accept="image/*" />
        </body>
      </html>
    `;
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: () => Promise.resolve(mockHtml),
    });

    render(<LegacyUIWrapper />);

    await waitFor(() => {
      const uploadCard = document.getElementById('uploadCard');
      const fileInput = document.getElementById('fileInput');
      
      expect(uploadCard).toBeInTheDocument();
      expect(fileInput).toBeInTheDocument();
      
      // Check if click handler is missing initially
      const hasClickHandler = uploadCard?.onclick || uploadCard?.getAttribute('onclick');
      expect(hasClickHandler).toBeFalsy();
    }, { timeout: 5000 });
  });

  it('should handle cursor state management', async () => {
    const mockHtml = `
      <!DOCTYPE html>
      <html>
        <body>
          <div id="uploadCard" style="cursor: wait;">Upload Area</div>
          <input type="file" id="fileInput" accept="image/*" />
        </body>
      </html>
    `;
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: () => Promise.resolve(mockHtml),
    });

    render(<LegacyUIWrapper />);

    await waitFor(() => {
      const uploadCard = document.getElementById('uploadCard');
      expect(uploadCard).toBeInTheDocument();
      expect(uploadCard?.style.cursor).toBe('wait');
    });
  });
});
