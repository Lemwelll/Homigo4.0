-- Check if reservation notification was created
-- Run this in Supabase SQL Editor

-- 1. Check recent reservations
SELECT 
  r.id,
  r.created_at,
  r.student_id,
  r.landlord_id,
  s.full_name as student_name,
  l.full_name as landlord_name,
  p.title as property_title
FROM reservations r
JOIN users s ON r.student_id = s.id
JOIN users l ON r.landlord_id = l.id
JOIN properties p ON r.property_id = p.id
ORDER BY r.created_at DESC
LIMIT 3;

-- 2. Check if notification was created for that reservation
SELECT 
  n.*,
  u.full_name as receiver_name,
  u.role as receiver_role
FROM notifications n
JOIN users u ON n.receiver_id = u.id
WHERE n.type = 'reservation_created'
ORDER BY n.created_at DESC
LIMIT 5;

-- 3. Check all recent notifications
SELECT 
  n.id,
  n.type,
  n.title,
  n.message,
  n.created_at,
  u.full_name as receiver_name,
  u.role as receiver_role
FROM notifications n
JOIN users u ON n.receiver_id = u.id
ORDER BY n.created_at DESC
LIMIT 10;
