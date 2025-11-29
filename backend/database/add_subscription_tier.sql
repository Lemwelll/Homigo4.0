-- Add subscription_tier column to users table
-- This column tracks whether a user is on 'free' or 'premium' tier

-- Add column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'subscription_tier'
    ) THEN
        ALTER TABLE users 
        ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium'));
        
        RAISE NOTICE 'Added subscription_tier column to users table';
    ELSE
        RAISE NOTICE 'subscription_tier column already exists';
    END IF;
END $$;

-- Update existing users to have 'free' tier if NULL
UPDATE users 
SET subscription_tier = 'free' 
WHERE subscription_tier IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name = 'subscription_tier';

RAISE NOTICE 'Subscription tier column setup complete!';
