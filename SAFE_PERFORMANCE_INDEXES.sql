-- SAFE Performance Indexes
-- This version only creates indexes on columns that exist
-- Run this in Supabase SQL Editor

-- ========================================
-- CORE INDEXES (Most Important)
-- ========================================

-- Users table - email is critical for login
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email') THEN
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    END IF;
END $$;

-- Users table - role for filtering
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    END IF;
END $$;

-- Properties table - created_at for sorting
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);
    END IF;
END $$;

-- Properties table - landlord_id for filtering
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='landlord_id') THEN
        CREATE INDEX IF NOT EXISTS idx_properties_landlord ON properties(landlord_id);
    END IF;
END $$;

-- Properties table - city for location search
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='city') THEN
        CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
    END IF;
END $$;

-- Properties table - price for filtering
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='properties' AND column_name='price') THEN
        CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
    END IF;
END $$;

-- Property images - property_id for loading images
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='property_images') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='property_images' AND column_name='property_id') THEN
            CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id);
        END IF;
    END IF;
END $$;

-- Reservations - student_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='reservations') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='student_id') THEN
            CREATE INDEX IF NOT EXISTS idx_reservations_student ON reservations(student_id);
        END IF;
    END IF;
END $$;

-- Reservations - property_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='reservations') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='property_id') THEN
            CREATE INDEX IF NOT EXISTS idx_reservations_property ON reservations(property_id);
        END IF;
    END IF;
END $$;

-- Reservations - status
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='reservations') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='status') THEN
            CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
        END IF;
    END IF;
END $$;

-- Bookings - student_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='bookings') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='student_id') THEN
            CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
        END IF;
    END IF;
END $$;

-- Bookings - property_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='bookings') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='property_id') THEN
            CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
        END IF;
    END IF;
END $$;

-- Favorites - student_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='favorites') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='favorites' AND column_name='student_id') THEN
            CREATE INDEX IF NOT EXISTS idx_favorites_student ON favorites(student_id);
        END IF;
    END IF;
END $$;

-- Favorites - property_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='favorites') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='favorites' AND column_name='property_id') THEN
            CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);
        END IF;
    END IF;
END $$;

-- Messages - sender_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='messages') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='sender_id') THEN
            CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
        END IF;
    END IF;
END $$;

-- Messages - receiver_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='messages') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='receiver_id') THEN
            CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
        END IF;
    END IF;
END $$;

-- Notifications - user_id
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='notifications') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='user_id') THEN
            CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
        END IF;
    END IF;
END $$;

-- ========================================
-- VERIFY INDEXES CREATED
-- ========================================
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
