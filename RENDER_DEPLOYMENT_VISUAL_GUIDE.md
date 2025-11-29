# 📸 Render Deployment - Visual Step-by-Step Guide

## Follow these exact steps with screenshots descriptions

---

## Step 1: Go to Render Dashboard

1. Open browser
2. Go to: https://dashboard.render.com
3. Sign in with GitHub (recommended) or email

**What you'll see**: Render dashboard with "New +" button in top right

---

## Step 2: Create New Web Service

1. Click **"New +"** button (top right corner)
2. Select **"Web Service"** from dropdown

**What you'll see**: Options for different service types

---

## Step 3: Connect Repository

### If First Time:
1. Click **"Connect a repository"**
2. Click **"Connect GitHub"**
3. Authorize Render to access your GitHub
4. Select repositories to give access

### If Already Connected:
1. Find your repository in the list
2. Click **"Connect"** button next to it

**What you'll see**: List of your GitHub repositories

---

## Step 4: Configure Basic Settings

You'll see a form with multiple sections. Fill them out:

### Section 1: Basic Information

**Name**:
```
homigo-backend
```
(or any name you prefer - this will be in your URL)

**Region**:
- Select closest to you
- Examples: Singapore, Oregon (US West), Frankfurt

**Branch**:
```
main
```
(or your default branch name)

**What you'll see**: Text inputs and dropdowns

---

## Step 5: Configure Build Settings

### Root Directory ⚠️ MOST IMPORTANT
```
backend
```
**Type exactly**: `backend`
**NOT**: `./backend`, `/backend`, or empty

### Runtime
Select: **Node**

### Build Command
```
npm install
```

### Start Command
```
node server.js
```
OR if you're using server-render.js:
```
node server-render.js
```

**What you'll see**: Text inputs for commands

---

## Step 6: Add Environment Variables

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"** button
3. Add each variable one by one:

### Variable 1:
- Key: `NODE_ENV`
- Value: `production`

### Variable 2:
- Key: `PORT`
- Value: `10000`

### Variable 3:
- Key: `SUPABASE_URL`
- Value: `https://your-project-id.supabase.co`

**How to get this**:
1. Go to https://supabase.com/dashboard
2. Click your project
3. Settings → API
4. Copy "Project URL"

### Variable 4:
- Key: `SUPABASE_ANON_KEY`
- Value: `your-anon-key-here`

**How to get this**:
1. Same page as above
2. Copy "anon public" key

### Variable 5:
- Key: `JWT_SECRET`
- Value: `your-secret-key-min-32-characters`

**How to generate**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Variable 6:
- Key: `FRONTEND_URL`
- Value: `https://your-frontend.vercel.app`

