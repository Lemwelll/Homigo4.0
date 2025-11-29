-- ============================================
-- CHECK BOOKINGS IN DATABASE
-- ============================================
-- Run this to see which properties are actually booked

-- STEP 1: Check all bookings
SELECT 
    b.id,
    b.property_id,
    b.status,
    b.payment_status,
    p.title as property_title,
    u.full_name as student_name,
    b.created_at
FROM bookings b
JOIN properties p ON b.property_id = p.id
JOIN users u ON b.student_id = u.id
ORDER BY b.created_at DESC;

-- STEP 2: Check ACTIVE bookings (these should show as unavailable)
SELECT 
    b.property_id,
    p.title as property_title,
    b.status,
    b.payment_status
FROM bookings b
JOIN properties p ON b.property_id = p.id
WHERE b.status IN ('active', 'completed')
ORDER BY b.created_at DESC;

-- STEP 3: Get the property IDs that should be unavailable
SELECT DISTINCT property_id
FROM bookings
WHERE status IN ('active', 'completed');

-- STEP 4: Check if these properties exist
SELECT 
    p.id,
    p.title,
    p.location,
    COUNT(b.id) as booking_count
FROM properties p
LEFT JOIN bookings b ON p.id = b.property_id AND b.status IN ('active', 'completed')
GROUP BY p.id, p.title, p.location
HAVING COUNT(b.id) > 0;
