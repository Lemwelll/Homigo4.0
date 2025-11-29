# Create Admin Account - FINAL SOLUTION

## 🎯 Problem
Getting "401 Unauthorized" or "Invalid email or password" when trying to login as admin.

## ✅ Solution - Pick ONE Method

---

### Method 1: Run the Batch File (EASIEST) ⭐

**Just double-click this file:**
```
RUN_THIS_CREATE_ADMIN.bat
```

**What it does:**
- Generates a proper password hash
- Creates or updates the admin account
- Shows you the credentials

**Expected output:**
```
✅ ADMIN ACCOUNT READY
═══════════════════════════════════════
📧 Email:       admin@homigo.com
🔑 Password:    admin123
👤 Role:        admin
✓  Active:      true
✓  Verified:    true
═══════════════════════════════════════
```

---

### Method 2: Run SQL Directly (FASTEST)

**Copy and paste this into your database:**

```sql
INSERT INTO users (
  full_name,
  email,
  password_hash,
  phone,
  role,
  is_active,
  is_verified
) VALUES (
  'System Administrator',
  'admin@homigo.com',
  '$2b$10$SzHikHnDeeIrEaKYgH22vu1cLsvDYqP4S0GLxHUZxVNKBY7OBUETy',
  '+639123456789',
  'admin',
  true,
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2b$10$SzHikHnDeeIrEaKYgH22vu1cLsvDYqP4S0GLxHUZxVNKBY7OBUETy',
  role = 'admin',
  is_active = true,
  is_verified = true;
```

**Or run the file:**
```
CREATE_ADMIN_WORKING.sql
```

---

### Method 3: Command Line

```bash
cd backend
node scripts/createAdminNow.js
```

---

## 🧪 Test the Login

### Option A: Use the Frontend
1. Go to: http://localhost:5173/login
2. Enter:
   - Email: `admin@homigo.com`
   - Password: `admin123`
3. Click Login
4. Should redirect to admin dashboard

### Option B: Use curl
```bash
curl -X POST http://localhost:5000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@homigo.com\",\"password\":\"admin123\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@homigo.com",
    "role": "admin",
    "name": "System Administrator"
  }
}
```

---

## ✅ Verify Admin Exists

Run this SQL to check:

```sql
SELECT 
  id,
  full_name,
  email,
  role,
  is_active,
  is_verified,
  LENGTH(password_hash) as hash_length
FROM users
WHERE email = 'admin@homigo.com';
```

**Expected Results:**
- ✅ email: admin@homigo.com
- ✅ role: admin
- ✅ is_active: true
- ✅ is_verified: true
- ✅ hash_length: 60

---

## 🚨 Still Not Working?

### Check 1: Is the backend running?
```bash
cd backend
npm start
```

Should see: `Server running on port 5000`

### Check 2: Is the database connected?
Check `backend/.env` file has:
```
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

### Check 3: Does the user exist?
Run the SQL query above to verify.

### Check 4: Is the password hash correct?
The hash should be exactly 60 characters and start with `$2b$10$`

### Check 5: Backend logs
Look at the backend console for error messages when you try to login.

---

## 📝 Summary

**Quickest Solution:**
1. Run `CREATE_ADMIN_WORKING.sql` in your database
2. Login with admin@homigo.com / admin123
3. Done! ✅

**Most Reliable:**
1. Double-click `RUN_THIS_CREATE_ADMIN.bat`
2. Wait for success message
3. Login with admin@homigo.com / admin123
4. Done! ✅

---

## 🔐 Admin Credentials

```
Email:    admin@homigo.com
Password: admin123
```

**⚠️ IMPORTANT:** Change this password after first login!

---

## 📂 Files Created

- ✅ `RUN_THIS_CREATE_ADMIN.bat` - Batch file to create admin
- ✅ `CREATE_ADMIN_WORKING.sql` - SQL with real password hash
- ✅ `backend/scripts/createAdminNow.js` - Node.js script
- ✅ `ADMIN_SETUP_FINAL.md` - This guide

---

**Status:** Ready to use  
**Password Hash:** Pre-generated and working  
**Time to setup:** 1 minute
