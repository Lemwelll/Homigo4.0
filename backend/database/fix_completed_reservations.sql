-- Fix existing reservations that have corresponding bookings
-- Mark them as 'completed' so they don't show in My Reservations anymore

-- Update reservations that have a booking for the same property and student
UPDATE reservations r
SET status = 'completed'
FROM bookings b
WHERE r.property_id = b.property_id
  AND r.student_id = b.student_id
  AND r.status = 'accepted'
  AND b.status IN ('pending', 'approved');

-- Verify the update
SELECT 
  r.id as reservation_id,
  r.status as reservation_status,
  r.property_id,
  r.student_id,
  b.id as booking_id,
  b.status as booking_status,
  b.created_at as booking_created_at
FROM reservations r
LEFT JOIN bookings b ON r.property_id = b.property_id AND r.student_id = b.student_id
WHERE r.status = 'completed'
ORDER BY r.created_at DESC;
