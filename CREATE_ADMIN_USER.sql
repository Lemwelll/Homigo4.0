-- ============================================
-- CREATE ADMIN USER
-- Email: admin@homigo.com
-- Password: admin123
-- ============================================

-- RECOMMENDED: Use the Node.js script instead
-- Run: node backend/scripts/createAdminUser.js
-- 
-- This SQL file is for reference only.
-- The Node.js script will properly hash the password.

-- ============================================
-- MANUAL SQL METHOD (if you have the hash)
-- ============================================

-- Step 1: Generate password hash
-- Use Node.js to generate the hash:
-- 
-- const bcrypt = require('bcrypt');
-- bcrypt.hash('admin123', 10).then(hash => console.log(hash));
-- 
-- Or use an online bcrypt generator with 10 rounds

-- Step 2: Insert admin user with the generated hash
-- Replace 'YOUR_BCRYPT_HASH_HERE' with the actual hash

DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  -- Check if admin already exists
  SELECT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@homigo.com'
  ) INTO admin_exists;

  IF admin_exists THEN
    RAISE NOTICE '⚠️  Admin user already exists with email: admin@homigo.com';
  ELSE
    -- Insert the admin user
    INSERT INTO users (
      full_name,
      email,
      password_hash,
      phone,
      role,
      is_active,
      is_verified,
      created_at,
      updated_at
    ) VALUES (
      'System Administrator',
      'admin@homigo.com',
      'YOUR_BCRYPT_HASH_HERE',  -- Replace with actual bcrypt hash
      '+639123456789',
      'admin',
      true,
      true,
      NOW(),
      NOW()
    );
    
    RAISE NOTICE '✅ Admin user created successfully!';
    RAISE NOTICE '📧 Email: admin@homigo.com';
    RAISE NOTICE '🔑 Password: admin123';
    RAISE NOTICE '⚠️  IMPORTANT: Change this password after first login!';
  END IF;
END $$;

-- ============================================
-- VERIFY ADMIN USER
-- ============================================

SELECT 
  id,
  full_name,
  email,
  role,
  is_active,
  is_verified,
  created_at
FROM users
WHERE email = 'admin@homigo.com';

-- ============================================
-- NOTES
-- ============================================
-- 
-- RECOMMENDED METHOD:
-- Use the Node.js script for automatic password hashing:
-- 
--   cd backend
--   node scripts/createAdminUser.js
-- 
-- This will:
-- 1. Check if admin already exists
-- 2. Hash the password properly
-- 3. Create the admin user
-- 4. Display the credentials
-- 
-- MANUAL METHOD:
-- If you prefer SQL, you must:
-- 1. Generate a bcrypt hash for "admin123"
-- 2. Replace 'YOUR_BCRYPT_HASH_HERE' above
-- 3. Run this SQL file
-- 
-- ============================================
