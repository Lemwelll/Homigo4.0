# Fix Mobile Network Error - Complete Guide

## 🎯 Problem
- App works on PC: ✅
- App shows "Network error" on mobile: ❌
- Deployed at: https://homigov5.vercel.app

## 🔍 Root Cause
The frontend is hardcoded to use `http://localhost:5000` which only works on your PC. Mobile devices can't access `localhost` from your computer.

## ✅ Solution

### Step 1: Deploy Your Backend

Your backend needs to be deployed and accessible from the internet. Options:

**Option A: Render.com (Recommended)**
1. Go to https://render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - Name: homigo-backend
   - Root Directory: backend
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables (from backend/.env)
7. Deploy!
8. Copy your backend URL (e.g., `https://homigo-backend.onrender.com`)

**Option B: Vercel**
1. Deploy backend separately to Vercel
2. Get the backend URL

### Step 2: Update Environment Variables

**Edit `.env.production`:**
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url.onrender.com` with your actual backend URL!

### Step 3: Update All API Calls

I've created `src/config/api.js` for you. Now update these files to use it:

**Files to update:**
1. src/context/AuthContext.jsx
2. src/context/StudentContext.jsx
3. src/pages/StudentRegister.jsx
4. src/pages/LandlordRegister.jsx
5. src/pages/StudentLogin.jsx
6. src/pages/LandlordLogin.jsx
7. All other files using `http://localhost:5000`

**Change from:**
```javascript
const response = await fetch('http://localhost:5000/auth/signup', {
```

**Change to:**
```javascript
import API_URL from '../config/api'

const response = await fetch(`${API_URL}/auth/signup`, {
```

### Step 4: Search and Replace

Run this command to find all hardcoded localhost URLs:

```bash
# Windows
findstr /s /i "localhost:5000" src\*.jsx src\*.js

# Or use VS Code:
# Press Ctrl+Shift+F
# Search for: localhost:5000
# Replace with: ${API_URL}
# (Don't forget to import API_URL!)
```

### Step 5: Redeploy to Vercel

```bash
# Commit changes
git add .
git commit -m "Fix mobile network error - use environment variables"
git push

# Vercel will auto-deploy
```

### Step 6: Verify

1. Open https://homigov5.vercel.app on mobile
2. Try to register
3. Should work! ✅

---

## 🚀 Quick Fix Script

I'll create a script to automatically update all files:

**Run this:**
```bash
node fix-api-urls.js
```

---

## 📝 Checklist

- [ ] Backend is deployed and accessible
- [ ] `.env.production` has correct backend URL
- [ ] All `localhost:5000` replaced with `${API_URL}`
- [ ] All files import `API_URL` from `../config/api`
- [ ] Changes committed and pushed
- [ ] Vercel redeployed
- [ ] Tested on mobile

---

## 🔧 Manual Fix Example

**Before (StudentRegister.jsx):**
```javascript
const result = await register({...})

// Later in file:
const uploadResponse = await fetch('http://localhost:5000/upload/student-id', {
```

**After:**
```javascript
import API_URL from '../config/api'

const result = await register({...})

// Later in file:
const uploadResponse = await fetch(`${API_URL}/upload/student-id`, {
```

---

## ⚠️ Important Notes

1. **Backend URL**: Must be HTTPS (not HTTP) for production
2. **CORS**: Backend must allow requests from https://homigov5.vercel.app
3. **Environment Variables**: Vercel needs to rebuild after .env changes
4. **Mobile Testing**: Clear browser cache on mobile before testing

---

## 🐛 Still Not Working?

### Check 1: Backend is Running
Visit your backend URL in browser: `https://your-backend-url.onrender.com`
Should see: "Server is running" or similar

### Check 2: CORS is Configured
Backend needs this in `server.js`:
```javascript
app.use(cors({
  origin: ['https://homigov5.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Check 3: Environment Variable is Set
In Vercel dashboard:
- Go to your project
- Settings → Environment Variables
- Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
- Redeploy

### Check 4: Mobile Browser Console
On mobile:
- Use Chrome Remote Debugging
- Or use Eruda (mobile console)
- Check actual error message

---

## 📱 Test on Mobile

1. Open https://homigov5.vercel.app on mobile
2. Open browser dev tools (if possible)
3. Try to register
4. Check network tab for failed requests
5. Verify it's calling the correct backend URL

---

## ✅ Success Criteria

When fixed, you should see:
- ✅ Mobile can register/login
- ✅ No "Network error" message
- ✅ API calls go to deployed backend (not localhost)
- ✅ Works on both PC and mobile

---

**Next Steps:**
1. Deploy your backend first
2. Update `.env.production` with backend URL
3. Run the fix script (I'll create it next)
4. Redeploy to Vercel
5. Test on mobile

Ready to proceed?
