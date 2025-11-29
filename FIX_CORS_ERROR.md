# ✅ Fixed: CORS Error

## Problem

Your frontend on Vercel (`https://homigov5.vercel.app`) was blocked by CORS:
```
Access-Control-Allow-Origin' header has a value 'http://localhost:5173' 
that is not equal to the supplied origin
```

## Cause

Your backend's CORS configuration was only allowing `localhost:5173`, but your frontend is now deployed on Vercel.

## Solution

I've updated `backend/server.js` to allow multiple origins:

```javascript
const allowedOrigins = [
    'http://localhost:5173',          // Local development
    'http://localhost:5174',          // Alternative local port
    'https://homigov5.vercel.app',    // Your Vercel deployment
    process.env.FRONTEND_URL          // Environment variable
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
```

## What This Does

✅ Allows requests from `localhost:5173` (development)
✅ Allows requests from `https://homigov5.vercel.app` (production)
✅ Allows requests from `FRONTEND_URL` environment variable
✅ Allows requests with no origin (mobile apps, curl)
✅ Works in both development and production

## Next Steps

### 1. Commit and Push
```bash
git add backend/server.js
git commit -m "Fix: Update CORS to allow Vercel frontend"
git push
```

### 2. Redeploy Backend on Render
- Go to Render dashboard
- Click "Manual Deploy" → "Deploy latest commit"
- Wait for deployment

### 3. Set Environment Variable (Optional but Recommended)
In Render dashboard:
1. Go to your service
2. Environment → Add variable:
   - Key: `FRONTEND_URL`
   - Value: `https://homigov5.vercel.app`
3. Save changes (service will restart)

### 4. Test
After redeployment, your frontend should work:
```
https://homigov5.vercel.app
```

## Verification

Test that CORS is working:
```bash
curl -H "Origin: https://homigov5.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend.onrender.com/properties/verified
```

Should return headers including:
```
Access-Control-Allow-Origin: https://homigov5.vercel.app
```

## Common CORS Issues

### Issue 1: Still Getting CORS Error
**Solution**: Make sure you've redeployed the backend after the code change

### Issue 2: Works Locally but Not in Production
**Solution**: Check that your Vercel URL is in the `allowedOrigins` array

### Issue 3: Different Vercel URL
**Solution**: Update the URL in `allowedOrigins` or use `FRONTEND_URL` env variable

## Multiple Frontend URLs

If you have multiple frontend deployments (staging, production, etc.):

```javascript
const allowedOrigins = [
    'http://localhost:5173',
    'https://homigov5.vercel.app',           // Production
    'https://homigov5-staging.vercel.app',   // Staging
    'https://homigov5-preview.vercel.app',   // Preview
    process.env.FRONTEND_URL
].filter(Boolean);
```

## Security Note

This configuration:
- ✅ Allows specific origins only
- ✅ Blocks unknown origins
- ✅ Supports credentials (cookies, auth headers)
- ✅ Works in development and production

---

**Status**: ✅ Fixed
**Action Required**: Commit, push, and redeploy
**Time**: 5 minutes
