/**
 * API Configuration
 * Handles API URL based on environment
 */

// Get API URL from environment variable or use default
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Export for easy use
export default API_URL;

console.log('🌐 API URL:', API_URL);
