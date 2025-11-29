# Fix Mobile Network Error - Quick Start

## 🎯 Problem
Your app at https://homigov5.vercel.app works on PC but shows "Network error" on mobile.

## 🔍 Why?
The app is trying to connect to `http://localhost:5000` which only exists on your PC, not on mobile devices.

## ✅ Solution (3 Steps)

### Step 1: Deploy Your Backend

**Where is your backend deployed?**
- [ ] Not deployed yet → Deploy to Render.com or Vercel
- [ ] Already deployed → Get the URL

**If not deployed:**
1. Go to https://render.com
2. Create new Web Service
3. Connect your repo
4. Set Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables from `backend/.env`
8. Deploy and copy the URL

### Step 2: Update Environment File

Edit `.env.production` file:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

**Replace with your actual backend URL!**

### Step 3: Run Fix Script

```bash
node fix-api-urls.js
```

This will automatically update all files to use the environment variable.

### Step 4: Deploy

```bash
git add .
git commit -m "Fix mobile network error"
git push
```

Vercel will auto-deploy.

### Step 5: Test on Mobile

Open https://homigov5.vercel.app on your phone and try to register!

---

## 🚨 Quick Checklist

- [ ] Backend is deployed and accessible
- [ ] `.env.production` has correct backend URL (not localhost!)
- [ ] Ran `node fix-api-urls.js`
- [ ] Committed and pushed changes
- [ ] Tested on mobile

---

## 📱 What Backend URL to Use?

**If deployed on Render:**
```
https://your-app-name.onrender.com
```

**If deployed on Vercel:**
```
https://your-backend.vercel.app
```

**NOT this:**
```
http://localhost:5000  ❌ (Only works on your PC!)
```

---

## ⚡ Super Quick Fix

If you just want to test quickly:

1. Find your backend URL
2. Edit `.env.production`:
   ```
   VITE_API_URL=https://your-backend-url-here
   ```
3. Run: `node fix-api-urls.js`
4. Push to GitHub
5. Done!

---

## 🆘 Need Help?

**Backend not deployed?**
→ Read: `RENDER_DEPLOYMENT_GUIDE.md`

**Still getting network error?**
→ Read: `FIX_MOBILE_NETWORK_ERROR.md`

**Want to understand the fix?**
→ The issue is that mobile can't access `localhost` on your PC. We need to use a public URL instead.

---

**Status**: Ready to fix!  
**Time**: 10 minutes  
**Difficulty**: Easy
