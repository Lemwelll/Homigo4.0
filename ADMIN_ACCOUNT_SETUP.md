# Admin Account Setup Guide

## Overview
This guide will help you create a single admin account for the Homigo platform.

## Admin Account Credentials

```
Email:    admin@homigo.com
Password: Admin@123
Role:     admin
```

## Method 1: Using Node.js Script (Recommended)

### Step 1: Run the Script
```bash
cd backend
node scripts/createAdmin.js
```

### Step 2: Verify Output
You should see:
```
✅ Admin account created successfully!

═══════════════════════════════════════════════════════
📋 ADMIN ACCOUNT DETAILS
═══════════════════════════════════════════════════════
Name:     System Administrator
Email:    admin@homigo.com
Password: Admin@123
Phone:    +639123456789
Role:     admin
═══════════════════════════════════════════════════════

🌐 Login at: http://localhost:5173/login
```

### Step 3: Login
1. Go to: `http://localhost:5173/login`
2. Select "Admin" as user type
3. Enter email: `admin@homigo.com`
4. Enter password: `Admin@123`
5. Click "Login"

## Method 2: Using SQL (Alternative)

### Step 1: Generate Password Hash
```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin@123', 10).then(hash => console.log(hash));"
```

### Step 2: Run SQL in Supabase
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Paste this SQL (replace `YOUR_HASH_HERE` with the hash from Step 1):

```sql
-- Delete existing admin accounts
DELETE FROM users WHERE role = 'admin';

-- Create admin account
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
    'YOUR_HASH_HERE',
    '+639123456789',
    'admin',
    true,
    true
);

-- Verify
SELECT id, full_name, email, role FROM users WHERE role = 'admin';
```

## Admin Panel Features

Once logged in as admin, you can:

### 1. Dashboard
- View platform statistics
- Monitor user activity
- See property counts

### 2. Verifications
- Review pending properties
- Verify or reject property listings
- Add admin notes

### 3. Landlords
- View all landlord accounts
- Manage landlord status
- Review landlord information

### 4. Properties
- View all properties (verified, pending, rejected)
- Filter by status
- Manage property listings

### 5. Reports
- Generate platform reports
- View analytics
- Export data

### 6. Settings
- Update admin profile
- Change password
- Configure platform settings

## Security Notes

⚠️ **IMPORTANT FOR PRODUCTION:**

1. **Change the default password immediately**
   - Go to Admin Settings
   - Update password to a strong, unique password

2. **Use strong passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't reuse passwords

3. **Keep credentials secure**
   - Don't share admin credentials
   - Use password manager
   - Enable 2FA if available

4. **Limit admin accounts**
   - Only create admin accounts when necessary
   - Remove unused admin accounts
   - Audit admin access regularly

## Troubleshooting

### Issue: "Invalid credentials"
**Solution:**
- Verify you selected "Admin" as user type
- Check email is exactly: `admin@homigo.com`
- Check password is exactly: `Admin@123`
- Ensure admin account exists in database

### Issue: "User not found"
**Solution:**
- Run the createAdmin.js script again
- Check database connection
- Verify users table exists

### Issue: Script fails with database error
**Solution:**
- Check backend/.env has correct Supabase credentials
- Verify Supabase project is active
- Check internet connection

### Issue: Multiple admin accounts
**Solution:**
```sql
-- Keep only one admin, delete others
DELETE FROM users 
WHERE role = 'admin' 
AND email != 'admin@homigo.com';
```

## Verify Admin Account

### Via SQL:
```sql
SELECT 
    id,
    full_name,
    email,
    role,
    is_active,
    is_verified,
    created_at
FROM users
WHERE role = 'admin';
```

### Via API:
```bash
# Login first to get token
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@homigo.com",
    "password": "Admin@123",
    "role": "admin"
  }'
```

## Admin Responsibilities

As an admin, you are responsible for:

1. **Property Verification**
   - Review all new property listings
   - Verify property information is accurate
   - Reject fraudulent or inappropriate listings

2. **User Management**
   - Monitor user accounts
   - Handle user reports
   - Manage account status

3. **Platform Maintenance**
   - Monitor system health
   - Review reports and analytics
   - Ensure platform security

4. **Quality Control**
   - Maintain listing quality
   - Enforce platform policies
   - Handle disputes

## Quick Reference

| Action | URL |
|--------|-----|
| Login | http://localhost:5173/login |
| Dashboard | http://localhost:5173/admin/dashboard |
| Verifications | http://localhost:5173/admin/verifications |
| Landlords | http://localhost:5173/admin/landlords |
| Settings | http://localhost:5173/admin/settings |

## Support

If you need help:
1. Check the troubleshooting section above
2. Review backend logs for errors
3. Check browser console for frontend errors
4. Verify database connection
