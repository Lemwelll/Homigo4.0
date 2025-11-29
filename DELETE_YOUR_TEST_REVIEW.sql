-- =====================================================
-- DELETE YOUR TEST REVIEW
-- =====================================================
-- This will delete the review that's blocking you

-- First, let's see the review
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
WHERE pr.id = '74d3783e-c0be-4cd0-a9cb-2edf5a4ef9a9';

-- Now delete it
DELETE FROM property_reviews 
WHERE id = '74d3783e-c0be-4cd0-a9cb-2edf5a4ef9a9';

-- Verify it's gone
SELECT COUNT(*) as remaining_reviews 
FROM property_reviews 
WHERE user_id = '7c08f1bc-6189-407e-b071-0cc8915d6c49';

-- Success message
SELECT 'Review deleted! You can now create a new review.' as status;
