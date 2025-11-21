-- ========================================
-- HOMIGO DATABASE OPTIMIZATION - SAFE VERSION
-- Run this in Supabase SQL Editor
-- This version only creates indexes for existing columns
-- ========================================

-- ============================================
-- STEP 1: CORE INDEXES (Always Safe)
-- ============================================

-- Properties table indexes
CREATE INDEX IF NOT EXISTS idx_properties_verification_status 
ON properties(verification_status);

CREATE INDEX IF NOT EXISTS idx_properties_landlord_id 
ON properties(landlord_id);

CREATE INDEX IF NOT EXISTS idx_properties_created_at 
ON properties(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_properties_landlord_created 
ON properties(landlord_id, created_at DESC);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_role 
ON users(role);

-- Reservations table indexes
CREATE INDEX IF NOT EXISTS idx_reservations_student_id 
ON reservations(student_id);

CREATE INDEX IF NOT EXISTS idx_reservations_property_id 
ON reservations(property_id);

CREATE INDEX IF NOT EXISTS idx_reservations_landlord_id 
ON reservations(landlord_id);

CREATE INDEX IF NOT EXISTS idx_reservations_status 
ON reservations(status);

CREATE INDEX IF NOT EXISTS idx_reservations_created_at 
ON reservations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reservations_student_status 
ON reservations(student_id, status);

CREATE INDEX IF NOT EXISTS idx_reservations_property_status 
ON reservations(property_id, status);

-- Bookings table indexes
CREATE INDEX IF NOT EXISTS idx_bookings_student_id 
ON bookings(student_id);

CREATE INDEX IF NOT EXISTS idx_bookings_property_id 
ON bookings(property_id);

CREATE INDEX IF NOT EXISTS idx_bookings_landlord_id 
ON bookings(landlord_id);

CREATE INDEX IF NOT EXISTS idx_bookings_status 
ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_bookings_created_at 
ON bookings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_student_status 
ON bookings(student_id, status);

-- Property images indexes
CREATE INDEX IF NOT EXISTS idx_property_images_property_id 
ON property_images(property_id);

CREATE INDEX IF NOT EXISTS idx_property_images_is_primary 
ON property_images(is_primary);

CREATE INDEX IF NOT EXISTS idx_property_images_property_primary 
ON property_images(property_id, is_primary);

-- Property amenities indexes
CREATE INDEX IF NOT EXISTS idx_property_amenities_property_id 
ON property_amenities(property_id);

-- ============================================
-- STEP 2: CONDITIONAL INDEXES (Check if columns exist)
-- ============================================

-- Reservations expiry_date (if column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reservations' AND column_name = 'expiry_date'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_reservations_expiry_date 
    ON reservations(expiry_date);
  END IF;
END $$;

-- Messages table indexes (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
    CREATE INDEX IF NOT EXISTS idx_messages_sender_id 
    ON messages(sender_id);
    
    CREATE INDEX IF NOT EXISTS idx_messages_receiver_id 
    ON messages(receiver_id);
    
    CREATE INDEX IF NOT EXISTS idx_messages_created_at 
    ON messages(created_at DESC);
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'messages' AND column_name = 'is_read'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_messages_receiver_read 
      ON messages(receiver_id, is_read);
    END IF;
  END IF;
END $$;

-- Notifications table indexes (if table exists)
DO $$
DECLARE
  user_col TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
    -- Check which user column exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'notifications' AND column_name = 'user_id'
    ) THEN
      user_col := 'user_id';
    ELSIF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'notifications' AND column_name = 'recipient_id'
    ) THEN
      user_col := 'recipient_id';
    END IF;
    
    -- Create indexes based on found column
    IF user_col IS NOT NULL THEN
      EXECUTE format('CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(%I)', user_col);
      
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' AND column_name = 'is_read'
      ) THEN
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(%I, is_read)', user_col);
      END IF;
    END IF;
    
    -- Created_at index
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'notifications' AND column_name = 'created_at'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
      ON notifications(created_at DESC);
    END IF;
  END IF;
END $$;

-- Escrow transactions indexes (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'escrow_transactions') THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'escrow_transactions' AND column_name = 'booking_id'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_escrow_booking_id 
      ON escrow_transactions(booking_id);
    END IF;
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'escrow_transactions' AND column_name = 'status'
    ) THEN
      CREATE INDEX IF NOT EXISTS idx_escrow_status 
      ON escrow_transactions(status);
    END IF;
  END IF;
END $$;

-- ============================================
-- STEP 3: OPTIMIZED VIEWS
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
-- STEP 4: VERIFICATION QUERIES
-- ============================================

-- Check created indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Success message
SELECT '✅ Database optimization complete! Check the results above.' as status;
