/**
 * Database Query Optimizer
 * Optimizes queries for faster response times
 */

/**
 * Get only required fields for property listings
 * Reduces payload size by ~70%
 */
const getPropertyListFields = () => {
  return `
    id, title, location, city, price, 
    bedrooms, bathrooms, property_type,
    is_verified, is_available, landlord_id,
    created_at
  `;
};

/**
 * Get full property details
 */
const getPropertyDetailFields = () => {
  return `
    p.*, 
    u.full_name as landlord_name,
    u.phone as landlord_phone,
    u.email as landlord_email
  `;
};

/**
 * Optimize property query with pagination
 */
const buildOptimizedPropertyQuery = (filters = {}, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  
  let query = `
    SELECT ${getPropertyListFields()}
    FROM properties
    WHERE is_available = true
  `;
  
  const params = [];
  let paramIndex = 1;
  
  // Add filters
  if (filters.city) {
    query += ` AND city = $${paramIndex}`;
    params.push(filters.city);
    paramIndex++;
  }
  
  if (filters.minPrice) {
    query += ` AND price >= $${paramIndex}`;
    params.push(filters.minPrice);
    paramIndex++;
  }
  
  if (filters.maxPrice) {
    query += ` AND price <= $${paramIndex}`;
    params.push(filters.maxPrice);
    paramIndex++;
  }
  
  if (filters.bedrooms) {
    query += ` AND bedrooms >= $${paramIndex}`;
    params.push(filters.bedrooms);
    paramIndex++;
  }
  
  if (filters.propertyType) {
    query += ` AND property_type = $${paramIndex}`;
    params.push(filters.propertyType);
    paramIndex++;
  }
  
  // Add sorting
  query += ` ORDER BY created_at DESC`;
  
  // Add pagination
  query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);
  
  return { query, params };
};

/**
 * Batch load images for multiple properties
 * Reduces N+1 query problem
 */
const batchLoadPropertyImages = async (pool, propertyIds) => {
  if (!propertyIds || propertyIds.length === 0) return {};
  
  const query = `
    SELECT property_id, image_url, display_order
    FROM property_images
    WHERE property_id = ANY($1)
    ORDER BY property_id, display_order
  `;
  
  const result = await pool.query(query, [propertyIds]);
  
  // Group images by property_id
  const imagesByProperty = {};
  result.rows.forEach(row => {
    if (!imagesByProperty[row.property_id]) {
      imagesByProperty[row.property_id] = [];
    }
    imagesByProperty[row.property_id].push(row.image_url);
  });
  
  return imagesByProperty;
};

/**
 * Optimize response payload
 * Remove null values and unnecessary fields
 */
const optimizePayload = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => optimizePayload(item));
  }
  
  if (data && typeof data === 'object') {
    const optimized = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      // Skip null, undefined, and empty strings
      if (value !== null && value !== undefined && value !== '') {
        optimized[key] = typeof value === 'object' ? optimizePayload(value) : value;
      }
    });
    return optimized;
  }
  
  return data;
};

/**
 * Create database indexes for better performance
 */
const createPerformanceIndexes = async (pool) => {
  const indexes = [
    // Properties indexes
    'CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(is_available)',
    'CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city)',
    'CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price)',
    'CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_properties_landlord ON properties(landlord_id)',
    
    // Property images index
    'CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id)',
    
    // Reservations indexes
    'CREATE INDEX IF NOT EXISTS idx_reservations_student ON reservations(student_id)',
    'CREATE INDEX IF NOT EXISTS idx_reservations_property ON reservations(property_id)',
    'CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status)',
    
    // Favorites index
    'CREATE INDEX IF NOT EXISTS idx_favorites_student ON favorites(student_id)',
    
    // Messages indexes
    'CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id)',
    'CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id)',
    'CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC)',
  ];
  
  for (const indexQuery of indexes) {
    try {
      await pool.query(indexQuery);
      console.log('✅ Index created:', indexQuery.split('idx_')[1]?.split(' ')[0]);
    } catch (error) {
      console.error('❌ Index creation failed:', error.message);
    }
  }
};

module.exports = {
  getPropertyListFields,
  getPropertyDetailFields,
  buildOptimizedPropertyQuery,
  batchLoadPropertyImages,
  optimizePayload,
  createPerformanceIndexes,
};
