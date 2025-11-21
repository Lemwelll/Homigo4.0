-- ============================================
-- CREATE NEW ADMIN ACCOUNT
-- Run this in Supabase SQL Editor
-- ============================================

-- Delete any existing admin accounts (optional - remove if you want to keep old ones)
DELETE FROM users WHERE email = 'admin@homigo.com';

-- Create new admin account
-- Password: Admin@123
-- This is the bcrypt hash for "Admin@123"
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
    '$2b$10$LM0VRHzkDYT6QEdoNaJKf.7zu6B1mbQ6Wq6zNetoXux21Gg190l3a',
    '+639123456789',
    'admin',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

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

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
-- Email:    admin@homigo.com
-- Password: Admin@123
-- URL:      http://localhost:5173/login
-- ============================================
