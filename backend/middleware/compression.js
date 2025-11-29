/**
 * Response Compression Middleware
 * Reduces payload size by 60-80%
 */

const compression = require('compression');

// Compression configuration
const compressionMiddleware = compression({
  // Compress all responses
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  
  // Compression level (6 is good balance of speed/size)
  level: 6,
  
  // Minimum size to compress (1KB)
  threshold: 1024,
  
  // Memory level
  memLevel: 8,
});

module.exports = compressionMiddleware;
