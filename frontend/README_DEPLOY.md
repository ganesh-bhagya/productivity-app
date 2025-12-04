# Frontend Deployment Guide

## Quick Start

### 1. Set Environment Variable

Create `.env.production` file:
```bash
VITE_API_URL=https://your-backend-api.com
```

### 2. Build

```bash
npm run build
```

Output will be in `dist/` folder.

### 3. Deploy

Deploy the `dist/` folder to any static hosting service:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Cloudflare Pages
- Your own server

---

## Detailed Instructions

See:
- `../DEPLOYMENT.md` - Full deployment guide
- `DEPLOY_QUICK_START.md` - Quick reference

---

## Build Commands

```bash
# Development build
npm run dev

# Production build
npm run build

# Production build (explicit)
npm run build:prod

# Preview production build locally
npm run preview

# Check if build is ready
npm run deploy:check
```

---

## PWA Requirements

Before deploying, ensure you have:
- ✅ PWA icons in `public/` folder
- ✅ HTTPS enabled (required for service workers)
- ✅ Backend API URL set in `.env.production`

See `public/PWA_ICONS.md` for icon requirements.

---

## Troubleshooting

**Build fails?**
- Check TypeScript errors: `npm run build` shows them
- Clear cache: `rm -rf node_modules && npm install`

**Service worker not working?**
- Must use HTTPS in production
- Check browser console for errors

**API not connecting?**
- Verify `VITE_API_URL` in `.env.production`
- Check CORS settings on backend

