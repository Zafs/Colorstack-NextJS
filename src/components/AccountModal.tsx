'use client';

import React, { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { SignedIn, SignedOut } from '@clerk/nextjs';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close modal if user is not signed in
  React.useEffect(() => {
    if (isOpen && !user) {
      onClose();
    }
  }, [isOpen, user, onClose]);

  const isProUser = user?.publicMetadata?.tier === 'pro';

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case 'unauthorized':
        return "You are not authorized to access this page. Please sign in again.";
      case 'missing_id':
        return "Could not find your subscription details. If you believe this is an error, please contact support.";
      case 'stripe_error':
        return "There was an issue connecting to our billing system. Please try again or contact support if the problem persists.";
      default:
        return "An unexpected error occurred. Please try again or contact support.";
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses from the API
        if (data.error) {
          setError(getErrorMessage(data.error));
        } else {
          throw new Error('Failed to create subscription management session');
        }
        return;
      }

      // Success case - redirect to Stripe portal
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBillingHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses from the API
        if (data.error) {
          setError(getErrorMessage(data.error));
        } else {
          throw new Error('Failed to create billing history session');
        }
        return;
      }

      // Success case - redirect to Stripe portal
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleAccountSettings = () => {
    // Open Clerk's built-in user profile modal for all account settings
    openUserProfile();
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <>
      <SignedIn>
        {/* Modal Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Modal Content */}
          <div 
            className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h1 className="text-2xl font-bold">Account Settings</h1>
                <p className="text-gray-400 mt-1">Manage your subscription and account preferences</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="material-icons text-red-400 mt-0.5">error</span>
                    <div>
                      <h3 className="font-medium text-red-400 mb-1">Error</h3>
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span>{user?.emailAddresses[0]?.emailAddress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Plan:</span>
                    <div className="flex items-center gap-2">
                      {isProUser ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          Pro
                        </span>
                      ) : (
                        <span className="text-gray-400">Free</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Management */}
              {isProUser && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Subscription Management</h2>
                  <p className="text-gray-400 mb-4">
                    Manage your Pro subscription, update payment methods, and view billing history.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleManageSubscription}
                      disabled={isLoading}
                      className="btn-primary flex items-center gap-2 px-6 py-3"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-icons animate-spin">refresh</span>
                          Loading...
                        </>
                      ) : (
                        <>
                          <span className="material-icons">settings</span>
                          Manage Subscription
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleViewBillingHistory}
                      disabled={isLoading}
                      className="btn-secondary flex items-center gap-2 px-6 py-3"
                    >
                      <span className="material-icons">receipt</span>
                      View Billing History
                    </button>
                  </div>
                </div>
              )}

              {/* Upgrade Section for Free Users */}
              {!isProUser && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Upgrade to Pro</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="material-icons text-green-400 mt-0.5">check_circle</span>
                      <div>
                        <h3 className="font-medium">Up to 24 Color Layers</h3>
                        <p className="text-gray-400 text-sm">Create more complex and detailed color models</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-icons text-green-400 mt-0.5">check_circle</span>
                      <div>
                        <h3 className="font-medium">Unlimited Exports</h3>
                        <p className="text-gray-400 text-sm">Export as many STL files as you need</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-icons text-green-400 mt-0.5">check_circle</span>
                      <div>
                        <h3 className="font-medium">Priority Support</h3>
                        <p className="text-gray-400 text-sm">Get help when you need it most</p>
                      </div>
                    </div>
                  </div>
                  <a
                    href="/pro"
                    className="btn-primary inline-flex items-center gap-2 px-6 py-3 mt-4"
                  >
                    <span className="material-icons">star</span>
                    Upgrade to Pro
                  </a>
                </div>
              )}

              {/* Account Actions */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
                <div className="space-y-3">
                  <button 
                    onClick={handleAccountSettings}
                    className="btn-primary w-full flex items-center justify-between px-3 py-3"
                  >
                    <span>Account Settings</span>
                    <span className="material-icons">settings</span>
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="btn-secondary w-full flex items-center justify-between px-3 py-3"
                  >
                    <span>Sign Out</span>
                    <span className="material-icons">logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
