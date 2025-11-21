-- Check if admin account exists
SELECT 
    id,
    full_name,
    email,
    role,
    is_active,
    is_verified,
    created_at,
    -- Show first 20 chars of password hash to verify it exists
    LEFT(password_hash, 20) as password_hash_preview
FROM users
WHERE email = 'admin@homigo.com' OR role = 'admin';

-- If no results, admin doesn't exist
-- If results show, admin exists but password might be wrong
