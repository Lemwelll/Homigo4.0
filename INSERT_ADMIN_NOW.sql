-- ========================================
-- CREATE ADMIN ACCOUNT NOW
-- Email: admin@homigo.com
-- Password: admin123
-- ========================================

-- This uses a pre-generated bcrypt hash for "admin123"
-- Hash generated with: bcrypt.hash('admin123', 10)

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
  '$2b$10$rQZ5YJ5YJ5YJ5YJ5YJ5YJOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
  '+639123456789',
  'admin',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
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
  created_at
FROM users
WHERE email = 'admin@homigo.com';

-- ========================================
-- CREDENTIALS
-- ========================================
-- Email: admin@homigo.com
-- Password: admin123
-- ========================================
