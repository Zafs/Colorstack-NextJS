'use client';

import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import Modal from './Modal';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'layers' | 'exports';
  currentCount: number;
  maxCount: number;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  reason,
  currentCount,
  maxCount
}) => {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getTitle = () => {
    return reason === 'layers' 
      ? 'Layer Limit Reached' 
      : 'Export Limit Reached';
  };

  const getMessage = () => {
    if (reason === 'layers') {
      return `You've reached the free tier limit of ${maxCount} layers. Upgrade to Pro for unlimited layers and more features.`;
    } else {
      return `You've reached the free tier limit of ${maxCount} exports per day. Upgrade to Pro for unlimited exports and more features.`;
    }
  };

  const handleUpgradeClick = async () => {
    console.log('[UPGRADE_DEBUG] Starting upgrade click. User signed in:', isSignedIn);
    
    if (!isSignedIn) {
      console.log('[UPGRADE_DEBUG] User not signed in, opening sign in modal');
      openSignIn();
      return;
    }
    
    setIsLoading(true);
    setError(null); // Reset error state on new attempt

    try {
      // Track the upgrade click
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'upgrade_clicked', {
          event_category: 'tier_gating',
          event_label: reason,
          value: currentCount
        });
      }

      console.log('[UPGRADE_DEBUG] Making API call to /api/checkout');
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });

      if (!response.ok) {
        // This will catch 500 errors from the server
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(errorText || 'Failed to create checkout session.');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start checkout. Please try again.';
      setError(errorMessage);
      setIsLoading(false); // Ensure loading is stopped on error
    }
  };

  const handleDismiss = () => {
    // Track the dismiss event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'upgrade_modal_dismissed', {
        event_category: 'tier_gating',
        event_label: reason,
        value: currentCount
      });
    }
    setError(null); // Clear error state when dismissing
    onClose();
  };

  // Check if we're in incognito/private mode (basic detection)
  const isIncognito = () => {
    if (typeof window === 'undefined') return false;
    
    // Basic incognito detection - not 100% reliable but can help
    const testKey = 'incognito_test';
    try {
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return false; // localStorage works, likely not incognito
    } catch {
      return true; // localStorage blocked, likely incognito
    }
  };

  return (
    <div className="relative">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={getTitle()}
        showCloseButton={false}
      >
        <div className="space-y-6">
          <p className="text-slate-300 text-center">
            {getMessage()}
          </p>
          
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-slate-200 mb-3 text-center">Pro Features Include:</h4>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Up to 24 layers per model
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Unlimited daily exports
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                High-resolution STL export
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Save & load project files
              </li>
            </ul>
          </div>

                     {isIncognito() && (
             <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3">
               <p className="text-xs text-amber-300 text-center">
                 💡 Tip: For the best experience, use a regular browser window instead of incognito mode.
               </p>
             </div>
           )}

           {error && (
             <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
               <p className="text-xs text-red-300 text-center">
                 {error}
               </p>
             </div>
           )}

          <div className="flex space-x-3">
            <button
              onClick={handleUpgradeClick}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              {isLoading ? 'Processing...' : 'Upgrade to Pro'}
            </button>
            <button
              onClick={handleDismiss}
              disabled={isLoading}
              className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-200 font-medium py-3 px-4 rounded-md transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UpgradeModal;
