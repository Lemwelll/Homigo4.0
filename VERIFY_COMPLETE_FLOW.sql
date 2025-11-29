-- Step 1: Check escrow_transactions table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'escrow_transactions'
ORDER BY ordinal_position;

-- Step 2: Find properties with released escrow
SELECT 
    et.id as escrow_id,
    et.property_id,
    et.status,
    et.released_date,
    p.title as property_title,
    p.landlord_id
FROM escrow_transactions et
LEFT JOIN properties p ON et.property_id = p.id
WHERE et.status = 'released'
ORDER BY et.released_date DESC;

-- Step 3: Verify the property exists and is verified
SELECT 
    p.id,
    p.title,
    p.verification_status,
    p.landlord_id,
    u.full_name as landlord_name
FROM properties p
LEFT JOIN users u ON p.landlord_id = u.id
WHERE p.id IN (
    SELECT property_id 
    FROM escrow_transactions 
    WHERE status = 'released'
)
AND p.verification_status = 'verified';
