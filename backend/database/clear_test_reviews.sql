-- =====================================================
-- CLEAR TEST REVIEWS (FOR TESTING ONLY)
-- =====================================================
-- Use this to clear reviews during testing
-- DO NOT run in production!

-- View existing reviews
SELECT 
    pr.id,
    pr.property_id,
    pr.user_id,
    u.full_name as reviewer_name,
    pr.rating,
    pr.comment,
    pr.created_at
FROM property_reviews pr
JOIN users u ON pr.user_id = u.id
ORDER BY pr.created_at DESC;

-- Delete all reviews (TESTING ONLY!)
-- Uncomment the line below to delete all reviews:
-- DELETE FROM property_reviews;

-- Or delete reviews for a specific user:
-- DELETE FROM property_reviews WHERE user_id = 'YOUR_USER_ID_HERE';

-- Or delete reviews for a specific property:
-- DELETE FROM property_reviews WHERE property_id = 'YOUR_PROPERTY_ID_HERE';

-- Verify deletion
SELECT COUNT(*) as remaining_reviews FROM property_reviews;
