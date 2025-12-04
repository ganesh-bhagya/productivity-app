# API URL Troubleshooting Guide

## Current Issue
The API request is going to: `https://productivity.javacraftit.com/backendproductivity.javacraftit.com/api/auth/login`

This is **WRONG** - it's concatenating the frontend domain with the backend domain incorrectly.

## Root Cause
The `VITE_API_URL` environment variable is likely set to:
- `backendproductivity.javacraftit.com/api` (missing `https://`)
- OR `/backendproductivity.javacraftit.com/api` (relative path)
- OR some other incorrect format

## Quick Fix Steps

### Step 1: Determine Your Backend URL
Where is your backend API actually hosted?

**Option A:** Same domain, different path
- Frontend: `https://productivity.javacraftit.com`
- Backend: `https://productivity.javacraftit.com/api`
- **Set:** `VITE_API_URL=https://productivity.javacraftit.com/api`

**Option B:** Different subdomain
- Frontend: `https://productivity.javacraftit.com`
- Backend: `https://backendproductivity.javacraftit.com/api`
- **Set:** `VITE_API_URL=https://backendproductivity.javacraftit.com/api`

**Option C:** API subdomain
- Frontend: `https://productivity.javacraftit.com`
- Backend: `https://api.productivity.javacraftit.com/api`
- **Set:** `VITE_API_URL=https://api.productivity.javacraftit.com/api`

### Step 2: Update Environment Variable

#### For Vercel:
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Find `VITE_API_URL`
4. Update to: `https://your-actual-backend-domain.com/api`
5. Redeploy

#### For Netlify:
1. Go to Site settings → Environment variables
2. Update `VITE_API_URL`
3. Redeploy

#### For Your Own Server:
1. Edit `frontend/.env.production`:
   ```bash
   VITE_API_URL=https://your-actual-backend-domain.com/api
   ```
2. Rebuild:
   ```bash
   cd frontend
   npm run build
   ```
3. Redeploy `dist/` folder

### Step 3: Verify

After updating, check the Network tab:
- ✅ **Correct:** `https://backendproductivity.javacraftit.com/api/auth/login`
- ❌ **Wrong:** `https://productivity.javacraftit.com/backendproductivity.javacraftit.com/api/auth/login`

## Debug: Check Current Value

Add this temporarily to see what's being used:

```typescript
// In src/services/api.ts, add:
console.log('API_URL:', API_URL);
```

Then check browser console to see the actual value.

## Common Mistakes

| Wrong | Correct |
|-------|---------|
| `backendproductivity.javacraftit.com/api` | `https://backendproductivity.javacraftit.com/api` |
| `/backendproductivity.javacraftit.com/api` | `https://backendproductivity.javacraftit.com/api` |
| `https://backendproductivity.javacraftit.com` | `https://backendproductivity.javacraftit.com/api` |
| `http://backendproductivity.javacraftit.com/api` | `https://backendproductivity.javacraftit.com/api` (use HTTPS) |

## Still Not Working?

1. **Clear browser cache** - Old JavaScript might be cached
2. **Hard refresh** - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. **Check build** - Make sure you rebuilt after changing env variable
4. **Check CORS** - Backend must allow requests from frontend domain

