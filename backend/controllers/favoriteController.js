/**
 * Favorite Controller
 * Handles HTTP requests for favorites
 */

import * as favoriteService from '../services/favoriteService.js';

/**
 * Get student's favorites
 * GET /favorites
 */
export const getFavorites = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const favorites = await favoriteService.getStudentFavorites(studentId);

    return res.status(200).json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch favorites'
    });
  }
};

/**
 * Add property to favorites
 * POST /favorites
 */
export const addFavorite = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { property_id } = req.body;

    if (!property_id) {
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }

    const favorite = await favoriteService.addFavorite(studentId, property_id);

    return res.status(201).json({
      success: true,
      message: 'Property added to favorites',
      data: favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error.message);
    
    if (error.message === 'Property already in favorites') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to add favorite'
    });
  }
};

/**
 * Remove property from favorites
 * DELETE /favorites/:propertyId
 */
export const removeFavorite = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { propertyId } = req.params;

    await favoriteService.removeFavorite(studentId, propertyId);

    return res.status(200).json({
      success: true,
      message: 'Property removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove favorite'
    });
  }
};

/**
 * Check if property is favorited
 * GET /favorites/check/:propertyId
 */
export const checkFavorite = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { propertyId } = req.params;

    const isFav = await favoriteService.isFavorite(studentId, propertyId);

    return res.status(200).json({
      success: true,
      data: { isFavorite: isFav }
    });
  } catch (error) {
    console.error('Check favorite error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to check favorite'
    });
  }
};
