-- ============================================
-- CREATE SUBSCRIPTIONS TABLE
-- ============================================
-- Run this in Supabase SQL Editor RIGHT NOW!

-- Create the subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscriptions_updated_at();

-- Now create YOUR premium subscription
-- Replace 'your-email@example.com' with YOUR actual email
INSERT INTO subscriptions (user_id, tier, status, start_date, end_date)
SELECT 
    id,
    'premium',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year'
FROM users
WHERE email = 'your-email@example.com'  -- CHANGE THIS TO YOUR EMAIL
ON CONFLICT (user_id) 
DO UPDATE SET 
    tier = 'premium',
    status = 'active',
    start_date = NOW(),
    end_date = NOW() + INTERVAL '1 year';

-- Verify it worked
SELECT 
    u.email,
    u.full_name,
    u.role,
    s.tier,
    s.status,
    s.start_date,
    s.end_date
FROM users u
JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'your-email@example.com';  -- CHANGE THIS TO YOUR EMAIL

-- You should see:
-- tier: premium
-- status: active

-- AFTER RUNNING THIS:
-- 1. Restart your backend (Ctrl+C, then npm start)
-- 2. Try adding a property again
-- 3. It should work!
