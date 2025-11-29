# ✅ Render Deployment Checklist

## Quick Reference for Deploying Backend to Render

---

## Before You Start

- [ ] Code is pushed to GitHub
- [ ] Have Supabase credentials ready
- [ ] Have Render account created

---

## Render Configuration

### Service Settings
- [ ] Name: `homigo-backend`
- [ ] Region: Selected
- [ ] Branch: `main`
- [ ] Root Directory: `backend` ⚠️ **CRITICAL**
- [ ] Runtime: `Node`

### Build & Deploy
- [ ] Build Command: `npm install`
- [ ] Start Command: `node server.js` (or `node server-render.js`)

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `SUPABASE_URL=https://...`
- [ ] `SUPABASE_ANON_KEY=...`
- [ ] `JWT_SECRET=...` (min 32 characters)
- [ ] `FRONTEND_URL=https://...`

---

## After Deployment

### Check Logs
- [ ] No errors in build logs
- [ ] Server started successfully
- [ ] Bound to 0.0.0.0:10000
- [ ] Database connected

### Test Endpoints
- [ ] `GET /health` returns 200
- [ ] `GET /` returns API info
- [ ] No CORS errors

### Frontend Integration
- [ ] Added `VITE_API_URL` to frontend
- [ ] Frontend can reach backend
- [ ] API calls work

---

## Common Issues & Quick Fixes

### ❌ "No open ports detected"
**Fix**: Set Root Directory to `backend`

### ❌ "Build failed"
**Fix**: Check package.json exists, run `npm install` locally

### ❌ "Database connection failed"
**Fix**: Verify Supabase credentials

### ❌ "Module not found"
**Fix**: Push all files to GitHub, check import paths

### ❌ CORS errors
**Fix**: Add FRONTEND_URL environment variable

---

## Your Backend URL

After deployment:
```
https://homigo-backend.onrender.com
```

Test it:
```bash
curl https://homigo-backend.onrender.com/health
```

---

## Quick Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Health Endpoint
```bash
curl https://your-backend.onrender.com/health
```

### View Logs
Go to: Dashboard → Your Service → Logs

---

## Success Indicators

✅ Build completed
✅ Server started
✅ Port bound successfully
✅ Database connected
✅ Health check returns 200
✅ No errors in logs

---

**Ready to deploy? Follow RENDER_DEPLOYMENT_COMPLETE_GUIDE.md for detailed steps!**
