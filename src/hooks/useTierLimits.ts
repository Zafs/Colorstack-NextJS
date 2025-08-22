import { useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useVisitorId } from './useVisitorId';
import { UsageTracker } from '../lib/usageTracker';

interface TierLimits {
  canAddLayer: boolean;
  canExport: boolean;
  layerCount: number;
  exportCount: number;
  maxLayers: number;
  maxExports: number;
  visitorId: string | null;
}

export function useTierLimits(currentLayerCount: number): TierLimits {
  const { user, isSignedIn, isLoaded } = useUser();
  const { visitorId, isLoading: visitorLoading } = useVisitorId();

  const limits = useMemo(() => {
    // Check if user is pro tier
    const isProUser = isSignedIn && user?.publicMetadata?.tier === 'pro';
    
    if (isProUser) {
      // Pro users have higher limits
      return {
        canAddLayer: true,
        canExport: true,
        layerCount: currentLayerCount,
        exportCount: 0,
        maxLayers: 24, // Pro tier limit - 24 layers
        maxExports: Infinity, // Unlimited exports
        visitorId: user?.id || null
      };
    }

    // For non-pro users, check visitor limits
    if (visitorLoading || !visitorId) {
      // While loading or if we don't have a visitor ID yet, allow everything temporarily
      return {
        canAddLayer: true,
        canExport: true,
        layerCount: currentLayerCount,
        exportCount: 0,
        maxLayers: 8, // Free tier limit
        maxExports: 3, // Free tier limit
        visitorId: null
      };
    }

    const usage = UsageTracker.getCurrentUsage(visitorId);
    const maxLayers = 8; // Free tier limit
    const maxExports = 3; // Free tier limit

    return {
      canAddLayer: currentLayerCount < maxLayers,
      canExport: usage.exportCount < maxExports,
      layerCount: currentLayerCount,
      exportCount: usage.exportCount,
      maxLayers,
      maxExports,
      visitorId
    };
  }, [user, isSignedIn, isLoaded, visitorId, visitorLoading, currentLayerCount]);

  return limits;
}
