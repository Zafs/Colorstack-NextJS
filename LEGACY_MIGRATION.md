# Legacy Migration - Strangler Fig Pattern

This document describes the implementation of the Strangler Fig Pattern for migrating the ColorStack application from vanilla JavaScript to Next.js.

## What Has Been Implemented

### 1. Project Setup
- ✅ Created new Next.js project `colorstack-app` with TypeScript and App Router
- ✅ Cleared the default `public` directory
- ✅ Copied all legacy assets from the original project
- ✅ Renamed `index.html` to `legacy.html`

### 2. Legacy UI Wrapper
- ✅ Created `src/components/LegacyUIWrapper.tsx`
- ✅ Component fetches `/legacy.html` content
- ✅ Extracts and injects CSS styles from the legacy HTML
- ✅ Loads external CSS and JavaScript resources (Tailwind CSS, Google Fonts, SortableJS)
- ✅ Dynamically loads `/js/main.js` script
- ✅ Uses `dangerouslySetInnerHTML` to render legacy content

### 3. Main Page Integration
- ✅ Updated `src/app/page.tsx` to render `LegacyUIWrapper`
- ✅ Removed all default Next.js content

### 4. Static Asset Routing
- ✅ Updated `next.config.ts` with rewrite rules for:
  - `/js/:path*` → `/js/:path*`
  - `/assets/:path*` → `/assets/:path*`
  - `/Logo.svg` → `/Logo.svg`

## How It Works

1. When a user visits the Next.js app, the main page renders the `LegacyUIWrapper`
2. The wrapper fetches the legacy HTML content from `/legacy.html`
3. **CSS Loading Fix**: The wrapper extracts CSS styles and external resources from the HTML head:
   - Inline styles from `<style>` tags
   - External CSS links (Google Fonts, etc.)
   - External JavaScript libraries (Tailwind CSS CDN, SortableJS)
4. The HTML body content is injected into the DOM using `dangerouslySetInnerHTML`
5. The wrapper dynamically creates a `<script>` tag pointing to `/js/main.js`
6. The legacy JavaScript application initializes and runs as before

## CSS Loading Solution

The original issue was that `dangerouslySetInnerHTML` only injects the body content, but CSS styles are typically in the `<head>` section. The solution:

- **Extract inline styles**: Parse `<style>` tags and inject them into the document head
- **Load external CSS**: Parse `<link rel="stylesheet">` tags and create corresponding link elements
- **Load external scripts**: Parse `<script src="...">` tags and load external libraries
- **Prevent duplicates**: Check if resources are already loaded before adding them

## File Structure

```
colorstack-app/
├── src/
│   ├── app/
│   │   └── page.tsx (renders LegacyUIWrapper)
│   └── components/
│       └── LegacyUIWrapper.tsx (loads legacy app + CSS)
├── public/
│   ├── legacy.html (renamed from index.html)
│   ├── js/
│   │   ├── main.js (legacy application logic)
│   │   └── ... (other JS files)
│   ├── assets/
│   │   └── ... (images, icons, etc.)
│   └── ... (other static files)
└── next.config.ts (rewrite rules)
```

## Next Steps

This is the first step in the Strangler Fig Pattern. The legacy application is now running inside Next.js with proper styling. Future steps will involve:

1. Gradually replacing legacy components with React components
2. Migrating functionality piece by piece
3. Eventually removing the legacy wrapper when all functionality is migrated

## Running the Application

```bash
cd colorstack-app
npm run dev
```

The application should be available at `http://localhost:3000` and should display the legacy ColorStack application with proper styling, exactly as it was before.
