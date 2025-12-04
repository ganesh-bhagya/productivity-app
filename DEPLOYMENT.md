# Deployment Guide - Productivity App

This guide covers building and deploying the frontend PWA (Progressive Web App) for production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Building for Production](#building-for-production)
3. [PWA Configuration](#pwa-configuration)
4. [Environment Variables](#environment-variables)
5. [Deployment Options](#deployment-options)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

### Required Software
- Node.js 18+ and npm
- Backend API running and accessible
- Domain/URL for your backend API

### Required Files
- PWA icons (see [PWA Icons Setup](#pwa-icons-setup))

---

## Building for Production

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.production` file in the `frontend` directory:

```bash
# .env.production
VITE_API_URL=https://your-api-domain.com
```

**Note:** Replace `https://your-api-domain.com` with your actual backend API URL.

### Step 3: Build the Application

```bash
npm run build
```

This command will:
- Type-check the TypeScript code
- Build optimized production assets
- Generate PWA manifest and service worker
- Output files to `frontend/dist/`

### Step 4: Preview the Build (Optional)

Test the production build locally:

```bash
npm run preview
```

This serves the built files at `http://localhost:4173` (or similar port).

---

## PWA Configuration

### PWA Icons Setup

The PWA requires icons for different devices. You need to create and place these files in `frontend/public/`:

#### Required Icons:
1. **favicon.ico** - 32x32 or 16x16 (browser tab icon)
2. **apple-touch-icon.png** - 180x180 (iOS home screen)
3. **pwa-192x192.png** - 192x192 (Android home screen)
4. **pwa-512x512.png** - 512x512 (Splash screen, Android)

#### Quick Icon Generation:

You can use online tools or create icons:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

#### Manual Icon Creation:

1. Create a square logo (512x512 minimum)
2. Generate all required sizes
3. Place them in `frontend/public/`:
   ```
   frontend/public/
   ├── favicon.ico
   ├── apple-touch-icon.png
   ├── pwa-192x192.png
   └── pwa-512x512.png
   ```

### Update Vite Config

The `vite.config.ts` already includes PWA configuration. Ensure icons are listed:

```typescript
icons: [
  {
    src: 'pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: 'pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png',
  },
]
```

### Update HTML Meta Tags

Update `index.html` with proper PWA meta tags:

```html
<meta name="theme-color" content="#1e293b" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

---

## Environment Variables

### Development (.env)
```bash
VITE_API_URL=http://localhost:3000
```

### Production (.env.production)
```bash
VITE_API_URL=https://api.yourdomain.com
```

### Important Notes:
- Environment variables must start with `VITE_` to be exposed to the client
- Never commit `.env.production` with sensitive data
- API URL should use HTTPS in production

---

## Deployment Options

### Option 1: Static Hosting (Recommended)

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to `frontend` directory
3. Run: `vercel --prod`
4. Follow prompts to configure

**Or use Vercel Dashboard:**
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

#### Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Navigate to `frontend` directory
3. Run: `netlify deploy --prod`
4. Follow prompts

**Or use Netlify Dashboard:**
1. Connect repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variable: `VITE_API_URL`

#### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

#### Cloudflare Pages
1. Connect repository
2. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Add environment variable: `VITE_API_URL`

### Option 2: Traditional Web Server

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/productivity-app/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # PWA support
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Service worker and manifest
    location ~* \.(sw\.js|manifest\.json)$ {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### Apache Configuration (.htaccess)

Place in `dist/` directory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/x-javascript "access plus 1 year"
</IfModule>

# Don't cache service worker
<FilesMatch "\.(sw\.js|manifest\.json)$">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
</FilesMatch>
```

### Option 3: Docker Deployment

Create `Dockerfile` in `frontend/`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:
```bash
docker build -t productivity-app .
docker run -p 80:80 productivity-app
```

---

## Build Scripts

### Production Build
```bash
npm run build
```

### Build with Analysis
```bash
npm run build -- --mode production
```

### Preview Production Build
```bash
npm run preview
```

### Custom Build Script

Add to `package.json` for deployment:

```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production npm run build",
    "deploy": "npm run build:prod && echo 'Build complete! Deploy dist/ folder'"
  }
}
```

---

## Post-Deployment Checklist

### ✅ PWA Functionality
- [ ] Service worker registers correctly
- [ ] App can be installed on mobile devices
- [ ] Offline functionality works (if implemented)
- [ ] Icons display correctly on home screen
- [ ] Splash screen appears on launch

### ✅ Performance
- [ ] Lighthouse PWA score > 90
- [ ] Page load time < 3 seconds
- [ ] All assets load correctly
- [ ] No console errors

### ✅ Functionality
- [ ] API connection works (check CORS if needed)
- [ ] Authentication works
- [ ] All features functional
- [ ] Responsive design works on mobile

### ✅ Security
- [ ] HTTPS enabled (required for PWA)
- [ ] Environment variables set correctly
- [ ] No sensitive data in client code
- [ ] CORS configured on backend

### ✅ SEO & Meta
- [ ] Title and description set
- [ ] Open Graph tags (if needed)
- [ ] Theme color matches design

---

## Troubleshooting

### Service Worker Not Registering
- Ensure HTTPS is enabled (required for service workers)
- Check browser console for errors
- Verify `vite-plugin-pwa` is configured correctly

### API Connection Issues
- Verify `VITE_API_URL` is set correctly
- Check CORS settings on backend
- Verify backend is accessible from frontend domain

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build` will show them
- Verify all dependencies are installed

### Icons Not Showing
- Ensure icons are in `public/` directory
- Check icon paths in `vite.config.ts`
- Verify icon files are valid PNG/ICO format

---

## Environment-Specific Builds

### Development
```bash
npm run dev
```

### Staging
```bash
# Create .env.staging
VITE_API_URL=https://staging-api.yourdomain.com

# Build
npm run build -- --mode staging
```

### Production
```bash
# Create .env.production
VITE_API_URL=https://api.yourdomain.com

# Build
npm run build -- --mode production
```

---

## Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build
        run: |
          cd frontend
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

---

## Quick Start Commands

```bash
# 1. Install dependencies
cd frontend && npm install

# 2. Set environment variable
echo "VITE_API_URL=https://your-api.com" > .env.production

# 3. Build for production
npm run build

# 4. Preview build (optional)
npm run preview

# 5. Deploy dist/ folder to your hosting service
```

---

## Additional Resources

- [Vite PWA Plugin Docs](https://vite-pwa-org.netlify.app/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Last Updated:** [Current Date]  
**Version:** 1.0

