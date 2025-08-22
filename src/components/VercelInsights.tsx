'use client';

import { useEffect } from 'react';

export default function VercelInsights() {
  useEffect(() => {
    // Only load Vercel Insights in production
    if (process.env.NODE_ENV === 'production') {
      const script = document.createElement('script');
      script.src = '/_vercel/insights/script.js';
      script.defer = true;
      script.onerror = () => {
        // Silently handle errors in production
        console.debug('Vercel Insights failed to load');
      };
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
