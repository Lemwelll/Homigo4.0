-- ============================================
-- CREATE SIMPLE ADMIN ACCOUNT
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Delete old admin if exists
DELETE FROM users WHERE email = 'admin@homigo.com';

-- Step 2: Create new admin
-- Email: admin@homigo.com
-- Password: admin123
INSERT INTO users (
    full_name,
    email,
    password_hash,
    phone,
    role,
    is_active,
    is_verified
) VALUES (
    'Admin User',
    'admin@homigo.com',
    '$2b$10$bkydfJsZKnxcxwuUMPan/.lQxhMDkR/v1NhPvdffPJSOgHwyTC8Ie',
    '09123456789',
    'admin',
    true,
    true
);

-- Step 3: Verify admin was created
SELECT 
    id,
    full_name,
    email,
    role,
    is_active,
    is_verified
FROM users
WHERE email = 'admin@homigo.com';

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- Email:    admin@homigo.com
-- Password: admin123
-- URL:      http://localhost:5173/login
-- Select:   Admin (as user type)
-- ============================================