(Add this later if you don't have frontend deployed yet)

**What you'll see**: Key-value pairs for each variable

---

## Step 7: Choose Instance Type

### For Testing:
- Select **"Free"**
- Note: Spins down after 15 min inactivity

### For Production:
- Select **"Starter"** ($7/month)
- Always on, no cold starts

**What you'll see**: Pricing options with features listed

---

## Step 8: Deploy!

1. Review all settings
2. Click **"Create Web Service"** button at bottom
3. Wait for deployment to start

**What you'll see**: Redirect to service page with logs

---

## Step 9: Monitor Deployment

### Watch the Logs

You'll see logs streaming in real-time:

```
==> Cloning from https://github.com/...
==> Checking out commit...
==> Running build command: npm install
==> Installing dependencies...
==> Build successful!
==> Starting service with: node server.js
```

### Success Messages to Look For:

```
╔════════════════════════════════════════╗
║     HOMIGO BACKEND API SERVER         ║
╚════════════════════════════════════════╝

🚀 Server running on 0.0.0.0:10000
📍 Environment: production
✅ Server successfully bound to 0.0.0.0:10000
✅ Database connected successfully
```

### At the Top:
```
Your service is live 🎉
```

**What you'll see**: Green "Live" badge at top of page

---

## Step 10: Get Your Backend URL

At the top of the service page, you'll see:

```
https://homigo-backend.onrender.com
```

This is your backend URL!

**What you'll see**: URL with copy button next to it

---

## Step 11: Test Your Deployment

### Test 1: Health Check

Open in browser:
```
https://homigo-backend.onrender.com/health
```

Should see:
```json
{
  "success": true,
  "message": "Homigo API is running",
  "timestamp": "2025-11-29T..."
}
```

### Test 2: Root Endpoint

Open in browser:
```
https://homigo-backend.onrender.com/
```

Should see API information

### Test 3: Using curl

```bash
curl https://homigo-backend.onrender.com/health
```

**What you'll see**: JSON responses in browser or terminal

---

## Step 12: Connect Frontend

### In Your Frontend Project (Vercel/Netlify):

1. Go to project settings
2. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://homigo-backend.onrender.com`
3. Redeploy frontend

### Update Frontend Code:

Make sure your API calls use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

**What you'll see**: Environment variables section in frontend hosting

---

## Troubleshooting Visual Guide

### If You See: "No open ports detected"

**Check**:
1. Go to Settings tab
2. Look at "Root Directory"
3. Should say: `backend`
4. If wrong, click Edit → Change to `backend` → Save

### If You See: "Build failed"

**Check**:
1. Go to Logs tab
2. Look for error message
3. Common: "Cannot find package.json"
4. Fix: Make sure Root Directory is `backend`

### If You See: "Module not found"

**Check**:
1. Make sure all files are pushed to GitHub
2. Check import paths in code
3. Redeploy: Manual Deploy → Deploy latest commit

---

## Dashboard Navigation

### Tabs You'll Use:

**Logs**:
- Real-time logs
- Search logs
- Download logs

**Metrics**:
- CPU usage
- Memory usage
- Request count

**Settings**:
- Environment variables
- Instance type
- Auto-deploy settings

**Events**:
- Deployment history
- Status changes

---

## Success Checklist

After deployment, verify:

- [ ] Green "Live" badge at top
- [ ] Logs show "Server successfully bound"
- [ ] Logs show "Database connected"
- [ ] Health endpoint returns 200
- [ ] No error messages in logs
- [ ] Can access backend URL in browser

---

## Common Screen Locations

### Where to Find Things:

**Service URL**: Top of service page, below service name

**Logs**: Click "Logs" tab on left sidebar

**Environment Variables**: Settings tab → Environment section

**Manual Deploy**: Top right, "Manual Deploy" button

**Metrics**: Click "Metrics" tab on left sidebar

---

## What Each Status Means

### 🟢 Live
- Service is running
- Accepting requests
- Everything working

### 🟡 Building
- Deployment in progress
- Installing dependencies
- Starting server

### 🔴 Failed
- Deployment failed
- Check logs for errors
- Fix and redeploy

### ⚪ Suspended
- Free tier spun down
- Will wake on first request
- Takes 30-60 seconds

---

## Quick Actions

### Redeploy
1. Click "Manual Deploy" (top right)
2. Select "Deploy latest commit"
3. Wait for deployment

### View Logs
1. Click "Logs" tab
2. Logs stream in real-time
3. Use search to find specific messages

### Update Environment Variable
1. Go to Settings tab
2. Find Environment Variables section
3. Click Edit on variable
4. Update value
5. Click Save
6. Service will restart automatically

---

## Mobile View

Render dashboard works on mobile:
- All features available
- Logs are readable
- Can deploy from phone
- Can update environment variables

---

## Browser Recommendations

Works best on:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

---

## Final Visual Check

Your service page should show:

```
┌─────────────────────────────────────┐
│ 🟢 homigo-backend          Live     │
├─────────────────────────────────────┤
│ https://homigo-backend.onrender.com │
├─────────────────────────────────────┤
│ Logs | Metrics | Settings | Events  │
├─────────────────────────────────────┤
│ [Deployment logs streaming here]    │
│ ✅ Server successfully bound...     │
│ ✅ Database connected...            │
└─────────────────────────────────────┘
```

---

**Congratulations! Your backend is deployed! 🎉**

**Next**: Deploy frontend and connect them together!
