-- Manually verify a landlord account
-- Replace 'landlord@email.com' with the actual landlord email

-- Option 1: Verify by email
UPDATE users 
SET 
  is_verified = true,
  verified_at = NOW(),
  verified_by = (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE email = 'landlord@email.com' 
AND role = 'landlord';

-- Option 2: Verify by name
UPDATE users 
SET 
  is_verified = true,
  verified_at = NOW(),
  verified_by = (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE full_name ILIKE '%Lemuel%' 
AND role = 'landlord';

-- Check the result
SELECT 
  id,
  full_name,
  email,
  role,
  is_verified,
  verified_at
FROM users 
WHERE role = 'landlord'
ORDER BY created_at DESC;
