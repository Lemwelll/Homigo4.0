-- ============================================
-- TEST RENTED BADGE - Create a Test Booking
-- ============================================
-- Run this in Supabase SQL Editor to test the RENTED badge

-- STEP 1: Check your properties
SELECT 
    id,
    title,
    location,
    landlord_id
FROM properties
ORDER BY created_at DESC
LIMIT 5;

-- STEP 2: Check if you have any bookings
SELECT 
    b.id,
    b.property_id,
    b.status,
    p.title as property_title
FROM bookings b
JOIN properties p ON b.property_id = p.id
ORDER BY b.created_at DESC;

-- STEP 3: Create a test booking for one of your properties
-- Replace 'PROPERTY-ID-HERE' with an actual property ID from STEP 1
-- Replace 'STUDENT-ID-HERE' with a student user ID

INSERT INTO bookings (
    property_id,
    student_id,
    landlord_id,
    status,
    payment_type,
    total_amount,
    payment_status,
    start_date,
    end_date,
    created_at
)
SELECT 
    'PROPERTY-ID-HERE',  -- CHANGE THIS to your property ID
    (SELECT id FROM users WHERE role = 'student' LIMIT 1),  -- Gets first student
    landlord_id,
    'active',  -- This makes it show as RENTED
    'full',
    rent_price,
    'completed',
    NOW(),
    NOW() + INTERVAL '1 month',
    NOW()
FROM properties
WHERE id = 'PROPERTY-ID-HERE';  -- CHANGE THIS to your property ID

-- STEP 4: Verify the booking was created
SELECT 
    b.id,
    b.property_id,
    b.status,
    p.title as property_title,
    b.created_at
FROM bookings b
JOIN properties p ON b.property_id = p.id
WHERE b.status = 'active'
ORDER BY b.created_at DESC;

-- STEP 5: After running this:
-- 1. Restart your backend (Ctrl+C, then npm start)
-- 2. Refresh your browser
-- 3. Go to Browse Properties page
-- 4. The property you created a booking for should now show "RENTED" badge!

-- TO REMOVE THE TEST BOOKING (if you want to test again):
/*
DELETE FROM bookings 
WHERE property_id = 'PROPERTY-ID-HERE';
*/
