-- ============================================
-- PROPERTY AVAILABILITY TESTING SCRIPT
-- Use this to test and verify property availability logic
-- ============================================

-- ============================================
-- 1. CHECK CURRENT PROPERTY AVAILABILITY
-- ============================================

-- View all properties with their availability status
SELECT 
  p.id,
  p.title,
  p.location,
  p.rent_price,
  p.verification_status,
  -- Check if property has approved bookings
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.property_id = p.id 
      AND b.status IN ('approved', 'active', 'completed')
    ) THEN 'YES'
    ELSE 'NO'
  END as has_approved_booking,
  -- Check if property has released escrow (transactions table)
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM escrow_transactions e 
      WHERE e.property_id = p.id 
      AND e.status = 'released'
    ) THEN 'YES'
    ELSE 'NO'
  END as has_released_escrow_trans,
  -- Check if property has released escrow (payments table)
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM escrow_payments e 
      WHERE e.property_id = p.id 
      AND e.status = 'released'
    ) THEN 'YES'
    ELSE 'NO'
  END as has_released_escrow_pay,
  -- Final availability status
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.property_id = p.id 
      AND b.status IN ('approved', 'active', 'completed')
    ) OR EXISTS (
      SELECT 1 FROM escrow_transactions e 
      WHERE e.property_id = p.id 
      AND e.status = 'released'
    ) OR EXISTS (
      SELECT 1 FROM escrow_payments e 
      WHERE e.property_id = p.id 
      AND e.status = 'released'
    ) THEN 'UNAVAILABLE'
    ELSE 'AVAILABLE'
  END as availability_status
FROM properties p
WHERE p.verification_status = 'verified'
ORDER BY p.created_at DESC;

-- ============================================
-- 2. CHECK SPECIFIC PROPERTY DETAILS
-- ============================================

-- Replace 'YOUR_PROPERTY_ID' with actual property ID
DO $$
DECLARE
  prop_id UUID := 'YOUR_PROPERTY_ID'; -- Change this
BEGIN
  RAISE NOTICE '=== PROPERTY AVAILABILITY CHECK ===';
  
  -- Property info
  RAISE NOTICE 'Property: %', (SELECT title FROM properties WHERE id = prop_id);
  
  -- Bookings
  RAISE NOTICE 'Bookings:';
  PERFORM * FROM bookings WHERE property_id = prop_id;
  IF NOT FOUND THEN
    RAISE NOTICE '  No bookings found';
  ELSE
    RAISE NOTICE '  % bookings found', (SELECT COUNT(*) FROM bookings WHERE property_id = prop_id);
  END IF;
  
  -- Approved bookings
  RAISE NOTICE 'Approved Bookings:';
  PERFORM * FROM bookings WHERE property_id = prop_id AND status IN ('approved', 'active', 'completed');
  IF NOT FOUND THEN
    RAISE NOTICE '  No approved bookings';
  ELSE
    RAISE NOTICE '  % approved bookings', (SELECT COUNT(*) FROM bookings WHERE property_id = prop_id AND status IN ('approved', 'active', 'completed'));
  END IF;
  
  -- Escrow transactions
  RAISE NOTICE 'Escrow Transactions:';
  PERFORM * FROM escrow_transactions WHERE property_id = prop_id;
  IF NOT FOUND THEN
    RAISE NOTICE '  No escrow transactions';
  ELSE
    RAISE NOTICE '  % escrow transactions', (SELECT COUNT(*) FROM escrow_transactions WHERE property_id = prop_id);
  END IF;
  
  -- Released escrow
  RAISE NOTICE 'Released Escrow:';
  PERFORM * FROM escrow_transactions WHERE property_id = prop_id AND status = 'released';
  IF NOT FOUND THEN
    RAISE NOTICE '  No released escrow';
  ELSE
    RAISE NOTICE '  % released escrow', (SELECT COUNT(*) FROM escrow_transactions WHERE property_id = prop_id AND status = 'released');
  END IF;
END $$;

-- Detailed view for specific property
SELECT 
  'PROPERTY' as type,
  p.id,
  p.title,
  p.rent_price,
  p.verification_status
