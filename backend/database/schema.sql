-- ============================================
-- HOMIGO DATABASE SCHEMA
-- PostgreSQL Schema for Supabase
-- Complete Consolidated Database Schema
-- Version: 2.0
-- Last Updated: 2025-11-19
-- ============================================

-- Drop existing tables if exists (for clean setup)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS escrow_transactions CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS verification_logs CASCADE;
DROP TABLE IF EXISTS property_amenities CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- USERS TABLE
-- Stores all user accounts (students, landlords, admin)
-- ============================================
CREATE TABLE users (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- User Role (student, landlord, admin)
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'landlord', 'admin')),
    
    -- Student-specific fields
    student_id_number VARCHAR(50),
    university VARCHAR(255),
    student_id_photo_url TEXT,
    
    -- Landlord-specific fields
    business_name VARCHAR(255),
    government_id_photo_url TEXT,
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROPERTIES TABLE
-- Stores all property listings
-- ============================================
CREATE TABLE properties (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Key to landlord
    landlord_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    
    -- Pricing
    rent_price DECIMAL(10, 2) NOT NULL,
    
    -- Property Details
    bedrooms INTEGER NOT NULL DEFAULT 1,
    bathrooms INTEGER NOT NULL DEFAULT 1,
    
    -- Payment Rules
    allow_reservations BOOLEAN DEFAULT true,
    enable_downpayment BOOLEAN DEFAULT false,
    downpayment_amount DECIMAL(10, 2) DEFAULT 0,
    
    -- Status
    verification_status VARCHAR(50) DEFAULT 'pending_verification' CHECK (verification_status IN ('pending_verification', 'verified', 'rejected')),
    is_active BOOLEAN DEFAULT true,
    
    -- Statistics
    views INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROPERTY IMAGES TABLE
-- Stores property images (base64 or URLs)
-- ============================================
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROPERTY AMENITIES TABLE
-- Stores property amenities
-- ============================================
CREATE TABLE property_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, amenity_name)
);

-- ============================================
-- VERIFICATION LOGS TABLE
-- Logs admin verification actions
-- ============================================
CREATE TABLE verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (action IN ('verified', 'rejected')),
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- FAVORITES TABLE
-- Stores student favorite properties
-- ============================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, property_id)
);

-- ============================================
-- RESERVATIONS TABLE
-- Stores property reservations (48-hour holds)
-- ============================================
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Reservation Details
    status VARCHAR(50) DEFAULT 'reserved' CHECK (status IN ('reserved', 'approved', 'rejected', 'expired', 'cancelled')),
    message TEXT,
    rejection_reason TEXT,
    
    -- Dates
    reserved_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BOOKINGS TABLE
-- Stores confirmed property bookings
-- ============================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Booking Details
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    message TEXT,
    
    -- Dates
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    move_in_date DATE NOT NULL,
    duration_months INTEGER DEFAULT 12,
    
    -- Payment Details
    payment_type VARCHAR(50) DEFAULT 'full' CHECK (payment_type IN ('full', 'downpayment')),
    amount_paid DECIMAL(10, 2) NOT NULL,
    remaining_balance DECIMAL(10, 2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ESCROW TRANSACTIONS TABLE
-- Stores escrow payment transactions
-- ============================================
CREATE TABLE escrow_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction Details
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'held', 'released', 'refunded')),
    
    -- Timeline
    payment_date TIMESTAMP WITH TIME ZONE,
    held_date TIMESTAMP WITH TIME ZONE,
    released_date TIMESTAMP WITH TIME ZONE,
    refunded_date TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NOTIFICATIONS TABLE
-- Stores user notifications
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Notification Details
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'booking_created', 'booking_approved', 'booking_rejected',
        'reservation_created', 'reservation_approved', 'reservation_rejected',
        'payment_received', 'payment_released', 'payment_refunded',
        'message_received', 'property_verified', 'property_rejected'
    )),
    
    -- Users
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(255),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MESSAGES TABLE
-- Stores messages between students and landlords
-- ============================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Sender and Receiver
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    message TEXT NOT NULL,
    
    -- Optional: Related to a property
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Properties indexes
CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_properties_status ON properties(verification_status);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_properties_price ON properties(rent_price);

