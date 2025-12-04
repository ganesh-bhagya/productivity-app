# PWA Setup Guide - Why App Isn't Installable

## Common Reasons PWA Doesn't Work

### 1. ❌ Missing PWA Icons (MOST COMMON)

**Problem:** The manifest references icons that don't exist.

**Solution:** Create and add these icons to `frontend/public/`:

```
frontend/public/
├── favicon.ico (32x32 or 16x16)
├── apple-touch-icon.png (180x180)
├── pwa-192x192.png (192x192) ← REQUIRED
└── pwa-512x512.png (512x512) ← REQUIRED
```

**Quick Fix:**
1. Create a square logo (512x512 minimum)
2. Use an online tool:
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Download all sizes
4. Place in `frontend/public/` folder
5. Rebuild: `npm run build`

### 2. ❌ Not Using HTTPS

**Problem:** Service workers only work over HTTPS (or localhost).

**Solution:** 
- ✅ Use HTTPS in production
- ✅ Use `https://` not `http://`
- ✅ Check SSL certificate is valid

### 3. ❌ Manifest Not Loading

**Check in Browser:**
1. Open DevTools (F12)
2. Go to Application tab
3. Check "Manifest" section
4. Look for errors

**Common Issues:**
- Icons return 404
- Invalid JSON
- Missing required fields

### 4. ❌ Service Worker Not Registering

**Check in Browser:**
1. DevTools → Application → Service Workers
2. Should see "sw.js" registered
3. Check for errors

**Fix:**
- Ensure `sw.js` exists in `dist/` after build
- Check browser console for errors
- Clear cache and hard refresh

### 5. ❌ Already Installed

**Check:**
- Look for app icon on home screen
- Check if running in standalone mode
- DevTools → Application → Manifest → "Add to homescreen" button

## Quick Diagnostic Steps

### Step 1: Check Manifest
```bash
# After building, check if manifest exists
cd frontend/dist
ls -la manifest.webmanifest
cat manifest.webmanifest
```

### Step 2: Check Icons
```bash
# Verify icons exist
ls -la frontend/public/*.png
ls -la frontend/public/*.ico
```

### Step 3: Check Service Worker
```bash
# After build, check service worker
ls -la frontend/dist/sw.js
```

### Step 4: Browser Check
1. Open your deployed site
2. Press F12 (DevTools)
3. Go to **Application** tab
4. Check:
   - ✅ **Manifest** - Should show app details
   - ✅ **Service Workers** - Should show "sw.js" registered
   - ✅ **Icons** - All icons should load (no 404s)

## Testing PWA Locally

### Enable PWA in Development

The config has `devOptions.enabled: true` now, so you can test locally:

```bash
cd frontend
npm run dev
```

Then:
1. Open `http://localhost:5173`
2. Check DevTools → Application → Manifest
3. Try to install (Chrome: address bar icon, or DevTools → Application → Manifest → "Add to homescreen")

## Production Checklist

Before deploying, ensure:

- [ ] All PWA icons exist in `public/` folder
- [ ] `npm run build` completes without errors
- [ ] `dist/manifest.webmanifest` exists
- [ ] `dist/sw.js` exists
- [ ] Site uses HTTPS
- [ ] Manifest loads without errors (check DevTools)
- [ ] Service worker registers (check DevTools)

## Manual Installation

If install prompt doesn't show:

### Chrome/Edge (Desktop):
1. Click the install icon in address bar
2. OR: Menu (⋮) → "Install Productivity App"

### Chrome (Android):
1. Menu (⋮) → "Add to Home screen"
2. OR: Browser will show banner at bottom

### Safari (iOS):
1. Share button (□↑)
2. "Add to Home Screen"

## Debug Commands

```bash
# Check if icons exist
cd frontend/public
ls -la *.png *.ico

# Rebuild and check output
cd frontend
npm run build
ls -la dist/*.js dist/*.json dist/*.png

# Check manifest content
cat dist/manifest.webmanifest
```

## Still Not Working?

1. **Check browser console** for errors
2. **Check Network tab** - are icons loading? (should be 200, not 404)
3. **Check Application tab** - Manifest and Service Workers sections
4. **Try different browser** - Chrome has best PWA support
5. **Clear browser cache** - Old service worker might be cached
6. **Check Lighthouse** - Run PWA audit (should score > 90)

## Expected Behavior

✅ **Working PWA:**
- Install prompt appears (or install icon in address bar)
- Can add to home screen
- Opens in standalone mode (no browser UI)
- Works offline (after first load)
- Service worker active in DevTools

❌ **Not Working:**
- No install prompt
- Icons show 404 in Network tab
- Service worker shows error
- Manifest shows errors

---

**Most likely issue:** Missing `pwa-192x192.png` and `pwa-512x512.png` files in `public/` folder!