FROM properties p
WHERE p.id = 'YOUR_PROPERTY_ID'

UNION ALL

SELECT 
  'BOOKING' as type,
  b.id,
  b.status,
  b.amount_paid::TEXT,
  b.created_at::TEXT
FROM bookings b
WHERE b.property_id = 'YOUR_PROPERTY_ID'

UNION ALL

SELECT 
  'ESCROW_TRANS' as type,
  e.id,
  e.status,
  e.amount::TEXT,
  e.created_at::TEXT
FROM escrow_transactions e
WHERE e.property_id = 'YOUR_PROPERTY_ID'

UNION ALL

SELECT 
  'ESCROW_PAY' as type,
  e.id,
  e.status,
  e.amount::TEXT,
  e.created_at::TEXT
FROM escrow_payments e
WHERE e.property_id = 'YOUR_PROPERTY_ID';

-- ============================================
-- 3. FIND UNAVAILABLE PROPERTIES
-- ============================================

-- Properties with approved bookings
SELECT 
  p.id,
  p.title,
  p.location,
  b.status as booking_status,
  b.created_at as booking_date,
  u.full_name as student_name
FROM properties p
JOIN bookings b ON b.property_id = p.id
JOIN users u ON u.id = b.student_id
WHERE b.status IN ('approved', 'active', 'completed')
ORDER BY b.created_at DESC;

-- Properties with released escrow
SELECT 
  p.id,
  p.title,
  p.location,
  e.status as escrow_status,
  e.released_date,
  u.full_name as student_name
FROM properties p
JOIN escrow_transactions e ON e.property_id = p.id
JOIN users u ON u.id = e.student_id
WHERE e.status = 'released'
ORDER BY e.released_date DESC;

-- ============================================
-- 4. MAKE PROPERTY UNAVAILABLE (FOR TESTING)
-- ============================================

-- Option A: Approve an existing booking
-- UPDATE bookings 
-- SET status = 'approved', updated_at = NOW()
-- WHERE id = 'BOOKING_ID';

-- Option B: Create a new approved booking
-- INSERT INTO bookings (
--   property_id, student_id, landlord_id,
--   move_in_date, duration_months, amount_paid,
--   remaining_balance, payment_type, status
-- ) VALUES (
--   'PROPERTY_ID',
--   'STUDENT_ID',
--   'LANDLORD_ID',
--   CURRENT_DATE,
--   12,
--   5000,
--   0,
--   'full',
--   'approved'
-- );

-- Option C: Release escrow
-- UPDATE escrow_transactions
-- SET status = 'released', released_date = NOW(), updated_at = NOW()
-- WHERE property_id = 'PROPERTY_ID';

-- ============================================
-- 5. MAKE PROPERTY AVAILABLE AGAIN (FOR TESTING)
-- ============================================

-- Cancel all bookings for a property
-- UPDATE bookings
-- SET status = 'cancelled', updated_at = NOW()
-- WHERE property_id = 'PROPERTY_ID'
--   AND status IN ('pending', 'approved', 'active');

-- Refund all escrow for a property
-- UPDATE escrow_transactions
-- SET status = 'refunded', refunded_date = NOW(), updated_at = NOW()
-- WHERE property_id = 'PROPERTY_ID'
--   AND status IN ('held', 'released');

-- ============================================
-- 6. STATISTICS AND REPORTS
-- ============================================

-- Count properties by availability
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.property_id = p.id 
      AND b.status IN ('approved', 'active', 'completed')
    ) OR EXISTS (
      SELECT 1 FROM escrow_transactions e 
      WHERE e.property_id = p.id 
      AND e.status = 'released'
    ) THEN 'UNAVAILABLE'
    ELSE 'AVAILABLE'
  END as status,
  COUNT(*) as count
FROM properties p
WHERE p.verification_status = 'verified'
GROUP BY status;

-- Properties with most bookings
SELECT 
  p.id,
  p.title,
  p.location,
  COUNT(b.id) as total_bookings,
  COUNT(CASE WHEN b.status = 'approved' THEN 1 END) as approved_bookings,
  COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending_bookings
FROM properties p
LEFT JOIN bookings b ON b.property_id = p.id
GROUP BY p.id, p.title, p.location
ORDER BY total_bookings DESC
LIMIT 10;

