-- Add landlord profile fields to users table
-- Run this to enable landlord profile completion

-- Add TIN number column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='tin_number') THEN
        ALTER TABLE users ADD COLUMN tin_number TEXT;
    END IF;
END $$;

-- Add business address column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='business_address') THEN
        ALTER TABLE users ADD COLUMN business_address TEXT;
    END IF;
END $$;

-- Add residential address column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='residential_address') THEN
        ALTER TABLE users ADD COLUMN residential_address TEXT;
    END IF;
END $$;

-- Add emergency contact column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='emergency_contact') THEN
        ALTER TABLE users ADD COLUMN emergency_contact TEXT;
    END IF;
END $$;

-- Add valid ID type column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='valid_id_type') THEN
        ALTER TABLE users ADD COLUMN valid_id_type TEXT;
    END IF;
END $$;

-- Add valid ID number column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='valid_id_number') THEN
        ALTER TABLE users ADD COLUMN valid_id_number TEXT;
    END IF;
END $$;

-- Add bank name column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='bank_name') THEN
        ALTER TABLE users ADD COLUMN bank_name TEXT;
    END IF;
END $$;

-- Add bank account number column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='bank_account_number') THEN
        ALTER TABLE users ADD COLUMN bank_account_number TEXT;
    END IF;
END $$;

-- Add bank account name column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='bank_account_name') THEN
        ALTER TABLE users ADD COLUMN bank_account_name TEXT;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN (
    'tin_number', 
    'business_address', 
    'residential_address', 
    'emergency_contact',
    'valid_id_type',
    'valid_id_number',
    'bank_name',
    'bank_account_number',
    'bank_account_name'
)
ORDER BY column_name;
