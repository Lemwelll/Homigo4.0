# 🚀 Quick Start Guide - Homigo Backend

Get the authentication API running in 5 minutes!

---

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

---

## Step 2: Setup Database

### A. Go to Supabase SQL Editor

1. Visit: https://app.supabase.com
2. Select project: `oohtlvtcogjszpigynay`
3. Click **SQL Editor**

### B. Run Schema

Copy and paste from `database/schema.sql` → Click **Run**

### C. Run Seed Data

Copy and paste from `database/seed.sql` → Click **Run**

---

## Step 3: Configure Environment

The `.env` file is already created with your Supabase credentials.

**Just verify it has:**
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ JWT_SECRET

---

## Step 4: Start Server

```bash
npm run dev
```

**You should see:**

```
╔════════════════════════════════════════╗
║     HOMIGO BACKEND API SERVER         ║
╚════════════════════════════════════════╝

✅ Database connected successfully
🚀 Server running on port 5000
```

---

## Step 5: Test the API

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

**Expected:**
```json
{
  "success": true,
  "message": "Homigo API is running"
}
```

### Test 2: Register a Student

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Maria Santos",
    "email": "maria@student.com",
    "password": "Student123",
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
    "email": "maria@student.com",
    "password": "Student123"
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

## ✅ You're Done!

Your authentication API is now running and ready to integrate with the React frontend.

---

## 🔗 Next Steps

1. **Connect Frontend**: Update React app to call these endpoints
2. **Test All Roles**: Try registering as landlord
3. **Test Admin Login**: Use `admin@homigo.com` / `Admin@123`
4. **Add More Features**: Profile management, password reset, etc.

---

## 🐛 Troubleshooting

### Database Connection Failed

- Check Supabase URL and keys in `.env`
- Verify project is active on Supabase dashboard
- Run schema.sql again

### Port Already in Use

Change port in `.env`:
```env
PORT=5001
```

### CORS Errors

Update `FRONTEND_URL` in `.env` to match your React app:
```env
FRONTEND_URL=http://localhost:5173
```

---

## 📚 Full Documentation

See `README.md` for complete API documentation and security details.
