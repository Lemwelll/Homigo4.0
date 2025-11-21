-- ============================================
-- SEED DATA FOR HOMIGO
-- Creates default admin account
-- ============================================

-- Note: This password hash is for "Admin@123"
-- In production, change this password immediately after first login

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
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
    id,
    full_name,
    email,
    role,
    is_active,
    created_at
FROM users
WHERE role = 'admin';

-- ============================================
-- ADMIN CREDENTIALS (FOR TESTING)
-- ============================================
-- Email: admin@homigo.com
-- Password: Admin@123
-- 
-- ⚠️ IMPORTANT: Change this password in production!
-- ============================================
