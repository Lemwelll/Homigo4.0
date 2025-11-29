-- ============================================
-- SUBSCRIPTION SYSTEM DATABASE SETUP (UUID VERSION)
-- For databases where users.id is UUID type
-- ============================================

-- 1. Add subscription columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired'));

-- 2. Create subscription_history table for tracking changes (UUID version)
CREATE TABLE IF NOT EXISTS subscription_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'upgrade', 'downgrade', 'cancel', 'renew'
  amount DECIMAL(10, 2),
  payment_method VARCHAR(50), -- 'card', 'gcash'
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_created_at ON subscription_history(created_at);

-- 4. Update existing users to have 'free' tier if NULL
UPDATE users 
SET subscription_tier = 'free',
    subscription_status = 'active'
WHERE subscription_tier IS NULL;

-- 5. Verify the changes
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name IN ('subscription_tier', 'subscription_start_date', 'subscription_end_date', 'subscription_status');

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE '✅ Subscription system database setup complete!';
    RAISE NOTICE '✅ Users table updated with subscription columns';
    RAISE NOTICE '✅ Subscription history table created (UUID version)';
    RAISE NOTICE '✅ Indexes created for performance';
END $$;
