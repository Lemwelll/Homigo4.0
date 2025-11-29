-- Check escrow_payments table structure and data
SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'escrow_payments'
ORDER BY ordinal_position;

-- Check actual escrow payments with property info
SELECT 
    e.id as escrow_id,
    e.property_id,
    p.title as property_title,
    e.status,
    e.amount,
    e.created_at
FROM escrow_payments e
LEFT JOIN properties p ON e.property_id = p.id
ORDER BY e.created_at DESC;

-- Check if property_id matches between tables
SELECT 
    p.id as property_id,
    p.title,
    COUNT(e.id) as escrow_count,
    MAX(e.status) as latest_status
FROM properties p
LEFT JOIN escrow_payments e ON p.property_id = e.property_id OR p.id = e.property_id
WHERE p.verification_status = 'verified'
GROUP BY p.id, p.title;
