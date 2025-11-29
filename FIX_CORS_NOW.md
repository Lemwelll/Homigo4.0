# 🚀 Fix CORS Error - Do This Now!

## ✅ What I Fixed

Updated `backend/server.js` to allow your Vercel frontend URL

## 📝 What You Need to Do

### Step 1: Commit and Push (2 minutes)
```bash
git add backend/server.js
git commit -m "Fix: Update CORS configuration for Vercel deployment"
git push
```

### Step 2: Redeploy on Render (3 minutes)
1. Go to https://dashboard.render.com
2. Click on your backend service
3. Click "Manual Deploy" (top right)
4. Select "Deploy latest commit"
5. Wait for deployment to complete

### Step 3: Test Your Frontend (1 minute)
1. Go to https://homigov5.vercel.app
2. Try browsing properties
3. CORS error should be gone!

## 🎯 Expected Result

Before:
```
❌ CORS policy: Access-Control-Allow-Origin header has a value 
   'http://localhost:5173' that is not equal to the supplied origin
```

After:
```
✅ Properties load successfully
✅ No CORS errors
✅ Frontend works perfectly
```

## 🔧 Optional: Set Environment Variable

For better flexibility, add this in Render:

1. Go to your service in Render
2. Click "Environment" tab
3. Add variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://homigov5.vercel.app`
4. Click "Save Changes"

This allows you to change the frontend URL without code changes.

## ✅ Verification Checklist

After redeployment:
- [ ] Backend deployed successfully
- [ ] No errors in Render logs
- [ ] Frontend loads without CORS errors
- [ ] Can browse properties
- [ ] Can login/register
- [ ] All API calls work

## 🆘 If Still Not Working

### Check 1: Backend Deployed?
- Go to Render dashboard
- Check if deployment completed
- Look for "Live" badge

### Check 2: Correct URL?
- Your frontend: `https://homigov5.vercel.app`
- Check if this matches the URL in code

### Check 3: Clear Browser Cache
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Check 4: Check Render Logs
- Go to Render dashboard
- Click "Logs" tab
- Look for CORS-related messages

---

**Time to Fix**: 5 minutes
**Difficulty**: Easy
**Status**: Ready to deploy ✅

**Let's fix it! 🚀**
