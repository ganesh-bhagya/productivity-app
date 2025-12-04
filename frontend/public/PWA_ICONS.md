# PWA Icons

The app references PWA icons in `vite.config.ts` and `manifest.json`. You need to create these icons:

## Required Icons

1. `pwa-192x192.png` - 192x192 pixels
2. `pwa-512x512.png` - 512x512 pixels

## How to Create

1. Create a square icon (at least 512x512)
2. Use a tool like:
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - Or manually create PNG files

3. Place the icons in `frontend/public/`

## Optional Icons

- `favicon.ico` - Standard favicon
- `apple-touch-icon.png` - For iOS home screen
- `mask-icon.svg` - SVG icon for maskable icons

The service worker and manifest will automatically pick up these icons once they're in the `public/` directory.

