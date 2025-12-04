# Quick Fix: PWA Not Showing as Installable

## The Main Issue: Missing Icons ⚠️

Your PWA needs these icons in `frontend/public/` folder:
- ✅ `pwa-192x192.png` (192x192 pixels)
- ✅ `pwa-512x512.png` (512x512 pixels)

**These are REQUIRED** - without them, the PWA won't be installable!

## Quick Fix (5 minutes)

### Step 1: Create Icons

**Option A: Use Online Tool (Easiest)**
1. Go to: https://www.pwabuilder.com/imageGenerator
2. Upload any square image (or use their generator)
3. Download the icons
4. Save as:
   - `pwa-192x192.png`
   - `pwa-512x512.png`

**Option B: Create Simple Test Icons**
1. Create a 512x512 blue square in any image editor
2. Save as `pwa-512x512.png`
3. Resize to 192x192 and save as `pwa-192x192.png`

### Step 2: Place Icons

Put both files in:
```
frontend/public/
├── pwa-192x192.png  ← Add this
└── pwa-512x512.png  ← Add this
```

### Step 3: Rebuild

```bash
cd frontend
npm run build
```

### Step 4: Redeploy

Deploy the new `dist/` folder to your server.

### Step 5: Test

1. Open your site in Chrome
2. Look for install icon in address bar (📱)
3. OR: DevTools → Application → Manifest → "Add to homescreen"

## Verify It Works

1. Open DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest**:
   - Should show app name
   - Icons should display (not show 404)
4. Check **Service Workers**:
   - Should show "sw.js" registered
   - Status: "activated and is running"

## Still Not Working?

Check these:

1. **HTTPS?** - Must use `https://` (not `http://`)
2. **Icons loading?** - Network tab should show 200 (not 404)
3. **Manifest valid?** - Application tab → Manifest should have no errors
4. **Service worker?** - Application tab → Service Workers should show active

## What I've Added

✅ Install prompt component (shows install button)
✅ PWA configuration updated
✅ Service worker auto-registration (via Vite PWA plugin)

**You just need to add the icons!**

---

**Most common issue:** Missing `pwa-192x192.png` and `pwa-512x512.png` files!

