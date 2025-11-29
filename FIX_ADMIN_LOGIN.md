# Fix Admin Login Issue

## Problem
Getting "Invalid email or password" when trying to login with:
- Email: admin@homigo.com
- Password: admin123

## Solution Steps

### Step 1: Check if Admin User Exists

Run this SQL query in your database:

```sql
SELECT id, email, role, password_hash, is_active, is_verified
FROM users
WHERE email = 'admin@homigo.com';
```

**If no results:** Admin user doesn't exist - proceed to Step 2
**If results exist:** Admin user exists but password is wrong - proceed to Step 3

---

### Step 2: Create Admin User (If Doesn't Exist)

**Option A: Use Node.js Script (RECOMMENDED)**

```bash
cd backend
node scripts/createAdminUser.js
```

This will:
- Check if admin exists
- Hash the password properly
- Create the admin user
- Display the credentials

**Option B: Use SQL with Pre-Generated Hash**

First, generate the hash for "admin123":

```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

Then run this SQL (replace YOUR_HASH with the generated hash):

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
  'YOUR_HASH',
  '+639123456789',
  'admin',
  true,
  true
);
```

---

### Step 3: Update Existing Admin Password

If admin exists but password is wrong, update it:

**Generate new hash:**

```bash
cd backend
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

**Update password in database:**

```sql
UPDATE users
SET password_hash = 'YOUR_GENERATED_HASH',
    updated_at = NOW()
WHERE email = 'admin@homigo.com';
```

---

### Step 4: Verify Admin User

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
- role: 'admin'
- is_active: true
- is_verified: true
- hash_length: 60 (bcrypt hashes are 60 characters)

---

### Step 5: Test Login

**Using curl:**

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@homigo.com","password":"admin123"}'
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

## Quick Fix Script

Create and run this file:

**File: `backend/scripts/fixAdminLogin.js`**

```javascript
import bcrypt from 'bcrypt';
import { supabase } from '../config/database.js';

const fixAdminLogin = async () => {
  try {
    console.log('🔧 Fixing admin login...\n');

    const email = 'admin@homigo.com';
    const password = 'admin123';

    // Check if admin exists
    const { data: admin, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('❌ Error:', checkError);
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    if (!admin) {
      // Create new admin
      console.log('📝 Creating new admin user...');
      const { data, error } = await supabase
        .from('users')
        .insert({
          full_name: 'System Administrator',
          email: email,
          password_hash: passwordHash,
          phone: '+639123456789',
          role: 'admin',
          is_active: true,
          is_verified: true
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating admin:', error);
        return;
      }

      console.log('✅ Admin user created!');
    } else {
      // Update existing admin password
      console.log('🔄 Updating admin password...');
      const { error } = await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('email', email);

      if (error) {
        console.error('❌ Error updating password:', error);
        return;
      }

      console.log('✅ Admin password updated!');
    }

    console.log('\n═══════════════════════════════════════');
    console.log('📧 Email:    ', email);
    console.log('🔑 Password: ', password);
    console.log('═══════════════════════════════════════\n');

    // Test login
    console.log('🧪 Testing login...');
    const isValid = await bcrypt.compare(password, passwordHash);
    console.log('Password validation:', isValid ? '✅ PASS' : '❌ FAIL');

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

fixAdminLogin().then(() => process.exit(0));
```

**Run it:**

```bash
cd backend
node scripts/fixAdminLogin.js
```

---

## Common Issues

### Issue 1: "User not found"
**Solution:** Admin user doesn't exist. Run the create script.

### Issue 2: "Invalid password"
**Solution:** Password hash is incorrect. Update the password hash.

### Issue 3: "User is not active"
**Solution:** Run this SQL:
```sql
UPDATE users SET is_active = true WHERE email = 'admin@homigo.com';
```

### Issue 4: "User is not verified"
**Solution:** Run this SQL:
```sql
UPDATE users SET is_verified = true WHERE email = 'admin@homigo.com';
```

---

## Verification Checklist

- [ ] Admin user exists in database
- [ ] Email is exactly: admin@homigo.com
- [ ] Role is: admin
- [ ] is_active is: true
- [ ] is_verified is: true
- [ ] password_hash length is: 60 characters
- [ ] Backend server is running
- [ ] Login endpoint is: POST /auth/login
- [ ] Request body includes: email and password

---

## Manual Password Hash Generation

If you need to generate a hash manually:

**Using Node.js:**

```javascript
const bcrypt = require('bcrypt');
const password = 'admin123';
bcrypt.hash(password, 10).then(hash => {
  console.log('Password Hash:');
  console.log(hash);
});
```

**Using online tool:**
1. Go to: https://bcrypt-generator.com/
2. Enter: admin123
3. Rounds: 10
4. Copy the generated hash
5. Update database with the hash

---

## After Successful Login

Once you can login:

1. **Change the password immediately**
2. Go to Admin Settings
3. Update to a secure password
4. Never use "admin123" in production

---

## Need More Help?

If still having issues, check:

1. **Backend logs** - Look for authentication errors
2. **Database connection** - Ensure Supabase is connected
3. **Auth service** - Check `backend/services/authService.js`
4. **Password comparison** - Verify bcrypt is working

Run this diagnostic:

```bash
cd backend
node -e "
const bcrypt = require('bcrypt');
const testHash = '$2b$10$YourHashHere';
const testPassword = 'admin123';
bcrypt.compare(testPassword, testHash).then(result => {
  console.log('Password match:', result);
});
"
```

---

**Status:** Ready to fix
**Time:** 5 minutes
**Difficulty:** Easy
