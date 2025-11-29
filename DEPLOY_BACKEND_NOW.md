# 🚀 Deploy Backend to Render - Quick Start

## Do This Right Now!

---

## 1. Go to Render

Open: https://dashboard.render.com

Sign in with GitHub

---

## 2. Create Web Service

Click: **"New +"** → **"Web Service"**

---

## 3. Connect Your Repo

Find your repository → Click **"Connect"**

---

## 4. Fill in These Settings

### Basic:
- **Name**: `homigo-backend`
- **Region**: Choose closest
- **Branch**: `main`

### Build:
- **Root Directory**: `backend` ⚠️
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

---

## 5. Add Environment Variables

Click **"Advanced"** → Add these:

```
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-secret-key-32-chars-min
FRONTEND_URL=https://your-frontend.vercel.app
```

### Get Supabase Credentials:
1. Go to https://supabase.com/dashboard
2. Your Project → Settings → API
3. Copy "Project URL" and "anon public" key

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 6. Deploy!

Click: **"Create Web Service"**

Wait 2-5 minutes

---

## 7. Check It Works

Your URL: `https://homigo-backend.onrender.com`

Test:
```bash
curl https://homigo-backend.onrender.com/health
```

Should return:
```json
{"success":true,"message":"Homigo API is running"}
```

---

## ✅ Done!

Your backend is live!

**Next**: Update frontend to use this URL

---

## Need Help?

See detailed guides:
- `RENDER_DEPLOYMENT_COMPLETE_GUIDE.md` - Full guide
- `RENDER_DEPLOYMENT_VISUAL_GUIDE.md` - Step-by-step with screenshots
- `RENDER_DEPLOYMENT_CHECKLIST.md` - Quick checklist

---

## Troubleshooting

### "No open ports detected"
→ Set Root Directory to `backend`

### "Build failed"
→ Check logs, verify package.json exists

### "Database connection failed"
→ Check Supabase credentials

---

**Time to deploy**: 5-10 minutes
**Difficulty**: Easy
**Cost**: Free tier available

**Let's go! 🚀**
