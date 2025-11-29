-- Check if escrow payments are properly linked to properties
-- Run this in Supabase SQL Editor

-- 1. Check escrow_payments table structure and data
SELECT 
    ep.id as escrow_id,
    ep.property_id,
    ep.status,
    ep.amount,
    ep.released_date,
    p.id as actual_property_id,
    p.title as property_title,
    p.landlord_id,
    u.full_name as landlord_name
FROM escrow_payments ep
LEFT JOIN properties p ON ep.property_id = p.id
LEFT JOIN users u ON p.landlord_id = u.id
WHERE ep.status = 'released'
ORDER BY ep.released_date DESC;

-- 2. Check if property_id exists in escrow_payments
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'escrow_payments';

-- 3. Check for Bayson Lemuel's properties specifically
SELECT 
    p.id,
    p.title,
    p.location,
    p.landlord_id,
    u.full_name as landlord_name,
    ep.id as escrow_id,
    ep.status as escrow_status,
    ep.released_date
FROM properties p
LEFT JOIN users u ON p.landlord_id = u.id
LEFT JOIN escrow_payments ep ON ep.property_id = p.id
WHERE u.full_name ILIKE '%bayson%' OR u.full_name ILIKE '%lemuel%'
ORDER BY p.created_at DESC;

-- 4. Check all released escrow payments
SELECT 
    ep.*,
    p.title as property_title
FROM escrow_payments ep
LEFT JOIN properties p ON ep.property_id = p.id
WHERE ep.status = 'released';
