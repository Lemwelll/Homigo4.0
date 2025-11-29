-- ============================================
-- CHECK DATABASE TYPE
-- Run this to determine which SQL files to use
-- ============================================

-- Check users table ID type
SELECT 
    table_name,
    column_name,
    data_type,
    CASE 
        WHEN data_type = 'uuid' THEN '✅ Use UUID versions: add_subscription_system_UUID.sql and add_payment_history_UUID.sql'
        WHEN data_type = 'integer' THEN '✅ Use INTEGER versions: add_subscription_system.sql and add_payment_history.sql'
        ELSE '⚠️ Unexpected type: ' || data_type
    END as which_files_to_use
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'id';

-- Also show all user table columns for reference
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
