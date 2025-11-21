# 📦 Installation Instructions

Step-by-step guide to set up the Homigo authentication backend.

---

## Prerequisites

- ✅ Node.js (v16 or higher)
- ✅ npm or yarn
- ✅ Supabase account
- ✅ Git (optional)

---

## Step 1: Navigate to Backend Folder

```bash
cd backend
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express (Web framework)
- bcrypt (Password hashing)
- jsonwebtoken (JWT authentication)
- @supabase/supabase-js (Database client)
- dotenv (Environment variables)
- cors (Cross-origin requests)
- express-validator (Input validation)
- nodemon (Development auto-reload)

**Expected output:**
```
added 150 packages in 15s
```

---

## Step 3: Configure Environment Variables

The `.env` file is already created with your Supabase credentials.

**Verify it contains:**

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://oohtlvtcogjszpigynay.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=homigo_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

⚠️ **For production**: Change `JWT_SECRET` to a strong random string!

---

## Step 4: Setup Database

### A. Access Supabase Dashboard

1. Go to: https://app.supabase.com
2. Login to your account
3. Select project: `oohtlvtcogjszpigynay`

### B. Open SQL Editor

1. Click **SQL Editor** in the left sidebar
2. Click **New Query**

### C. Run Database Schema

1. Open file: `backend/database/schema.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click **Run** or press `Ctrl+Enter`

**Expected output:**
```
Success. No rows returned
```

This creates:
- `users` table
- Indexes for performance
- Auto-update trigger

### D. Run Seed Data

1. Open file: `backend/database/seed.sql`
2. Copy all contents
3. Paste into SQL Editor
4. Click **Run**

**Expected output:**
```
1 row(s) returned
```

This creates the admin account:
- Email: `admin@homigo.com`
- Password: `Admin@123`

### E. Verify Database Setup

Run this query in SQL Editor:

```sql
SELECT id, full_name, email, role, created_at 
FROM users;
```

You should see the admin user.

---

## Step 5: Start the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

**Expected output:**

```
╔════════════════════════════════════════╗
║     HOMIGO BACKEND API SERVER         ║
╚════════════════════════════════════════╝

✅ Database connected successfully
🚀 Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000
🔗 Frontend URL: http://localhost:5173

Available endpoints:
  GET  /health          - Health check
  POST /auth/signup     - User registration
  POST /auth/login      - User login
```

---

## Step 6: Test the API

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

**Expected:**
```json
{
  "success": true,
  "message": "Homigo API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Register a User

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "phone": "+639123456789",
    "role": "student"
  }'
```

**Expected:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

### Test 3: Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Expected:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

---

## ✅ Installation Complete!

Your authentication backend is now running and ready to use.

---

## 🔧 Troubleshooting

### Issue: "Cannot find module"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Database connection failed"

**Solution:**
1. Check Supabase URL and keys in `.env`
2. Verify project is active on Supabase
3. Check internet connection
4. Run schema.sql again

### Issue: "Port 5000 already in use"

**Solution:**
Change port in `.env`:
```env
PORT=5001
```

Then restart server.

### Issue: "CORS error from frontend"

**Solution:**
Update `FRONTEND_URL` in `.env` to match your React app:
```env
FRONTEND_URL=http://localhost:5173
```

### Issue: "JWT_SECRET not defined"

**Solution:**
Make sure `.env` file exists and contains `JWT_SECRET`.

---

## 📚 Next Steps

1. **Read Documentation**: See `README.md` for full API docs
2. **Test All Endpoints**: See `API_EXAMPLES.md` for examples
3. **Integrate Frontend**: Update your React app to use these endpoints
4. **Add More Features**: Profile management, password reset, etc.

---

## 🎯 Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Test health endpoint
curl http://localhost:5000/health

# View logs (if using PM2)
pm2 logs homigo-backend
```

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Check `QUICK_START.md` for quick setup
- Check `API_EXAMPLES.md` for testing examples
- Review error messages in terminal

---

**Happy Coding! 🚀**
