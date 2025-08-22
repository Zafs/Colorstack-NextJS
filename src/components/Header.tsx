'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useClerk, useUser, SignOutButton } from '@clerk/nextjs';
import { LogIn, User, Settings, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  onInstructionsClick?: () => void;
  onNewImageClick?: () => void;
  onExportClick?: () => void;
  onAccountClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onInstructionsClick,
  onNewImageClick,
  onExportClick,
  onAccountClick
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { openSignIn, openSignUp } = useClerk();
  const { user, isSignedIn } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Check if user is pro tier
  const isProUser = isSignedIn && user?.publicMetadata?.tier === 'pro';
  
  const handleSignIn = () => {
    // Preserve app state before authentication
    if (window.appState && window.appState.img) {
      try {
        // Save the current app state to localStorage
        const stateToPreserve: PreservedAppState = {
          hasImage: true,
          numBands: window.appState.numBands || 4,
          layerHeight: window.appState.layerHeight || 0.2,
          baseThickness: window.appState.baseThickness || 3,
          bandThickness: window.appState.bandThickness || 2,
          xSize: window.appState.xSize || 100,
          ySize: window.appState.ySize || 100,
          aspectRatioLocked: window.appState.aspectRatioLocked || true,
          originalAspectRatio: window.appState.originalAspectRatio || 1,
          currentPalette: window.appState.currentPalette || [],
          suggestedPalette: window.appState.suggestedPalette || [],
          activePalette: window.appState.activePalette || 'suggested',
          currentLayer: window.appState.currentLayer || 1,
          isSingleLayerMode: window.appState.isSingleLayerMode || false
        };
        
        // Convert image to data URL for storage
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx && window.appState.img) {
          canvas.width = window.appState.img.width;
          canvas.height = window.appState.img.height;
          ctx.drawImage(window.appState.img, 0, 0);
          const imageDataUrl = canvas.toDataURL('image/png');
          stateToPreserve.imageDataUrl = imageDataUrl;
        }
        
        localStorage.setItem('colorstack_preserved_state', JSON.stringify(stateToPreserve));
        console.log('✅ App state preserved for authentication');
      } catch (error) {
        console.error('Failed to preserve app state:', error);
      }
    }
    
    // Use Clerk's built-in modal functionality
    openSignIn({
      redirectUrl: pathname,
    });
  };
  
  const handleSignUp = () => {
    // Preserve app state before authentication
    if (window.appState && window.appState.img) {
      try {
        // Save the current app state to localStorage
        const stateToPreserve: PreservedAppState = {
          hasImage: true,
          numBands: window.appState.numBands || 4,
          layerHeight: window.appState.layerHeight || 0.2,
          baseThickness: window.appState.baseThickness || 3,
          bandThickness: window.appState.bandThickness || 2,
          xSize: window.appState.xSize || 100,
          ySize: window.appState.ySize || 100,
          aspectRatioLocked: window.appState.aspectRatioLocked || true,
          originalAspectRatio: window.appState.originalAspectRatio || 1,
          currentPalette: window.appState.currentPalette || [],
          suggestedPalette: window.appState.suggestedPalette || [],
          activePalette: window.appState.activePalette || 'suggested',
          currentLayer: window.appState.currentLayer || 1,
          isSingleLayerMode: window.appState.isSingleLayerMode || false
        };
        
        // Convert image to data URL for storage
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx && window.appState.img) {
          canvas.width = window.appState.img.width;
          canvas.height = window.appState.img.height;
          ctx.drawImage(window.appState.img, 0, 0);
          const imageDataUrl = canvas.toDataURL('image/png');
          stateToPreserve.imageDataUrl = imageDataUrl;
        }
        
        localStorage.setItem('colorstack_preserved_state', JSON.stringify(stateToPreserve));
        console.log('✅ App state preserved for authentication');
      } catch (error) {
        console.error('Failed to preserve app state:', error);
      }
    }
    
    // Use Clerk's built-in modal functionality
    openSignUp({
      redirectUrl: pathname,
    });
  };

  const handleAccountClick = () => {
    setIsUserMenuOpen(false);
    onAccountClick?.();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);
  
  return (
    <header className="flex items-center justify-between mb-8">
      {/* Left side: Logo and site name */}
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Logo.svg" alt="ColorStack" className="h-7 md:h-10" />
      </div>
      
      {/* Right side: Action buttons and auth */}
      <div className="flex items-center gap-1 md:gap-4">
        <div className="relative has-tooltip">
          <button 
            id="instructionsBtn" 
            className="btn-secondary flex items-center gap-2 p-2 md:px-4 md:py-2"
            onClick={onInstructionsClick}
          >
            <span className="material-icons">info_outline</span>
            <span className="hidden md:inline">View Slicer Instructions</span>
          </button>
          <div className="tooltip -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
            Learn how to configure your slicer
          </div>
        </div>
        <div className="relative has-tooltip">
          <button 
            id="newImageBtn" 
            className="btn-secondary flex items-center gap-2 p-2 md:px-4 md:py-2"
            onClick={onNewImageClick}
          >
            <span className="material-icons">add_photo_alternate</span>
            <span className="hidden md:inline">New Image</span>
          </button>
          <div className="tooltip -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
            Upload a new image
          </div>
        </div>
        <div className="relative has-tooltip">
          <button 
            id="exportBtn" 
            className="btn-primary flex items-center gap-2 p-2 md:px-4 md:py-2"
            onClick={onExportClick}
          >
            <span className="material-icons">file_download</span>
            <span className="hidden md:inline">Export STL</span>
          </button>
          <div className="tooltip -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
            Download the 3D model file
          </div>
        </div>
        
        {/* Auth components */}
        <div className="flex items-center gap-2 ml-4">
          <SignedIn>
            <div className="relative" ref={userMenuRef}>
              <div className="flex items-center gap-2">
                {isProUser && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                    Pro
                  </span>
                )}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                    {user?.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName || 'Profile'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              </div>
              
              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                  <div className="py-1">
                    <button
                      onClick={handleAccountClick}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Account
                    </button>
                    <SignOutButton>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors text-red-400">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              )}
            </div>
          </SignedIn>
          <SignedOut>
            <button 
              onClick={handleSignIn}
              className="btn-secondary flex items-center gap-2 p-2 md:px-4 md:py-2"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden md:inline">Sign In</span>
            </button>
            <button 
              onClick={handleSignUp}
              className="btn-secondary flex items-center gap-2 p-2 md:px-4 md:py-2"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden md:inline">Sign Up</span>
            </button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
