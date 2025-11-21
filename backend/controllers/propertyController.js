/**
 * Property Controller
 * Handles HTTP requests for property management
 */

import * as propertyService from '../services/propertyService.js';

/**
 * Create a new property
 * POST /properties
 */
export const createProperty = async (req, res) => {
  try {
    const landlordId = req.user.userId;
    const propertyData = req.body;

    // Validate required fields
    if (!propertyData.title || !propertyData.description || !propertyData.location || 
        !propertyData.address || !propertyData.price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const property = await propertyService.createProperty(propertyData, landlordId);

    return res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });

  } catch (error) {
    console.error('Create property error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create property'
    });
  }
};

/**
 * Get all properties for logged-in landlord
 * GET /properties/my-properties
 */
export const getMyProperties = async (req, res) => {
  try {
    const landlordId = req.user.userId;
    const properties = await propertyService.getLandlordProperties(landlordId);

    return res.status(200).json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error('Get my properties error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch properties'
    });
  }
};

/**
 * Get property by ID
 * GET /properties/:id
 */
export const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await propertyService.getPropertyById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: property
    });

  } catch (error) {
    console.error('Get property error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch property'
    });
  }
};

/**
 * Update property
 * PUT /properties/:id
 */
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const landlordId = req.user.userId;
    const updateData = req.body;

    const property = await propertyService.updateProperty(id, landlordId, updateData);

    return res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });

  } catch (error) {
    console.error('Update property error:', error.message);
    
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update property'
    });
  }
};

/**
 * Delete property
 * DELETE /properties/:id
 */
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const landlordId = req.user.userId;

    await propertyService.deleteProperty(id, landlordId);

    return res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    console.error('Delete property error:', error.message);
    
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete property'
    });
  }
};

/**
 * Get all verified properties (Public/Student) - ULTRA OPTIMIZED with pagination
 * GET /properties/verified
 */
const propertiesCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

export const getVerifiedProperties = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const cacheKey = `properties_${page}_${limit}`;
    const now = Date.now();

    // Check cache first
    const cached = propertiesCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return res.status(200).json({
        success: true,
        data: cached.data,
        cached: true,
        page: parseInt(page),
        limit: parseInt(limit)
      });
    }

    // Fetch from database with pagination
    const properties = await propertyService.getVerifiedProperties(parseInt(limit), offset);

    // Update cache
    propertiesCache.set(cacheKey, {
      data: properties,
      timestamp: now
    });

    // Clean old cache entries (keep only last 10 pages)
    if (propertiesCache.size > 10) {
      const firstKey = propertiesCache.keys().next().value;
      propertiesCache.delete(firstKey);
    }

    return res.status(200).json({
      success: true,
      data: properties,
      page: parseInt(page),
      limit: parseInt(limit),
      hasMore: properties.length === parseInt(limit)
    });

  } catch (error) {
    console.error('Get verified properties error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch properties'
    });
  }
};

/**
 * Get all properties (Admin)
 * GET /properties/admin/all
 */
export const getAllProperties = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = status ? { status } : {};

    const properties = await propertyService.getAllProperties(filters);

    return res.status(200).json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error('Get all properties error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch properties'
    });
  }
};

/**
 * Verify or reject property (Admin)
 * POST /properties/admin/verify/:id
 */
export const verifyProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.userId;
    const { action, adminNote } = req.body;

    if (!action || !['verify', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "verify" or "reject"'
      });
    }

    const property = await propertyService.verifyProperty(id, adminId, action, adminNote);

    return res.status(200).json({
      success: true,
      message: `Property ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
      data: property
    });

  } catch (error) {
    console.error('Verify property error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify property'
    });
  }
};
