# Quick Deployment Guide

## 🚀 Fastest Way to Deploy

### 1. Build the App
```bash
cd frontend
npm install
npm run build
```

### 2. Deploy to Vercel (Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Or use Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Set:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Environment Variable:** `VITE_API_URL` = your backend URL

### 3. Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod
```

**Or use Netlify Dashboard:**
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `dist` folder
3. Or connect Git repository

---

## 📝 Before Building

### Set Environment Variable

Create `frontend/.env.production`:
```bash
VITE_API_URL=https://your-backend-api.com
```

Replace with your actual backend URL.

---

## 📱 PWA Icons (Required)

Create these icons and place in `frontend/public/`:
- `favicon.ico` (32x32)
- `apple-touch-icon.png` (180x180)
- `pwa-192x192.png` (192x192)
- `pwa-512x512.png` (512x512)

**Quick way:** Use [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)

---

## ✅ After Deployment

1. Test the app works
2. Check service worker registers
3. Test on mobile device
4. Verify API connection

---

**That's it!** Your PWA is now live! 🎉

