-- =====================================================
-- ADD LANDMARKS AND SEARCH HISTORY TABLES
-- =====================================================

-- 1. Create landmarks table
CREATE TABLE IF NOT EXISTS landmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('laundry', 'printing', 'convenience_store', 'restaurant', 'pharmacy', 'other')),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    phone TEXT,
    hours TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create search_history table
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    search_query TEXT NOT NULL,
    search_type TEXT DEFAULT 'property' CHECK (search_type IN ('property', 'location', 'landmark')),
    filters JSONB,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_landmarks_type ON landmarks(type);
CREATE INDEX IF NOT EXISTS idx_landmarks_city ON landmarks(city);
CREATE INDEX IF NOT EXISTS idx_landmarks_active ON landmarks(is_active);
CREATE INDEX IF NOT EXISTS idx_landmarks_location ON landmarks(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(search_query);

-- 4. Create updated_at trigger for landmarks
CREATE OR REPLACE FUNCTION update_landmarks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_landmarks_updated_at
    BEFORE UPDATE ON landmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_landmarks_updated_at();

-- 5. Seed landmarks with sample data
INSERT INTO landmarks (name, type, latitude, longitude, address, city, phone, hours, description) VALUES
-- Laundry shops
('QuickWash Laundry', 'laundry', 14.6507, 121.0494, '123 Katipunan Ave, Quezon City', 'Quezon City', '+63 912 345 6789', '7:00 AM - 10:00 PM', 'Fast and affordable laundry service'),
('Clean & Fresh Laundromat', 'laundry', 14.6520, 121.0510, '456 Aurora Blvd, Quezon City', 'Quezon City', '+63 912 345 6790', '8:00 AM - 9:00 PM', 'Self-service and full-service laundry'),
('Suds Laundromat', 'laundry', 14.6495, 121.0480, '789 Commonwealth Ave, Quezon City', 'Quezon City', '+63 912 345 6791', '6:00 AM - 11:00 PM', 'Student-friendly rates'),

-- Printing shops
('Print Hub', 'printing', 14.6512, 121.0502, '321 Magsaysay Ave, Quezon City', 'Quezon City', '+63 912 345 6792', '24/7', 'Thesis printing, binding, and photocopying'),
('Copy Center Express', 'printing', 14.6530, 121.0520, '654 España Blvd, Manila', 'Manila', '+63 912 345 6793', '7:00 AM - 11:00 PM', 'Fast printing and document services'),
('Quick Print Station', 'printing', 14.6485, 121.0475, '987 Quezon Ave, Quezon City', 'Quezon City', '+63 912 345 6794', '8:00 AM - 10:00 PM', 'Affordable student printing'),

-- Convenience stores
('7-Eleven Tomas Morato', 'convenience_store', 14.6515, 121.0505, '111 Tomas Morato Ave, Quezon City', 'Quezon City', '+63 912 345 6795', '24/7', 'Convenience store with ATM'),
('Mini Stop Timog', 'convenience_store', 14.6525, 121.0515, '222 Timog Ave, Quezon City', 'Quezon City', '+63 912 345 6796', '24/7', 'Food and essentials'),
('Family Mart UP Town', 'convenience_store', 14.6500, 121.0490, '333 UP Town Center, Quezon City', 'Quezon City', '+63 912 345 6797', '24/7', 'Japanese convenience store'),

-- Restaurants
('Jollibee Katipunan', 'restaurant', 14.6510, 121.0495, '444 Katipunan Ave, Quezon City', 'Quezon City', '+63 912 345 6798', '6:00 AM - 12:00 AM', 'Fast food restaurant'),
('McDonald''s UP Town', 'restaurant', 14.6505, 121.0492, '555 UP Town Center, Quezon City', 'Quezon City', '+63 912 345 6799', '24/7', 'Fast food restaurant'),

-- Pharmacies
('Mercury Drug Katipunan', 'pharmacy', 14.6508, 121.0496, '666 Katipunan Ave, Quezon City', 'Quezon City', '+63 912 345 6800', '8:00 AM - 10:00 PM', 'Pharmacy and drugstore'),
('Watsons UP Town', 'pharmacy', 14.6502, 121.0491, '777 UP Town Center, Quezon City', 'Quezon City', '+63 912 345 6801', '10:00 AM - 9:00 PM', 'Health and beauty store');

-- 6. Verify tables were created
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('landmarks', 'search_history')
ORDER BY table_name, ordinal_position;

-- 7. Check landmark count
SELECT 
    type,
    COUNT(*) as count
FROM landmarks
GROUP BY type
ORDER BY type;

-- Success message
SELECT 'Landmarks and Search History tables created successfully!' AS status;
