-- ============================================
-- VERIFY ALL PROPERTIES (FOR TESTING)
-- This script updates all pending properties to verified status
-- Use this for testing purposes only
-- ============================================

-- Check current status of properties
SELECT 
    id, 
    title, 
    verification_status,
    created_at
FROM properties
ORDER BY created_at DESC;

-- Update all pending properties to verified
UPDATE properties 
SET verification_status = 'verified',
    updated_at = CURRENT_TIMESTAMP
WHERE verification_status = 'pending_verification';

-- Verify the changes
SELECT 
    id, 
    title, 
    verification_status,
    updated_at
FROM properties
ORDER BY created_at DESC;

-- Show count by status
SELECT 
    verification_status,
    COUNT(*) as count
FROM properties
GROUP BY verification_status;
