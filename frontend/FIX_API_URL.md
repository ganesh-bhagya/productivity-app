# Fix API URL Configuration Issue

## Problem
The API URL is malformed: `https://productivity.javacraftit.com/backendproductivity.javacraftit.com/api/auth/login`

This happens when `VITE_API_URL` is set incorrectly.

## Solution

### Option 1: Backend on Same Domain (Recommended)
If your backend is at `https://productivity.javacraftit.com/api`:

**Set environment variable:**
```bash
VITE_API_URL=https://productivity.javacraftit.com/api
```

### Option 2: Backend on Subdomain
If your backend is at `https://backendproductivity.javacraftit.com/api`:

**Set environment variable:**
```bash
VITE_API_URL=https://backendproductivity.javacraftit.com/api
```

### Option 3: Backend on API Subdomain
If your backend is at `https://api.productivity.javacraftit.com/api`:

**Set environment variable:**
```bash
VITE_API_URL=https://api.productivity.javacraftit.com/api
```

## How to Fix

### If Using Vercel/Netlify:
1. Go to your project settings
2. Find "Environment Variables"
3. Add/Update: `VITE_API_URL` = `https://your-backend-domain.com/api`
4. **Important:** Make sure it starts with `https://` and includes `/api` at the end
5. Redeploy your application

### If Using Your Own Server:
1. Create/Edit `.env.production` in `frontend/` folder:
   ```bash
   VITE_API_URL=https://your-backend-domain.com/api
   ```
2. Rebuild:
   ```bash
   cd frontend
   npm run build
   ```
3. Redeploy the `dist/` folder

### If Already Deployed:
1. Update the environment variable in your hosting platform
2. Trigger a new build/deployment
3. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Common Mistakes to Avoid

❌ **Wrong:**
```
VITE_API_URL=backendproductivity.javacraftit.com/api
VITE_API_URL=/backendproductivity.javacraftit.com/api
VITE_API_URL=https://backendproductivity.javacraftit.com
```

✅ **Correct:**
```
VITE_API_URL=https://backendproductivity.javacraftit.com/api
```

## Verify the Fix

After updating:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check the request URL - it should be:
   `https://your-backend-domain.com/api/auth/login`
   (NOT with the frontend domain in the path)

## Quick Test

You can verify the API URL is correct by checking the built files:

```bash
cd frontend/dist
grep -r "VITE_API_URL" . || echo "Environment variable replaced in build"
```

The API URL should be hardcoded in the built JavaScript files.

