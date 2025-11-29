/**
 * Optimized API Client for Vercel ↔ Render Communication
 * Features: Caching, Retry Logic, Request Deduplication, Timeouts
 */

import API_URL from '../config/api';

// Cache storage
const cache = new Map();
const pendingRequests = new Map();

// Configuration
const CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  cacheTime: 5 * 60 * 1000, // 5 minutes
};

/**
 * Generate cache key from URL and options
 */
const getCacheKey = (url, options = {}) => {
  const method = options.method || 'GET';
  const body = options.body ? JSON.stringify(options.body) : '';
  return `${method}:${url}:${body}`;
};

/**
 * Check if cached data is still valid
 */
const isCacheValid = (cacheEntry) => {
  if (!cacheEntry) return false;
  return Date.now() - cacheEntry.timestamp < CONFIG.cacheTime;
};

/**
 * Fetch with timeout
 */
const fetchWithTimeout = (url, options, timeout) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};

/**
 * Retry logic with exponential backoff
 */
const fetchWithRetry = async (url, options, attempt = 1) => {
  try {
    const response = await fetchWithTimeout(url, options, CONFIG.timeout);
    
    // If response is not ok and we have retries left
    if (!response.ok && attempt < CONFIG.retryAttempts) {
      const delay = CONFIG.retryDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }
    
    return response;
  } catch (error) {
    // Retry on network errors
    if (attempt < CONFIG.retryAttempts) {
      const delay = CONFIG.retryDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw error;
  }
};

/**
 * Optimized API Client
 */
class ApiClient {
  /**
   * GET request with caching
   */
  static async get(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const cacheKey = getCacheKey(url, options);
    
    // Check cache first
    if (!options.skipCache) {
      const cached = cache.get(cacheKey);
      if (isCacheValid(cached)) {
        console.log('📦 Cache hit:', endpoint);
        return cached.data;
      }
    }
    
    // Check if request is already pending (deduplication)
    if (pendingRequests.has(cacheKey)) {
      console.log('⏳ Request pending, waiting:', endpoint);
      return pendingRequests.get(cacheKey);
    }
    
    // Make request
    const requestPromise = this._makeRequest(url, {
      ...options,
      method: 'GET',
    });
    
    // Store pending request
    pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const data = await requestPromise;
      
      // Cache successful GET requests
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
      
      return data;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  }
  
  /**
   * POST request
   */
  static async post(endpoint, body, options = {}) {
    const url = `${API_URL}${endpoint}`;
    return this._makeRequest(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
  
  /**
   * PUT request
   */
  static async put(endpoint, body, options = {}) {
    const url = `${API_URL}${endpoint}`;
    return this._makeRequest(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }
  
  /**
   * DELETE request
   */
  static async delete(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    return this._makeRequest(url, {
      ...options,
      method: 'DELETE',
    });
  }
  
  /**
   * Make HTTP request with retry logic
   */
  static async _makeRequest(url, options = {}) {
    const token = localStorage.getItem('homigo_token');
    
    const fetchOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };
    
    try {
      const response = await fetchWithRetry(url, fetchOptions);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  /**
   * Clear cache
   */
  static clearCache(pattern) {
    if (pattern) {
      // Clear specific cache entries
      for (const key of cache.keys()) {
        if (key.includes(pattern)) {
          cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      cache.clear();
    }
  }
  
  /**
   * Prefetch data
   */
  static async prefetch(endpoint, options = {}) {
    try {
      await this.get(endpoint, options);
      console.log('✅ Prefetched:', endpoint);
    } catch (error) {
      console.warn('⚠️ Prefetch failed:', endpoint, error);
    }
  }
}

export default ApiClient;
