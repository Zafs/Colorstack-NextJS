# Tier Gating Implementation

This document describes the tier gating system implemented for ColorStack to limit free users to 8 layers and 10 exports per day.

## Overview

The tier gating system uses anonymous browser fingerprinting to track usage without requiring user accounts. It automatically resets limits daily and provides upgrade prompts when limits are reached.

## Components

### 1. useVisitorId Hook (`src/hooks/useVisitorId.ts`)
- Uses FingerprintJS to generate a stable, anonymous visitor ID
- Falls back to a simple hash if FingerprintJS fails to load
- Loads FingerprintJS from CDN automatically

### 2. UsageTracker Service (`src/lib/usageTracker.ts`)
- Manages usage data in localStorage with key `cs_usage_{visitorId}`
- Automatically resets export count daily
- Provides methods to get current usage and increment export count

### 3. useTierLimits Hook (`src/hooks/useTierLimits.ts`)
- Combines visitor ID and usage tracking
- Returns tier limits: `canAddLayer`, `canExport`, counts, and limits
- Handles temporary allowance when visitor ID is not yet available

### 4. UpgradeModal Component (`src/components/UpgradeModal.tsx`)
- Shows upgrade prompt when limits are reached
- Tracks upgrade clicks with analytics
- Links to `/pricing` page

## Integration Points

### Export Limiting
- **Location**: `ColorStackApp.tsx` - `handleExportClick()`
- **Behavior**: Checks `tierLimits.canExport` before allowing export
- **Analytics**: Tracks `export_blocked_limit` and `export_successful` events

### Layer Limiting
- **Location**: `ColorStackApp.tsx` - `PrimaryControls.tsx` (numBands slider only)
- **Behavior**: 
  - Disables numBands slider when limit reached
  - Shows visual indicators and warning text
  - Prevents increasing layer count beyond limit
  - **Note**: "Add New" button in "My Filaments" panel is NOT affected by layer limits (it adds filaments to collection, not layers to model)
- **Analytics**: Tracks `layer_blocked_limit` events

### UI Updates
- **PrimaryControls**: Shows limit badge and disables slider
- **UpgradeModal**: Appears when limits are reached
- **Visual Feedback**: Orange warning text and disabled states

## Analytics Events

The system tracks the following events:

- `export_blocked_limit`: When export is blocked due to daily limit
- `export_successful`: When export completes successfully
- `layer_blocked_limit`: When layer addition is blocked
- `upgrade_clicked`: When user clicks upgrade button
- `upgrade_modal_dismissed`: When user dismisses the upgrade modal

## Configuration

### Free Tier Limits
- **Max Layers**: 8
- **Max Exports per Day**: 3
- **Reset Time**: Daily at midnight (local time)

### Storage
- **Key Format**: `cs_usage_{visitorId}`
- **Data Structure**: `{ exportCount: number, lastReset: string }`

## Testing

To test the tier gating:

1. **Export Limit**: Try exporting more than 3 times in a day
2. **Layer Limit**: Try increasing numBands beyond 8
3. **Daily Reset**: Check that limits reset after 24 hours
4. **Analytics**: Verify events are tracked in browser console

## Known Limitations

### Incognito/Private Mode Bypass
- **Issue**: Users can bypass limits by using incognito/private browsing mode
- **Cause**: Browser fingerprinting is less reliable in private modes
- **Impact**: Users can export unlimited files by opening new incognito windows
- **Mitigation**: Consider server-side tracking for production use

### Browser Fingerprinting Reliability
- **Issue**: Fingerprinting can be inconsistent across different browsers/devices
- **Cause**: Different browsers handle fingerprinting differently
- **Impact**: Some users may experience limit resets unexpectedly
- **Mitigation**: Enhanced fallback fingerprinting implemented

## Future Enhancements

- **Server-side usage tracking** for more reliable limits (recommended for production)
- **User accounts** for cross-device usage and better limit enforcement
- **Different tier levels** (Pro, Enterprise)
- **Usage analytics dashboard**
- **A/B testing** for different limit configurations
- **IP-based tracking** as additional fallback (with privacy considerations)
