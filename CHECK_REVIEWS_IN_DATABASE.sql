-- =====================================================
-- CHECK IF REVIEWS EXIST IN DATABASE
-- =====================================================

-- 1. Check all reviews
SELECT 
    pr.id,
    pr.property_id,
    pr.user_id,
    pr.rating,
    pr.title,
    pr.comment,
    pr.created_at,
    u.full_name as reviewer_name
FROM property_reviews pr
LEFT JOIN users u ON pr.user_id = u.id
ORDER BY pr.created_at DESC;

-- 2. Check review count per property
SELECT 
    property_id,
    COUNT(*) as review_count,
    AVG(rating) as avg_rating
FROM property_reviews
GROUP BY property_id;

-- 3. Check for the specific property
SELECT 
    pr.*,
    u.full_name as reviewer_name
FROM property_reviews pr
LEFT JOIN users u ON pr.user_id = u.id
WHERE pr.property_id = '0e265bc1-8773-4e96-bafd-85e15ac7b2b7';

-- 4. Check if property_reviews table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'property_reviews';
