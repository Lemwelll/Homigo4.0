# 🚀 RENDER DEPLOYMENT GUIDE - COMPLETE SOLUTION

## Problem Analysis

Your server is not binding to `0.0.0.0` which Render requires. This happens when:
1. The app crashes before binding to the port
2. Environment variables are missing
3. The wrong directory is being deployed

---

## ✅ SOLUTION: Step-by-Step Render Deployment

### STEP 1: Create a New Web Service in Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository

---

### STEP 2: Configure Build Settings

**CRITICAL**: Use these EXACT settings:

#### Basic Settings:
- **Name**: `homigo-backend` (or any name you want)
- **Region**: Choose closest to you
- **Branch**: `main` (or your branch name)
- **Root Directory**: `backend` ⚠️ **CRITICAL - Must be "backend"**
- **Runtime**: `Node`

#### Build & Deploy:
- **Build Command**: 
  ```
  npm install
  ```

- **Start Command**: 
  ```
  node server.js
  ```

---

### STEP 3: Environment Variables

Click "Advanced" → Add these environment variables:

```
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**How to get Supabase credentials:**
1. Go to your Supabase project
2. Settings → API
3. Copy "Project URL" → Use as `SUPABASE_URL`
4. Copy "anon public" key → Use as `SUPABASE_ANON_KEY`

---

### STEP 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (2-5 minutes)
3. Check logs for errors

---

## 🔍 Troubleshooting

### If you see "No open ports detected":

**Check 1: Root Directory**
- Make sure Root Directory is set to `backend`
- NOT empty, NOT `.`, NOT `./backend`
- Just: `backend`

**Check 2: Environment Variables**
- All 5 variables must be set
- No typos in variable names
- Values must not have quotes

**Check 3: Logs**
Look for these in Render logs:
```
✅ Server successfully bound to 0.0.0.0:10000
```

If you see errors about missing modules:
```
npm install
```

If you see database errors:
- Check SUPABASE_URL and SUPABASE_ANON_KEY are correct

---

## 📋 Checklist

Before deploying, verify:

- [ ] Root Directory = `backend`
- [ ] Build Command = `npm install`
- [ ] Start Command = `node server.js`
- [ ] NODE_ENV = `production`
- [ ] SUPABASE_URL is set
- [ ] SUPABASE_ANON_KEY is set
- [ ] JWT_SECRET is set
- [ ] FRONTEND_URL is set
- [ ] No .env file in repository (use Render env vars)

---

## 🎯 Expected Result

After successful deployment, you should see:

```
╔════════════════════════════════════════╗
║     HOMIGO BACKEND API SERVER         ║
╚════════════════════════════════════════╝

🚀 Server running on 0.0.0.0:10000
📍 Environment: production
🌐 API URL: http://0.0.0.0:10000
🔗 Frontend URL: https://your-frontend.vercel.app
✅ Server successfully bound to 0.0.0.0:10000
✅ Database connected successfully
```

Your backend URL will be: `https://homigo-backend.onrender.com`

---

## 🌐 Frontend Deployment (Separate)

Deploy frontend on Vercel:

1. Go to [Vercel](https://vercel.com)
2. Import your repository
3. Framework: Vite
4. Root Directory: `.` (root, not backend)
5. Build Command: `npm run build`
6. Output Directory: `dist`

**Environment Variable for Frontend:**
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🔧 Alternative: If Root Directory Doesn't Work

If Render doesn't have Root Directory option, use these commands:

**Build Command:**
```bash
cd backend && npm install
```

**Start Command:**
```bash
cd backend && node server.js
```

---

## 📞 Still Not Working?

Check Render logs for specific errors:

1. Go to your service in Render
2. Click "Logs" tab
3. Look for error messages
4. Common issues:
   - Missing dependencies: Run `npm install` in backend folder locally
   - Syntax errors: Check server.js for errors
   - Port binding: Server must use `process.env.PORT`

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Server starts and binds to port
- ✅ Health check endpoint works: `https://your-app.onrender.com/health`
- ✅ No "port binding" errors in logs

---

## 🎉 Final Test

Test your deployed backend:

```bash
curl https://your-backend.onrender.com/health
```

Should return:
```json
{
  "success": true,
  "message": "Homigo API is running",
  "timestamp": "2025-11-21T..."
}
```

---

**Your backend is now live! 🚀**
