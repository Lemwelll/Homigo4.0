-- Check if reservations exist in database
-- Run this in Supabase SQL Editor

-- 1. Check if reservations table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'reservations'
) as table_exists;

-- 2. Count total reservations
SELECT COUNT(*) as total_reservations FROM reservations;

-- 3. Show all reservations with details
SELECT 
    r.id,
    r.student_id,
    r.property_id,
    r.status,
    r.created_at,
    u.full_name as student_name,
    u.email as student_email,
    p.title as property_title
FROM reservations r
LEFT JOIN users u ON r.student_id = u.id
LEFT JOIN properties p ON r.property_id = p.id
ORDER BY r.created_at DESC
LIMIT 10;

-- 4. Check for your specific student (replace with your email)
SELECT 
    r.*,
    p.title as property_title
FROM reservations r
LEFT JOIN properties p ON r.property_id = p.id
WHERE r.student_id = (
    SELECT id FROM users WHERE email = 'student@email.com' -- CHANGE THIS
)
ORDER BY r.created_at DESC;

-- 5. Check reservation statuses
SELECT status, COUNT(*) as count
FROM reservations
GROUP BY status;
