-- ========================================
-- OPTIMIZATION: Add indexes for verified properties query
-- Run this in Supabase SQL Editor
-- ========================================

-- Index 1: Speed up filtering by verification_status
CREATE INDEX IF NOT EXISTS idx_properties_verification_status 
ON properties(verification_status);

-- Index 2: Speed up ordering by created_at
CREATE INDEX IF NOT EXISTS idx_properties_created_at 
ON properties(created_at DESC);

-- Index 3: Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_properties_status_created 
ON properties(verification_status, created_at DESC);

-- Index 4: Speed up property_images lookups
CREATE INDEX IF NOT EXISTS idx_property_images_property_id 
ON property_images(property_id, display_order);

-- Index 5: Speed up property_amenities lookups
CREATE INDEX IF NOT EXISTS idx_property_amenities_property_id 
ON property_amenities(property_id);

-- Index 6: Speed up landlord lookups
CREATE INDEX IF NOT EXISTS idx_properties_landlord_id 
ON properties(landlord_id);

-- Verify indexes were created
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('properties', 'property_images', 'property_amenities')
ORDER BY tablename, indexname;
