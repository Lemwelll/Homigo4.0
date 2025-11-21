-- Fix Duplicate Property Images
-- This script assigns unique placeholder images to properties

-- Step 1: Check current image distribution
SELECT 
  pi.image_url,
  COUNT(DISTINCT pi.property_id) as property_count,
  STRING_AGG(DISTINCT p.title, ', ' ORDER BY p.title) as properties
FROM property_images pi
JOIN properties p ON pi.property_id = p.id
GROUP BY pi.image_url
HAVING COUNT(DISTINCT pi.property_id) > 1
ORDER BY property_count DESC;

-- Step 2: Backup current images (optional)
CREATE TABLE IF NOT EXISTS property_images_backup AS 
SELECT * FROM property_images;

-- Step 3: Assign unique placeholder images to each property
-- This uses different Unsplash images for variety

WITH property_list AS (
  SELECT 
    p.id as property_id,
    p.title,
    ROW_NUMBER() OVER (ORDER BY p.created_at) as row_num
  FROM properties p
),
new_images AS (
  SELECT 
    property_id,
    title,
    CASE 
      WHEN MOD(row_num, 10) = 1 THEN 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
      WHEN MOD(row_num, 10) = 2 THEN 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
      WHEN MOD(row_num, 10) = 3 THEN 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
      WHEN MOD(row_num, 10) = 4 THEN 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
      WHEN MOD(row_num, 10) = 5 THEN 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
      WHEN MOD(row_num, 10) = 6 THEN 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800'
      WHEN MOD(row_num, 10) = 7 THEN 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=800'
      WHEN MOD(row_num, 10) = 8 THEN 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'
      WHEN MOD(row_num, 10) = 9 THEN 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'
      ELSE 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'
    END as new_image_url
  FROM property_list
)
UPDATE property_images pi
SET image_url = ni.new_image_url
FROM new_images ni
WHERE pi.property_id = ni.property_id
  AND pi.is_primary = true;

-- Step 4: Verify the fix
SELECT 
  p.id,
  p.title,
  pi.image_url,
  pi.is_primary
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
WHERE pi.is_primary = true
ORDER BY p.title;

-- Step 5: Check that each property now has a unique primary image
SELECT 
  pi.image_url,
  COUNT(DISTINCT pi.property_id) as property_count
FROM property_images pi
WHERE pi.is_primary = true
GROUP BY pi.image_url
HAVING COUNT(DISTINCT pi.property_id) > 1;

-- If the above query returns no rows, the fix was successful!
