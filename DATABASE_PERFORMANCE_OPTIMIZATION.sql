-- ========================================
-- HOMIGO COMPLETE DATABASE OPTIMIZATION
-- Run this in Supabase SQL Editor
-- ========================================

-- ============================================
-- CRITICAL INDEXES FOR PERFORMANCE
-- Note: Using regular CREATE INDEX (not CONCURRENTLY) for Supabase compatibility
-- ============================================

-- Properties table indexes
CREATE INDEX IF NOT EXISTS idx_properties_verification_status 
ON properties(verification_status) WHERE verification_status = 'verified';

CREATE INDEX IF NOT EXISTS idx_properties_landlord_created 
ON properties(landlord_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_properties_location_rent 
ON properties(location, rent_price);

-- Users table indexes (check if columns exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_verified'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_users_role_verified 
    ON users(role, is_verified) WHERE role IN ('student', 'landlord');
  ELSE
    CREATE INDEX IF NOT EXISTS idx_users_role 
    ON users(role) WHERE role IN ('student', 'landlord');
  END IF;
  
  CREATE INDEX IF NOT EXISTS idx_users_email_role 
  ON users(email, role);
END $$;

-- Reservations table indexes
CREATE INDEX IF NOT EXISTS idx_reservations_student_status 
ON reservations(student_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reservations_property_status 
ON reservations(property_id, status);

CREATE INDEX IF NOT EXISTS idx_reservations_landlord_status 
ON reservations(landlord_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reservations_expiry 
ON reservations(expiry_date) WHERE status = 'reserved';

-- Bookings table indexes
CREATE INDEX IF NOT EXISTS idx_bookings_student_status 
ON bookings(student_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_property_status 
ON bookings(property_id, status);

CREATE INDEX IF NOT EXISTS idx_bookings_landlord_status 
ON bookings(landlord_id, status, created_at DESC);

-- Property images indexes
CREATE INDEX IF NOT EXISTS idx_property_images_property_primary 
ON property_images(property_id, is_primary, display_order);

-- Property amenities indexes
CREATE INDEX IF NOT EXISTS idx_property_amenities_property 
ON property_amenities(property_id);

-- Messages table indexes (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
    CREATE INDEX IF NOT EXISTS idx_messages_conversation 
    ON messages(sender_id, receiver_id, created_at DESC);
    
    CREATE INDEX IF NOT EXISTS idx_messages_receiver_read 
    ON messages(receiver_id, is_read, created_at DESC);
  END IF;
END $$;

-- Notifications table indexes (check column names first)
DO $$
BEGIN
  -- Check if notifications table exists and has the right columns
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'user_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
    ON notifications(user_id, is_read, created_at DESC);
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'recipient_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read 
    ON notifications(recipient_id, is_read, created_at DESC);
  END IF;
END $$;

-- Escrow table indexes (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'escrow_transactions') THEN
    CREATE INDEX IF NOT EXISTS idx_escrow_booking_status 
    ON escrow_transactions(booking_id, status);
  END IF;
END $$;

-- ============================================
-- OPTIMIZED MATERIALIZED VIEWS
-- ============================================

-- Fast verified properties view
CREATE OR REPLACE VIEW fast_verified_properties AS
SELECT 
    p.id,
    p.landlord_id,
    p.title,
    p.location,
    p.address,
    p.rent_price,
    p.bedrooms,
    p.bathrooms,
    p.allow_reservations,
    p.enable_downpayment,
    p.downpayment_amount,
    p.created_at,
    u.full_name as landlord_name,
    u.phone as landlord_phone,
    (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image,
    (SELECT COUNT(*) FROM property_amenities WHERE property_id = p.id) as amenity_count
FROM properties p
INNER JOIN users u ON p.landlord_id = u.id
WHERE p.verification_status = 'verified'
ORDER BY p.created_at DESC;

-- ============================================
-- QUERY PERFORMANCE ANALYSIS
-- ============================================

-- Check index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC
LIMIT 20;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries (if pg_stat_statements is enabled)
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY mean_time DESC
LIMIT 10;

SELECT '✅ Database optimization complete! Indexes created successfully.' as status;
