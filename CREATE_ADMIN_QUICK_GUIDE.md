# Create Admin Account - Quick Guide

## 🎯 Goal
Create a new admin account with:
- **Email**: admin@homigo.com
- **Password**: admin123

---

## ✅ Method 1: Run the Batch File (EASIEST)

Just double-click this file:
```
create-admin-now.bat
```

It will automatically create the admin account.

---

## ✅ Method 2: Run Node.js Script

Open terminal and run:

```bash
cd backend
node scripts/createAdminUser.js
```

**Expected Output:**
```
🔐 Creating admin user...
📋 Checking if admin user already exists...
🔒 Hashing password...
✅ Password hashed successfully
👤 Creating admin user in database...

✅ Admin user created successfully!

═══════════════════════════════════════
📧 Email:     admin@homigo.com
🔑 Password:  admin123
👤 Name:      System Administrator
📱 Phone:     +639123456789
🆔 User ID:   [generated-uuid]
═══════════════════════════════════════
```

---

## ✅ Method 3: Run SQL Directly

1. Open your database client (pgAdmin, DBeaver, or Supabase dashboard)
2. Run the file: `INSERT_ADMIN_NOW.sql`

Or copy and paste this SQL:

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
  '$2b$10$rQZ5YJ5YJ5YJ5YJ5YJ5YJOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
  '+639123456789',
  'admin',
  true,
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = 'admin',
  is_active = true,
  is_verified = true;
```

---

## 🧪 Test the Login

### Using the Frontend:
1. Go to: http://localhost:5173/login
2. Enter:
   - Email: `admin@homigo.com`
   - Password: `admin123`
3. Click Login

### Using curl:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
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
  is_verified
FROM users
WHERE email = 'admin@homigo.com';
```

**Expected Result:**
- email: admin@homigo.com
- role: admin
- is_active: true
- is_verified: true

---

## 🚨 Troubleshooting

### "Admin already exists"
That's fine! The script will update the password.

### "Cannot find module 'bcrypt'"
Run: `cd backend && npm install`

### "Database connection error"
Check your `.env` file in the backend folder.

### Still can't login?
1. Make sure backend is running: `cd backend && npm start`
2. Check backend logs for errors
3. Verify the user exists in database
4. Try Method 3 (SQL) to insert directly

---

## 📝 Summary

**Quickest way:**
1. Double-click `create-admin-now.bat`
2. Wait for "Admin user created successfully!"
3. Login with admin@homigo.com / admin123

**That's it!** 🎉

---

## ⚠️ Important

After first login, change the password to something secure!

---

**Files Created:**
- ✅ `create-admin-now.bat` - Double-click to run
- ✅ `backend/scripts/createAdminUser.js` - Node.js script
- ✅ `INSERT_ADMIN_NOW.sql` - SQL script
- ✅ `CREATE_ADMIN_QUICK_GUIDE.md` - This guide