-- Recent booking activity
SELECT 
  p.title as property,
  u.full_name as student,
  b.status,
  b.amount_paid,
  b.created_at,
  CASE 
    WHEN b.status IN ('approved', 'active', 'completed') THEN 'Property is UNAVAILABLE'
    ELSE 'Property is AVAILABLE'
  END as property_status
FROM bookings b
JOIN properties p ON p.id = b.property_id
JOIN users u ON u.id = b.student_id
ORDER BY b.created_at DESC
LIMIT 20;

-- ============================================
-- 7. VALIDATION QUERIES
-- ============================================

-- Check for properties with multiple approved bookings (should not happen)
SELECT 
  p.id,
  p.title,
  COUNT(b.id) as approved_bookings
FROM properties p
JOIN bookings b ON b.property_id = p.id
WHERE b.status IN ('approved', 'active', 'completed')
GROUP BY p.id, p.title
HAVING COUNT(b.id) > 1;

-- Check for bookings without escrow (potential issue)
SELECT 
  b.id as booking_id,
  p.title as property,
  b.status,
  b.amount_paid,
  CASE 
    WHEN e.id IS NULL THEN 'NO ESCROW'
    ELSE 'HAS ESCROW'
  END as escrow_status
FROM bookings b
JOIN properties p ON p.id = b.property_id
LEFT JOIN escrow_transactions e ON e.booking_id = b.id
WHERE b.status IN ('approved', 'active', 'completed')
ORDER BY b.created_at DESC;

-- Check for escrow without bookings (potential issue)
SELECT 
  e.id as escrow_id,
  p.title as property,
  e.status,
  e.amount,
  CASE 
    WHEN b.id IS NULL THEN 'NO BOOKING'
    ELSE 'HAS BOOKING'
  END as booking_status
FROM escrow_transactions e
JOIN properties p ON p.id = e.property_id
LEFT JOIN bookings b ON b.id = e.booking_id
WHERE e.status = 'released'
ORDER BY e.created_at DESC;

-- ============================================
-- 8. CLEANUP QUERIES (USE WITH CAUTION)
-- ============================================

-- Reset all bookings to pending (TESTING ONLY)
-- UPDATE bookings SET status = 'pending' WHERE status IN ('approved', 'active', 'completed');

-- Reset all escrow to held (TESTING ONLY)
-- UPDATE escrow_transactions SET status = 'held', released_date = NULL WHERE status = 'released';

-- Delete all test bookings (TESTING ONLY)
-- DELETE FROM bookings WHERE student_id IN (SELECT id FROM users WHERE email LIKE '%test%');

-- ============================================
-- 9. QUICK REFERENCE QUERIES
-- ============================================

-- Is this property available?
-- SELECT 
--   CASE 
--     WHEN EXISTS (
--       SELECT 1 FROM bookings 
--       WHERE property_id = 'PROPERTY_ID' 
--       AND status IN ('approved', 'active', 'completed')
--     ) OR EXISTS (
--       SELECT 1 FROM escrow_transactions 
--       WHERE property_id = 'PROPERTY_ID' 
--       AND status = 'released'
--     ) THEN 'NO - UNAVAILABLE'
--     ELSE 'YES - AVAILABLE'
--   END as is_available;

-- Who booked this property?
-- SELECT 
--   u.full_name,
--   u.email,
--   b.status,
--   b.move_in_date,
--   b.created_at
-- FROM bookings b
-- JOIN users u ON u.id = b.student_id
-- WHERE b.property_id = 'PROPERTY_ID'
-- ORDER BY b.created_at DESC;

-- ============================================
-- NOTES
-- ============================================
-- 
-- A property is UNAVAILABLE when:
-- 1. It has a booking with status 'approved', 'active', or 'completed'
-- 2. It has escrow with status 'released' (in either table)
--
-- A property is AVAILABLE when:
-- 1. No approved/active/completed bookings
-- 2. No released escrow
-- 3. All bookings are 'pending', 'rejected', or 'cancelled'
-- 4. All escrow is 'held' or 'refunded'
--
-- ============================================
