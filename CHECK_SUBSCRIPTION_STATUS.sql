-- Check Subscription Status
-- Run this to see your current subscription in the database

-- 1. Check subscriptions table
SELECT 
    user_id,
    tier,
    status,
    start_date,
    end_date,
    created_at
FROM subscriptions
WHERE status = 'active'
ORDER BY created_at DESC;

-- 2. Check users table for subscription fields
SELECT 
    id,
    email,
    full_name,
    role,
    subscription_tier,
    subscription_status,
    subscription_start_date,
    subscription_end_date
FROM users
WHERE role IN ('student', 'landlord')
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check if YOU specifically have premium (replace with your email)
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    s.tier as subscription_tier,
    s.status as subscription_status,
    s.start_date,
    s.end_date
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
WHERE u.email = 'your-email@example.com';  -- REPLACE WITH YOUR EMAIL

-- 4. Count active subscriptions by tier
SELECT 
    tier,
    COUNT(*) as count
FROM subscriptions
WHERE status = 'active'
GROUP BY tier;

-- 5. If you need to manually set yourself to premium, run this:
-- (Replace 'your-user-id' with your actual user ID from query #3)
/*
INSERT INTO subscriptions (user_id, tier, status, start_date, end_date)
VALUES (
    'your-user-id',  -- Replace with your user ID
    'premium',
    'active',
    NOW(),
    NOW() + INTERVAL '1 month'
)
ON CONFLICT (user_id) 
DO UPDATE SET 
    tier = 'premium',
    status = 'active',
    start_date = NOW(),
    end_date = NOW() + INTERVAL '1 month';
*/
