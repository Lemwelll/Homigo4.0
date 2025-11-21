-- ============================================
-- FIX: Add Missing Columns to Users Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Add student-specific columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS student_id_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS university VARCHAR(255),
ADD COLUMN IF NOT EXISTS student_id_photo_url TEXT;

-- Add landlord-specific columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS government_id_photo_url TEXT;

-- Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN (
  'student_id_number', 
  'university', 
  'student_id_photo_url',
  'business_name',
  'government_id_photo_url'
)
ORDER BY column_name;

-- You should see 5 rows returned with the new columns
