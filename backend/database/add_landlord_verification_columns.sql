-- Add landlord verification columns to users table
-- Run this to enable landlord verification functionality

-- Add verified_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='verified_at') THEN
        ALTER TABLE users ADD COLUMN verified_at TIMESTAMP;
    END IF;
END $$;

-- Add verified_by column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='verified_by') THEN
        ALTER TABLE users ADD COLUMN verified_by UUID REFERENCES users(id);
    END IF;
END $$;

-- Add suspended_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='suspended_at') THEN
        ALTER TABLE users ADD COLUMN suspended_at TIMESTAMP;
    END IF;
END $$;

-- Add suspension_reason column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='suspension_reason') THEN
        ALTER TABLE users ADD COLUMN suspension_reason TEXT;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('verified_at', 'verified_by', 'suspended_at', 'suspension_reason')
ORDER BY column_name;
