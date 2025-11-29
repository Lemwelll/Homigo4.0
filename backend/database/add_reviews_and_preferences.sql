-- =====================================================
-- ADD PROPERTY REVIEWS AND NOTIFICATION PREFERENCES
-- =====================================================

-- 1. Create property_reviews table
CREATE TABLE IF NOT EXISTS property_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    landlord_response TEXT,
    landlord_response_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(property_id, user_id, booking_id)
);

-- 2. Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_new_properties BOOLEAN DEFAULT TRUE,
    email_new_inquiries BOOLEAN DEFAULT TRUE,
    email_messages BOOLEAN DEFAULT TRUE,
    email_reservations BOOLEAN DEFAULT TRUE,
    email_bookings BOOLEAN DEFAULT TRUE,
    email_payments BOOLEAN DEFAULT TRUE,
    email_reviews BOOLEAN DEFAULT TRUE,
    email_marketing BOOLEAN DEFAULT FALSE,
    sms_messages BOOLEAN DEFAULT TRUE,
    sms_urgent BOOLEAN DEFAULT TRUE,
    sms_reservations BOOLEAN DEFAULT FALSE,
    push_messages BOOLEAN DEFAULT TRUE,
    push_reservations BOOLEAN DEFAULT TRUE,
    push_bookings BOOLEAN DEFAULT TRUE,
    weekly_reports BOOLEAN DEFAULT FALSE,
    price_drop_alerts BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON property_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON property_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON property_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_prefs_user_id ON notification_preferences(user_id);

-- 4. Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reviews_updated_at
    BEFORE UPDATE ON property_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_reviews_updated_at();

CREATE OR REPLACE FUNCTION update_notification_prefs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_notification_prefs_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_prefs_updated_at();

-- 5. Add average_rating column to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- 6. Create function to update property rating
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE properties
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM property_reviews
            WHERE property_id = NEW.property_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM property_reviews
            WHERE property_id = NEW.property_id
        )
    WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to auto-update property rating
CREATE TRIGGER trigger_update_property_rating
    AFTER INSERT OR UPDATE OR DELETE ON property_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_property_rating();

-- 8. Insert default notification preferences for existing users
INSERT INTO notification_preferences (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM notification_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- 9. Verify tables were created
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('property_reviews', 'notification_preferences')
ORDER BY table_name, ordinal_position;

-- Success message
SELECT 'Reviews and Notification Preferences tables created successfully!' AS status;
