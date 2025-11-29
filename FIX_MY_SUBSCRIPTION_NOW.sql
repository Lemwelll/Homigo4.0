-- ============================================
-- FIX YOUR SUBSCRIPTION RIGHT NOW
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- STEP 1: Check if you have a subscription
-- Replace 'your-email@example.com' with YOUR actual email
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    u.role,
    s.id as subscription_id,
    s.tier,
    s.status,
    s.start_date,
    s.end_date
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'your-email@example.com';  -- CHANGE THIS TO YOUR EMAIL

-- STEP 2: If the above shows NULL for subscription_id, run this:
-- (Replace 'your-email@example.com' with YOUR actual email)

INSERT INTO subscriptions (user_id, tier, status, start_date, end_date, created_at, updated_at)
SELECT 
    id,
    'premium',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year',
    NOW(),
    NOW()
FROM users
WHERE email = 'your-email@example.com'  -- CHANGE THIS TO YOUR EMAIL
ON CONFLICT (user_id) 
DO UPDATE SET 
    tier = 'premium',
    status = 'active',
    start_date = NOW(),
    end_date = NOW() + INTERVAL '1 year',
    updated_at = NOW();

-- STEP 3: Verify it worked
SELECT 
    u.email,
    u.full_name,
    s.tier,
    s.status,
    s.start_date,
    s.end_date
FROM users u
JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'your-email@example.com'  -- CHANGE THIS TO YOUR EMAIL
AND s.status = 'active';

-- You should see:
-- tier: premium
-- status: active

-- STEP 4: Check all your properties
SELECT 
    COUNT(*) as property_count
FROM properties p
JOIN users u ON p.landlord_id = u.id
WHERE u.email = 'your-email@example.com';  -- CHANGE THIS TO YOUR EMAIL

-- STEP 5: After running this, RESTART your backend:
-- cd backend
-- npm start

-- Then try adding a property again!
