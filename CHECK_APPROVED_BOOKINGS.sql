-- ========================================
-- Check Approved Bookings and Property Availability
-- ========================================

-- 1. Check all bookings with their status
SELECT 
    b.id,
    b.status,
    b.created_at,
    p.title as property_title,
    p.id as property_id,
    s.full_name as student_name,
    l.full_name as landlord_name
FROM bookings b
JOIN properties p ON b.property_id = p.id
JOIN users s ON b.student_id = s.id
JOIN users l ON b.landlord_id = l.id
ORDER BY b.created_at DESC;

-- 2. Check properties with approved bookings (should be unavailable)
SELECT 
    p.id,
    p.title,
    p.location,
    p.rent_price,
    b.status as booking_status,
    b.created_at as booking_date
FROM properties p
JOIN bookings b ON p.id = b.property_id
WHERE b.status IN ('approved', 'active', 'completed')
ORDER BY b.created_at DESC;

-- 3. Check escrow status for properties
SELECT 
    p.id,
    p.title,
    e.status as escrow_status,
    e.amount,
    e.created_at
FROM properties p
LEFT JOIN escrow_payments e ON p.id = e.property_id
WHERE e.status = 'released'
ORDER BY e.created_at DESC;

-- 4. Check escrow transactions
SELECT 
    p.id,
    p.title,
    et.status as escrow_status,
    et.amount,
    et.created_at
FROM properties p
LEFT JOIN escrow_transactions et ON p.id = et.property_id
WHERE et.status = 'released'
ORDER BY et.created_at DESC;

-- 5. Summary: Available vs Unavailable Properties
SELECT 
    'Total Properties' as category,
    COUNT(*) as count
FROM properties
WHERE verification_status = 'verified'

UNION ALL

SELECT 
    'Properties with Approved Bookings' as category,
    COUNT(DISTINCT p.id) as count
FROM properties p
JOIN bookings b ON p.id = b.property_id
WHERE b.status IN ('approved', 'active', 'completed')
AND p.verification_status = 'verified'

UNION ALL

SELECT 
    'Properties with Released Escrow' as category,
    COUNT(DISTINCT p.id) as count
FROM properties p
LEFT JOIN escrow_payments e ON p.id = e.property_id
WHERE e.status = 'released'
AND p.verification_status = 'verified'

UNION ALL

SELECT 
    'Available Properties' as category,
    COUNT(DISTINCT p.id) as count
FROM properties p
WHERE p.verification_status = 'verified'
AND p.id NOT IN (
    SELECT DISTINCT property_id 
    FROM bookings 
    WHERE status IN ('approved', 'active', 'completed')
)
AND p.id NOT IN (
    SELECT DISTINCT property_id 
    FROM escrow_payments 
    WHERE status = 'released'
);

-- 6. Detailed view of unavailable properties
SELECT 
    p.id,
    p.title,
    p.location,
    p.rent_price,
    CASE 
        WHEN b.status IN ('approved', 'active', 'completed') THEN 'Approved Booking'
        WHEN e.status = 'released' THEN 'Released Escrow'
        ELSE 'Unknown'
    END as unavailable_reason,
    COALESCE(b.status, 'N/A') as booking_status,
    COALESCE(e.status, 'N/A') as escrow_status
FROM properties p
LEFT JOIN bookings b ON p.id = b.property_id AND b.status IN ('approved', 'active', 'completed')
LEFT JOIN escrow_payments e ON p.id = e.property_id AND e.status = 'released'
WHERE p.verification_status = 'verified'
AND (b.id IS NOT NULL OR e.id IS NOT NULL)
ORDER BY p.title;
