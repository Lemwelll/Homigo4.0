-- ========================================
-- LANDLORD SETTINGS - COMPLETE DATABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ========================================

-- Step 1: Add landlord profile fields to users table
-- ========================================

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

-- Step 2: Add verification tracking columns
-- ========================================

-- Add verified_at column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='verified_at') THEN
        ALTER TABLE users ADD COLUMN verified_at TIMESTAMP;
    END IF;
END $$;

-- Add verified_by column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='verified_by') THEN
        ALTER TABLE users ADD COLUMN verified_by UUID REFERENCES users(id);
    END IF;
END $$;

-- Add suspended_at column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='suspended_at') THEN
        ALTER TABLE users ADD COLUMN suspended_at TIMESTAMP;
    END IF;
END $$;

-- Add suspension_reason column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='users' AND column_name='suspension_reason') THEN
        ALTER TABLE users ADD COLUMN suspension_reason TEXT;
    END IF;
END $$;

-- Step 3: Create verification_documents table
-- ========================================

CREATE TABLE IF NOT EXISTS verification_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('validId', 'businessPermit', 'bankStatement')),
    document_url TEXT NOT NULL,
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for verification_documents
CREATE INDEX IF NOT EXISTS idx_verification_documents_user_id ON verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_type ON verification_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_verification_documents_verified ON verification_documents(verified);

-- Create updated_at trigger for verification_documents
CREATE OR REPLACE FUNCTION update_verification_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_verification_documents_updated_at ON verification_documents;

CREATE TRIGGER trigger_update_verification_documents_updated_at
    BEFORE UPDATE ON verification_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_verification_documents_updated_at();

-- Step 4: Verify everything was created
-- ========================================

-- Check users table columns
SELECT 
    'users table columns' as check_type,
    column_name, 
    data_type 
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
    'bank_account_name',
    'verified_at',
    'verified_by',
    'suspended_at',
    'suspension_reason'
)
ORDER BY column_name;

-- Check verification_documents table
SELECT 
    'verification_documents table' as check_type,
    table_name,
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'verification_documents'
ORDER BY ordinal_position;

-- Success message
SELECT '✅ Database setup complete! All tables and columns created successfully.' as status;
