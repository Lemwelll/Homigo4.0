-- =====================================================
-- UPDATE LANDMARKS TO CMU BUKIDNON AREA
-- =====================================================

-- 1. Delete existing landmarks (Quezon City data)
DELETE FROM landmarks;

-- 2. Insert CMU Bukidnon landmarks
-- CMU is located at: 7.8647° N, 125.0508° E (Musuan, Maramag, Bukidnon)
-- Coordinates: 7°51'53"N, 125°3'3"E

INSERT INTO landmarks (name, type, latitude, longitude, address, city, phone, hours, description) VALUES

-- Laundry shops near CMU
('CMU Laundry Shop', 'laundry', 7.8650, 125.0510, 'Near CMU Main Gate, Musuan', 'Musuan, Bukidnon', '+63 912 345 6789', '7:00 AM - 8:00 PM', 'Student-friendly laundry service'),
('QuickWash Musuan', 'laundry', 7.8640, 125.0505, 'Musuan Proper', 'Musuan, Bukidnon', '+63 912 345 6790', '8:00 AM - 7:00 PM', 'Affordable wash and dry services'),
('Clean & Fresh Laundromat', 'laundry', 7.8655, 125.0515, 'CMU Commercial Area', 'Musuan, Bukidnon', '+63 912 345 6791', '6:00 AM - 9:00 PM', 'Self-service and full-service laundry'),

-- Printing shops near CMU
('CMU Print Shop', 'printing', 7.8647, 125.0508, 'Inside CMU Campus', 'Musuan, Bukidnon', '+63 912 345 6792', '8:00 AM - 5:00 PM', 'Thesis printing, binding, and photocopying'),
('Print Express Musuan', 'printing', 7.8642, 125.0503, 'Musuan Proper', 'Musuan, Bukidnon', '+63 912 345 6793', '7:00 AM - 8:00 PM', 'Fast printing and document services'),
('Student Print Hub', 'printing', 7.8652, 125.0512, 'Near CMU Dormitory', 'Musuan, Bukidnon', '+63 912 345 6794', '24/7', 'Affordable student printing and scanning'),

-- Convenience stores near CMU
('7-Eleven CMU', 'convenience_store', 7.8648, 125.0509, 'CMU Main Gate', 'Musuan, Bukidnon', '+63 912 345 6795', '24/7', 'Convenience store with ATM'),
('Mini Stop Musuan', 'convenience_store', 7.8645, 125.0506, 'Musuan Proper', 'Musuan, Bukidnon', '+63 912 345 6796', '24/7', 'Food and essentials'),
('Sari-Sari Store CMU', 'convenience_store', 7.8651, 125.0511, 'Inside CMU Campus', 'Musuan, Bukidnon', '+63 912 345 6797', '6:00 AM - 10:00 PM', 'Basic necessities and snacks'),

-- Restaurants near CMU
('Jollibee Musuan', 'restaurant', 7.8643, 125.0504, 'Musuan Proper', 'Musuan, Bukidnon', '+63 912 345 6798', '7:00 AM - 10:00 PM', 'Fast food restaurant'),
('Mang Inasal Musuan', 'restaurant', 7.8644, 125.0505, 'Musuan Proper', 'Musuan, Bukidnon', '+63 912 345 6799', '10:00 AM - 9:00 PM', 'Filipino grilled chicken'),
('CMU Canteen', 'restaurant', 7.8646, 125.0507, 'Inside CMU Campus', 'Musuan, Bukidnon', '+63 912 345 6800', '6:00 AM - 7:00 PM', 'Affordable student meals'),

-- Pharmacies near CMU
('Mercury Drug Musuan', 'pharmacy', 7.8641, 125.0502, 'Musuan Proper', 'Musuan, Bukidnon', '+63 912 345 6801', '8:00 AM - 8:00 PM', 'Pharmacy and drugstore'),
('Watsons Musuan', 'pharmacy', 7.8639, 125.0501, 'Musuan Proper', 'Musuan, Bukidnon', '+63 912 345 6802', '9:00 AM - 7:00 PM', 'Health and beauty store'),

-- Other services
('CMU Bookstore', 'other', 7.8649, 125.0510, 'Inside CMU Campus', 'Musuan, Bukidnon', '+63 912 345 6803', '8:00 AM - 5:00 PM', 'School supplies and books'),
('Internet Cafe CMU', 'other', 7.8653, 125.0513, 'Near CMU Main Gate', 'Musuan, Bukidnon', '+63 912 345 6804', '24/7', 'Computer rental and printing'),
('CMU Library', 'other', 7.8646, 125.0508, 'Inside CMU Campus', 'Musuan, Bukidnon', '+63 912 345 6805', '7:00 AM - 9:00 PM', 'University library and study area');

-- 3. Verify the update
SELECT 
    type,
    COUNT(*) as count,
    city
FROM landmarks
GROUP BY type, city
ORDER BY type;

-- 4. Show all landmarks
SELECT 
    name,
    type,
    city,
    address,
    latitude,
    longitude
FROM landmarks
ORDER BY type, name;

-- Success message
SELECT 'Landmarks updated to CMU Bukidnon area successfully!' AS status,
       COUNT(*) as total_landmarks
FROM landmarks;
