'use client';

import { useEffect, useState } from 'react';

// Legacy globals are defined in global.d.ts

export default function LegacyUIWrapper() {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    // Reset initialization flag when component mounts
    (window as any).colorstackInitialized = false;
    
    // Fetch the legacy HTML content
    fetch('/legacy.html')
      .then(response => response.text())
      .then(html => {
        // Extract the body content
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : html;
        
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
        
        // Inject global variable definitions before loading legacy scripts
        const globalScript = document.createElement('script');
        globalScript.textContent = `
          // Define global variables for legacy scripts
          if (typeof module === 'undefined') {
            var module = {};
          }
          if (typeof exports === 'undefined') {
            var exports = {};
          }
          if (typeof require === 'undefined') {
            var require = function() { return {}; };
          }
        `;
        document.head.appendChild(globalScript);
        
        // Extract external script tags from the head
        const scriptMatches = html.match(/<script[^>]*src="([^"]*)"[^>]*>/gi);
        if (scriptMatches) {
          scriptMatches.forEach(scriptTag => {
            const srcMatch = scriptTag.match(/src="([^"]*)"/i);
            if (srcMatch) {
              // Special handling for version.js - skip if VERSION_CONFIG already exists
              if (srcMatch[1].includes('version.js')) {
                if (typeof window.VERSION_CONFIG !== 'undefined') {
                  console.log('VERSION_CONFIG already exists, skipping version.js');
                  return;
                }
              }
              
              // Check if script already exists before injecting
              const existingScript = document.querySelector(`script[src="${srcMatch[1]}"]`);
              if (!existingScript) {
                const script = document.createElement('script');
                script.src = srcMatch[1];
                script.async = true;
                script.onload = () => {
                  console.log(`Loaded script: ${srcMatch[1]}`);
                };
                script.onerror = (error) => {
                  console.error(`Error loading script ${srcMatch[1]}:`, error);
                };
                document.head.appendChild(script);
              } else {
                console.log(`Script already exists: ${srcMatch[1]}`);
              }
            }
          });
        }
        
        setHtmlContent(bodyContent);
        
        // Wait for the DOM to be fully rendered before loading main.js
        setTimeout(() => {
          // Debug: Check if elements exist
          const uploadCard = document.getElementById('uploadCard');
          const fileInput = document.getElementById('fileInput');
          console.log('Debug - uploadCard found:', !!uploadCard);
          console.log('Debug - fileInput found:', !!fileInput);
          
          // Check if main.js is already loaded or if we've already initialized
          const existingMainScript = document.querySelector('script[src="/js/main.js"]');
          if (existingMainScript || (window as any).colorstackInitialized) {
            console.log('main.js already loaded or app already initialized, skipping...');
            return;
          }
          
          // Set a flag to prevent re-initialization
          (window as any).colorstackInitialized = true;
          
          // Dynamically create and append the script tag for main.js
          const script = document.createElement('script');
          script.src = '/js/main.js';
          script.async = false; // Set to false to ensure execution order
          
          // Add error handling for script loading
          script.onerror = (error) => {
            console.error('Error loading main.js:', error);
          };
          
          script.onload = () => {
            console.log('main.js loaded successfully');
            
            // Wait for the script to execute completely, then trigger window.onload
            setTimeout(() => {
              console.log('Debug - Triggering window.onload manually...');
              
              // Manually trigger the window.onload event
              if (window.onload) {
                try {
                  // Create a mock event object
                  const mockEvent = new Event('load');
                  window.onload(mockEvent);
                  console.log('Debug - window.onload executed successfully');
                } catch (error) {
                  console.error('Debug - Error executing window.onload:', error);
                }
              } else {
                console.log('Debug - window.onload not found');
              }
              
              // Wait a bit longer for initialization to complete, then check and fix cursor
              setTimeout(() => {
                const uploadCardAfter = document.getElementById('uploadCard');
                const fileInputAfter = document.getElementById('fileInput');
                
                if (uploadCardAfter) {
                  // Check if cursor is still 'wait' and fix it
                  if (uploadCardAfter.style.cursor === 'wait') {
                    console.log('Debug - Fixing stuck cursor...');
                    uploadCardAfter.style.cursor = 'pointer';
                  }
                  
                  // Check if click handler is attached
                  console.log('Debug - Checking if click handler is attached...');
                  const hasClickHandler = uploadCardAfter.onclick || 
                                        uploadCardAfter.getAttribute('onclick');
                  console.log('Debug - Has click handler:', !!hasClickHandler);
                  
                  // If no click handler, manually set one up
                  if (!hasClickHandler && fileInputAfter) {
                    console.log('Debug - Setting up manual click handler...');
                    uploadCardAfter.onclick = function() {
                      console.log('Debug - Manual click handler triggered');
                      fileInputAfter.click();
                    };
                  }
                  
                  // Also set up drag and drop handlers as fallback
                  uploadCardAfter.addEventListener('dragover', function (e) {
                    e.preventDefault();
                    uploadCardAfter.classList.add('dragover');
                  });

                  uploadCardAfter.addEventListener('dragleave', function (e) {
                    e.preventDefault();
                    uploadCardAfter.classList.remove('dragover');
                  });

                  uploadCardAfter.addEventListener('drop', function (e) {
                    e.preventDefault();
                    uploadCardAfter.classList.remove('dragover');
                    const files = e.dataTransfer?.files;
                    console.log('Debug - File dropped:', files);
                    if (files && files.length > 0 && window.handleFile) {
                      window.handleFile(files[0]);
                    }
                  });
                  
                  console.log('Debug - Testing click handler after initialization...');
                  uploadCardAfter.click();
                }
              }, 2000); // Wait 2 seconds for initialization
            }, 100); // Small delay to ensure script execution
          };
          
          document.body.appendChild(script);
        }, 100); // Small delay to ensure DOM is ready
      })
      .catch(error => {
        console.error('Error loading legacy HTML:', error);
      });
      
    // Cleanup function
    return () => {
      // Reset the initialization flag when component unmounts
      (window as any).colorstackInitialized = false;
    };
  }, []);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      className="legacy-wrapper"
    />
  );
}
