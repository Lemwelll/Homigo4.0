-- ============================================
-- Check and Verify Properties Script
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check current properties
SELECT 
  id,
  title,
  location,
  rent_price,
  verification_status,
  created_at
FROM properties
ORDER BY created_at DESC;

-- Step 2: Count properties by status
SELECT 
  verification_status,
  COUNT(*) as count
FROM properties
GROUP BY verification_status;

-- Step 3: Verify all pending properties
UPDATE properties 
SET verification_status = 'verified' 
WHERE verification_status = 'pending_verification'
RETURNING id, title, verification_status;

-- Step 4: Check properties with images
SELECT 
  p.id,
  p.title,
  p.verification_status,
  COUNT(pi.id) as image_count,
  STRING_AGG(pi.image_url, ', ') as images
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
GROUP BY p.id, p.title, p.verification_status
ORDER BY p.created_at DESC;

-- Step 5: Add default image to properties without images
INSERT INTO property_images (property_id, image_url, is_primary, display_order)
SELECT 
  id,
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
  true,
  0
FROM properties
WHERE id NOT IN (SELECT DISTINCT property_id FROM property_images)
RETURNING property_id, image_url;

-- Step 6: Final verification - show all verified properties with images
SELECT 
  p.id,
  p.title,
  p.location,
  p.rent_price,
  p.bedrooms,
  p.bathrooms,
  p.verification_status,
  pi.image_url,
  pi.is_primary,
  u.full_name as landlord_name,
  u.email as landlord_email
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = true
LEFT JOIN users u ON p.landlord_id = u.id
WHERE p.verification_status = 'verified'
ORDER BY p.created_at DESC;

-- Step 7: Count final results
SELECT 
  'Total Properties' as metric,
  COUNT(*) as count
FROM properties
UNION ALL
SELECT 
  'Verified Properties' as metric,
  COUNT(*) as count
FROM properties
WHERE verification_status = 'verified'
UNION ALL
SELECT 
  'Properties with Images' as metric,
  COUNT(DISTINCT property_id) as count
FROM property_images;
