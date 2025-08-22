import { useEffect, useState } from 'react';

declare global {
  interface Window {
    FingerprintJS?: {
      load: () => Promise<{
        get: () => Promise<{ visitorId: string }>;
      }>;
    };
  }
}

interface VisitorIdResult {
  visitorId: string | null;
  isLoading: boolean;
}

export function useVisitorId(): VisitorIdResult {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadFingerprintJS = async () => {
      try {
        // Load FingerprintJS from CDN if not already loaded
        if (!window.FingerprintJS) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js';
          script.async = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load FingerprintJS'));
            document.head.appendChild(script);
          });
        }

        // Initialize FingerprintJS
        const fp = await window.FingerprintJS!.load();
        const result = await fp.get();
        
        if (isMounted) {
          setVisitorId(result.visitorId);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to get visitor ID:', error);
        // Fallback to a more comprehensive hash
        if (isMounted) {
          const fallbackId = btoa(
            navigator.userAgent + 
            screen.width + 
            screen.height + 
            screen.colorDepth +
            navigator.language +
            new Date().getTimezoneOffset() +
            (navigator.cookieEnabled ? '1' : '0') +
            (navigator.doNotTrack || '0')
          ).slice(0, 16);
          setVisitorId(fallbackId);
          setIsLoading(false);
        }
      }
    };

    loadFingerprintJS();

    return () => {
      isMounted = false;
    };
  }, []);

  return { visitorId, isLoading };
}
