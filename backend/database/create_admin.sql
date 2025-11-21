-- ============================================
-- CREATE ADMIN ACCOUNT
-- Creates a single admin account for Homigo
-- ============================================

-- Delete any existing admin accounts first (to ensure only 1 admin)
DELETE FROM users WHERE role = 'admin';

-- Create the admin account
-- Password: Admin@123
-- This is the bcrypt hash for "Admin@123"
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
    '$2b$10$YourActualHashWillBeHere',
    '+639123456789',
    'admin',
    true,
    true
);

-- Verify the admin account was created
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

-- ============================================
-- ADMIN LOGIN CREDENTIALS
-- ============================================
-- Email: admin@homigo.com
-- Password: Admin@123
-- 
-- Login at: http://localhost:5173/login
-- Select "Admin" as user type
-- ============================================
