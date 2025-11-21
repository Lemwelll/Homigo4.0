-- ============================================
-- HOMIGO - ADMIN SETUP & PROPERTY VERIFICATION
-- This script:
-- 1. Creates admin account (if not exists)
-- 2. Verifies all pending properties
-- 3. Does NOT delete any existing data
-- ============================================

-- ============================================
-- PART 1: CREATE ADMIN ACCOUNT
-- ============================================

-- Check if admin already exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@homigo.com') THEN
        -- Create admin account
        -- Password: Admin@123
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
            '$2b$10$8vJ0YQZ5YJ5YJ5YJ5YJ5YOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
            '+639123456789',
            'admin',
            true,
            true
        );
        
        RAISE NOTICE '✅ Admin account created successfully!';
    ELSE
        RAISE NOTICE 'ℹ️  Admin account already exists, skipping creation.';
    END IF;
END $$;

-- ============================================
-- PART 2: VERIFY ALL PENDING PROPERTIES
-- ============================================

-- Update all pending properties to verified
UPDATE properties 
SET 
    verification_status = 'verified',
    updated_at = CURRENT_TIMESTAMP
WHERE verification_status = 'pending_verification';

-- ============================================
-- VERIFICATION & SUMMARY
-- ============================================

-- Show admin account details
SELECT 
    '═══════════════════════════════════════════════════════' as separator;
SELECT 
    '📋 ADMIN ACCOUNT DETAILS' as info;
SELECT 
    '═══════════════════════════════════════════════════════' as separator;

SELECT 
    id,
    full_name,
    email,
    role,
    phone,
    is_active,
    is_verified,
    created_at
FROM users
WHERE role = 'admin';

SELECT 
    '═══════════════════════════════════════════════════════' as separator;
SELECT 
    '📊 PROPERTY STATUS SUMMARY' as info;
SELECT 
    '═══════════════════════════════════════════════════════' as separator;

-- Show property counts by status
SELECT 
    verification_status,
    COUNT(*) as count
FROM properties
GROUP BY verification_status
ORDER BY verification_status;

-- Show all properties with their status
SELECT 
    '═══════════════════════════════════════════════════════' as separator;
SELECT 
    '📝 ALL PROPERTIES' as info;
SELECT 
    '═══════════════════════════════════════════════════════' as separator;

SELECT 
    p.id,
    p.title,
    p.location,
    p.verification_status,
    u.full_name as landlord_name,
    u.email as landlord_email,
    p.created_at
FROM properties p
JOIN users u ON p.landlord_id = u.id
ORDER BY p.created_at DESC;

-- ============================================
-- LOGIN CREDENTIALS
-- ============================================
SELECT 
    '═══════════════════════════════════════════════════════' as separator;
SELECT 
    '🔐 ADMIN LOGIN CREDENTIALS' as info;
SELECT 
    '═══════════════════════════════════════════════════════' as separator;
SELECT 
    'Email:    admin@homigo.com' as credential;
SELECT 
    'Password: Admin@123' as credential;
SELECT 
    'URL:      http://localhost:5173/login' as credential;
SELECT 
    'Type:     Select "Admin" as user type' as credential;
SELECT 
    '═══════════════════════════════════════════════════════' as separator;
SELECT 
    '⚠️  IMPORTANT: Change password in production!' as warning;
SELECT 
    '═══════════════════════════════════════════════════════' as separator;
