# 🚀 Complete Render Deployment Guide - Backend

## Step-by-Step Guide to Deploy Your Backend on Render

---

## Prerequisites

Before you start, make sure you have:
- [x] GitHub account with your code pushed
- [x] Render account (sign up at https://render.com)
- [x] Supabase project set up
- [x] All environment variables ready

---

## Part 1: Prepare Your Backend

### 1. Verify Your Backend Structure

Your backend folder should have:
```
backend/
├── server.js (or server-render.js)
├── package.json
├── config/
├── controllers/
├── routes/
├── services/
├── middleware/
└── utils/
```

### 2. Check package.json

Make sure your `backend/package.json` has:

```json
{
  "name": "homigo-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "@supabase/supabase-js": "^2.38.4",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1"
  }
}
```

### 3. Verify Server File

Your `backend/server.js` or `backend/server-render.js` should:
- Use `process.env.PORT` for the port
- Bind to `0.0.0.0` (not `localhost`)
- Have a `/health` endpoint

---

## Part 2: Deploy to Render

### Step 1: Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** button (top right)
3. Select **"Web Service"**

### Step 2: Connect Repository

1. Click **"Connect a repository"**
2. If first time: Click **"Connect GitHub"** and authorize Render
3. Find your repository in the list
4. Click **"Connect"**

### Step 3: Configure Service Settings

Fill in these settings **EXACTLY**:

#### Basic Information:
- **Name**: `homigo-backend` (or your preferred name)
- **Region**: Choose closest to your location (e.g., Singapore, Oregon)
- **Branch**: `main` (or your default branch)

#### Build & Deploy Settings:
- **Root Directory**: `backend` ⚠️ **CRITICAL - Must be exactly "backend"**
- **Runtime**: `Node`
- **Build Command**: 
  ```
  npm install
  ```
- **Start Command**: 
  ```
  node server.js
  ```
  OR if using server-render.js:
  ```
  node server-render.js
  ```

#### Instance Type:
- **Free** (for testing)
- **Starter** or higher (for production)

### Step 4: Add Environment Variables

Click **"Advanced"** button, then add these environment variables:

```
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=https://your-frontend.vercel.app
```

#### How to Get Supabase Credentials:

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** → Use as `SUPABASE_URL`
   - **anon public** key → Use as `SUPABASE_ANON_KEY`

#### Generate JWT Secret:

Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy!

1. Click **"Create Web Service"**
2. Render will start building your app
3. Wait 2-5 minutes for deployment

---

## Part 3: Monitor Deployment

### Watch the Logs

In Render dashboard:
1. Click on your service
2. Go to **"Logs"** tab
3. Watch for these success messages:

```
==> Building...
==> Installing dependencies
==> Build successful
==> Starting service
╔════════════════════════════════════════╗
║     HOMIGO BACKEND API SERVER         ║
╚════════════════════════════════════════╝

🚀 Server running on 0.0.0.0:10000
📍 Environment: production
✅ Server successfully bound to 0.0.0.0:10000
✅ Database connected successfully
```

### Common Log Messages:

✅ **Success**:
```
Server successfully bound to 0.0.0.0:10000
Your service is live 🎉
```

❌ **Error - No open ports**:
```
No open ports detected
```
**Fix**: Check Root Directory is set to `backend`

❌ **Error - Module not found**:
```
Cannot find module './routes/authRoutes.js'
```
**Fix**: Make sure all files are pushed to GitHub

---

## Part 4: Test Your Deployment

### Get Your Backend URL

After deployment, Render gives you a URL like:
```
https://homigo-backend.onrender.com
```

### Test Health Endpoint

Open in browser or use curl:
```bash
curl https://homigo-backend.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Homigo API is running",
  "timestamp": "2025-11-29T...",
  "env": "production"
}
```

### Test API Endpoints

```bash
# Test root endpoint
curl https://homigo-backend.onrender.com/

# Test properties endpoint (should require auth)
curl https://homigo-backend.onrender.com/properties
```

---

## Part 5: Connect Frontend to Backend

### Update Frontend Environment Variable

In your frontend (Vercel/Netlify):

Add environment variable:
```
VITE_API_URL=https://homigo-backend.onrender.com
```

### Update Frontend Code

Make sure your frontend uses the environment variable:

```javascript
// In your API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Example
fetch(`${API_URL}/properties`)
```

### Redeploy Frontend

After adding the environment variable, redeploy your frontend.

---

## Troubleshooting

### Issue 1: "No open ports detected"

**Cause**: Server not binding to correct host/port

**Solution**:
1. Check Root Directory is `backend`
2. Verify server.js uses:
   ```javascript
   const PORT = process.env.PORT || 5000
   const HOST = '0.0.0.0'
   app.listen(PORT, HOST, () => {...})
   ```

### Issue 2: "Build failed"

**Cause**: Missing dependencies or syntax errors

**Solution**:
1. Check package.json exists in backend folder
2. Run `npm install` locally to verify dependencies
3. Check for syntax errors in code

### Issue 3: "Database connection failed"

**Cause**: Wrong Supabase credentials

**Solution**:
1. Verify SUPABASE_URL is correct
2. Verify SUPABASE_ANON_KEY is correct
3. Check Supabase project is active

### Issue 4: "Module not found"

**Cause**: Files not pushed to GitHub or wrong paths

**Solution**:
1. Make sure all files are committed and pushed
2. Check import paths use correct case (case-sensitive)
3. Verify all route files exist

### Issue 5: CORS Errors

**Cause**: Frontend URL not whitelisted

**Solution**:
1. Add FRONTEND_URL environment variable
2. Update CORS configuration in server.js:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*',
     credentials: true
   }))
   ```

---

## Render Dashboard Features

### Logs
- View real-time logs
- Search logs
- Download logs

### Metrics
- CPU usage
- Memory usage
- Request count
- Response times

### Settings
- Update environment variables
- Change instance type
- Configure auto-deploy
- Set up custom domain

### Manual Deploy
- Click "Manual Deploy" → "Deploy latest commit"
- Use when auto-deploy is off

---

## Best Practices

### 1. Use Environment Variables
Never hardcode:
- Database credentials
- API keys
- JWT secrets
- URLs

### 2. Enable Auto-Deploy
- Render can auto-deploy on git push
- Settings → Auto-Deploy → Enable

### 3. Monitor Logs
- Check logs regularly
- Set up log alerts
- Monitor error rates

### 4. Use Health Checks
- Render pings /health endpoint
- Returns 200 = healthy
- Returns error = unhealthy

### 5. Scale Appropriately
- Start with Free tier for testing
- Upgrade to Starter for production
- Monitor usage and scale up if needed

---

## Pricing

### Free Tier
- ✅ Good for testing
- ⚠️ Spins down after 15 min of inactivity
- ⚠️ Cold starts (slow first request)
- 750 hours/month free

### Starter Tier ($7/month)
- ✅ Always on
- ✅ No cold starts
- ✅ Better performance
- ✅ Recommended for production

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Health endpoint returns 200
- [ ] Can access root endpoint
- [ ] Database connection works
- [ ] Frontend can connect to backend
- [ ] CORS is configured correctly
- [ ] All API endpoints work
- [ ] Authentication works
- [ ] File uploads work (if using)
- [ ] Environment variables are set
- [ ] Logs show no errors

---

## Quick Reference

### Render Dashboard
https://dashboard.render.com

### Your Backend URL
```
https://your-service-name.onrender.com
```

### Important Endpoints
```
GET  /health              - Health check
GET  /                    - API info
POST /auth/signup         - Register
POST /auth/login          - Login
GET  /properties          - Get properties
```

### Environment Variables Needed
```
NODE_ENV=production
PORT=10000
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
JWT_SECRET=...
FRONTEND_URL=...
```

---

## Need Help?

### Render Support
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### Check Logs First
Most issues can be diagnosed from logs:
1. Go to your service
2. Click "Logs"
3. Look for error messages
4. Search for specific errors online

---

## Success! 🎉

Your backend is now deployed and running on Render!

**Next Steps**:
1. Deploy frontend to Vercel/Netlify
2. Update frontend API URL
3. Test all features end-to-end
4. Monitor logs for any issues
5. Set up custom domain (optional)

---

**Date**: November 29, 2025
**Status**: Ready to Deploy ✅
**Platform**: Render.com
