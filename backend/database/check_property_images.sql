-- Check property images in the database
-- This will show which properties have which images

SELECT 
  p.id as property_id,
  p.title as property_title,
  pi.id as image_id,
  pi.image_url,
  pi.is_primary,
  pi.created_at
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
ORDER BY p.title, pi.is_primary DESC, pi.created_at;

-- Count images per property
SELECT 
  p.id as property_id,
  p.title as property_title,
  COUNT(pi.id) as image_count,
  COUNT(CASE WHEN pi.is_primary = true THEN 1 END) as primary_image_count
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
GROUP BY p.id, p.title
ORDER BY p.title;

-- Check if all properties are using the same image URL
SELECT 
  image_url,
  COUNT(*) as usage_count,
  STRING_AGG(DISTINCT p.title, ', ') as properties_using_this_image
FROM property_images pi
JOIN properties p ON pi.property_id = p.id
GROUP BY image_url
ORDER BY usage_count DESC;
