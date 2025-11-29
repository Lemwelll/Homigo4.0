/**
 * Response Caching Middleware
 * Caches GET requests to reduce database load
 */

const NodeCache = require('node-cache');

// Create cache instance (5 minute TTL)
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone data (faster)
});

/**
 * Generate cache key from request
 */
const generateCacheKey = (req) => {
  const userId = req.user?.id || 'anonymous';
  return `${req.method}:${req.originalUrl}:${userId}`;
};

/**
 * Cache middleware
 */
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const key = generateCacheKey(req);
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      console.log('📦 Cache hit:', req.originalUrl);
      return res.json(cachedResponse);
    }
    
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to cache response
    res.json = (body) => {
      // Cache successful responses
      if (res.statusCode === 200) {
        cache.set(key, body, duration);
      }
      return originalJson(body);
    };
    
    next();
  };
};

/**
 * Clear cache by pattern
 */
const clearCache = (pattern) => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  });
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
  cache.flushAll();
};

module.exports = {
  cacheMiddleware,
  clearCache,
  clearAllCache,
};
