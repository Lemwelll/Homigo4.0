-- ============================================
-- FIX: No Properties Showing in Student Browse
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check what properties exist
SELECT 
  id,
  title,
  location,
  rent_price,
  verification_status,
  created_at
FROM properties
ORDER BY created_at DESC
LIMIT 10;

-- Step 2: Count properties by status
SELECT 
  verification_status,
  COUNT(*) as count
FROM properties
GROUP BY verification_status;

-- Step 3: VERIFY ALL PROPERTIES
-- This is the main fix - properties must be 'verified' to show up
UPDATE properties 
SET verification_status = 'verified' 
WHERE verification_status != 'verified'
RETURNING id, title, verification_status;

-- Step 4: Check if properties have images
SELECT 
  p.id,
  p.title,
  COUNT(pi.id) as image_count
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
GROUP BY p.id, p.title;

-- Step 5: Add default images to properties without images
INSERT INTO property_images (property_id, image_url, is_primary, display_order)
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
  true,
  0
FROM properties p
WHERE NOT EXISTS (
  SELECT 1 FROM property_images pi WHERE pi.property_id = p.id
)
RETURNING property_id, image_url;

-- Step 6: Verify the fix - show all verified properties
SELECT 
  p.id,
  p.title,
  p.location,
  p.rent_price,
  p.bedrooms,
  p.bathrooms,
  p.verification_status,
  pi.image_url,
  u.full_name as landlord_name
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = true
LEFT JOIN users u ON p.landlord_id = u.id
WHERE p.verification_status = 'verified'
ORDER BY p.created_at DESC;

-- Step 7: Final count
SELECT 
  COUNT(*) as verified_properties_count
FROM properties
WHERE verification_status = 'verified';
