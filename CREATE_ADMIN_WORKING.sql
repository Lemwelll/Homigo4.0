-- ========================================
-- CREATE ADMIN ACCOUNT - WORKING VERSION
-- Email: admin@homigo.com
-- Password: admin123
-- ========================================

-- This SQL has a REAL bcrypt hash that will work!

-- Delete existing admin if exists (optional)
-- DELETE FROM users WHERE email = 'admin@homigo.com';

-- Insert admin with proper password hash
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
  '$2b$10$SzHikHnDeeIrEaKYgH22vu1cLsvDYqP4S0GLxHUZxVNKBY7OBUETy',
  '+639123456789',
  'admin',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2b$10$SzHikHnDeeIrEaKYgH22vu1cLsvDYqP4S0GLxHUZxVNKBY7OBUETy',
  role = 'admin',
  is_active = true,
  is_verified = true,
  updated_at = NOW();

-- Verify the admin was created
SELECT 
  id,
  full_name,
  email,
  role,
  is_active,
  is_verified,
  LENGTH(password_hash) as hash_length,
  created_at
FROM users
WHERE email = 'admin@homigo.com';

-- ========================================
-- RESULT
-- ========================================
-- You should see:
-- - email: admin@homigo.com
-- - role: admin
-- - is_active: true
-- - is_verified: true
-- - hash_length: 60
--
-- Now you can login with:
-- Email: admin@homigo.com
-- Password: admin123
-- ========================================