-- Property images indexes
CREATE INDEX idx_property_images_property ON property_images(property_id);
CREATE INDEX idx_property_images_primary ON property_images(is_primary);

-- Property amenities indexes
CREATE INDEX idx_property_amenities_property ON property_amenities(property_id);

-- Verification logs indexes
CREATE INDEX idx_verification_logs_property ON verification_logs(property_id);
CREATE INDEX idx_verification_logs_admin ON verification_logs(admin_id);

-- Favorites indexes
CREATE INDEX idx_favorites_student ON favorites(student_id);
CREATE INDEX idx_favorites_property ON favorites(property_id);

-- Reservations indexes
CREATE INDEX idx_reservations_property ON reservations(property_id);
CREATE INDEX idx_reservations_student ON reservations(student_id);
CREATE INDEX idx_reservations_landlord ON reservations(landlord_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_expiry ON reservations(expiry_date);

-- Bookings indexes
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_landlord ON bookings(landlord_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_move_in ON bookings(move_in_date);

-- Escrow transactions indexes
CREATE INDEX idx_escrow_booking ON escrow_transactions(booking_id);
CREATE INDEX idx_escrow_student ON escrow_transactions(student_id);
CREATE INDEX idx_escrow_landlord ON escrow_transactions(landlord_id);
CREATE INDEX idx_escrow_status ON escrow_transactions(status);

-- Notifications indexes
CREATE INDEX idx_notifications_receiver ON notifications(receiver_id);
CREATE INDEX idx_notifications_sender ON notifications(sender_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ============================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for properties table
CREATE TRIGGER update_properties_updated_at 
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for reservations table
CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for bookings table
CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for escrow_transactions table
CREATE TRIGGER update_escrow_updated_at 
    BEFORE UPDATE ON escrow_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS for Documentation
-- ============================================

-- Users table
COMMENT ON TABLE users IS 'Stores all user accounts for Homigo platform';
COMMENT ON COLUMN users.id IS 'Unique user identifier (UUID)';
COMMENT ON COLUMN users.full_name IS 'User full name';
COMMENT ON COLUMN users.email IS 'User email address (unique)';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password';
COMMENT ON COLUMN users.role IS 'User role: student, landlord, or admin';

-- Properties table
COMMENT ON TABLE properties IS 'Stores all property listings';
COMMENT ON COLUMN properties.verification_status IS 'Property verification status by admin';
COMMENT ON COLUMN properties.allow_reservations IS 'Whether property allows 48-hour reservations';
COMMENT ON COLUMN properties.enable_downpayment IS 'Whether property accepts downpayment';

-- Property images table
COMMENT ON TABLE property_images IS 'Stores property images (base64 or URLs)';
COMMENT ON COLUMN property_images.is_primary IS 'Primary image displayed first';
COMMENT ON COLUMN property_images.display_order IS 'Order of image display';

-- Property amenities table
COMMENT ON TABLE property_amenities IS 'Stores property amenities';

-- Verification logs table
COMMENT ON TABLE verification_logs IS 'Logs admin verification actions';

-- Favorites table
COMMENT ON TABLE favorites IS 'Stores student favorite properties';

-- Reservations table
COMMENT ON TABLE reservations IS 'Stores property reservations with 48-hour expiry';
COMMENT ON COLUMN reservations.expiry_date IS '48 hours from reservation date';

-- Bookings table
COMMENT ON TABLE bookings IS 'Stores confirmed property bookings';
COMMENT ON COLUMN bookings.payment_type IS 'Full payment or downpayment';

-- Escrow transactions table
COMMENT ON TABLE escrow_transactions IS 'Stores escrow payment transactions';
COMMENT ON COLUMN escrow_transactions.status IS 'Payment status: pending, held, released, refunded';

-- Notifications table
COMMENT ON TABLE notifications IS 'Stores user notifications';
COMMENT ON COLUMN notifications.type IS 'Type of notification event';

-- ============================================
-- SCHEMA VERSION
-- ============================================
COMMENT ON SCHEMA public IS 'Homigo Database Schema v2.0 - Complete consolidated schema with all tables';
