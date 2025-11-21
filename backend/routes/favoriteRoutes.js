/**
 * Favorite Routes
 * Defines API endpoints for favorites
 */

import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as favoriteController from '../controllers/favoriteController.js';

const router = express.Router();

/**
 * @route   GET /favorites
 * @desc    Get student's favorite properties
 * @access  Private (Student only)
 */
router.get('/', authenticate, favoriteController.getFavorites);

/**
 * @route   POST /favorites
 * @desc    Add property to favorites
 * @access  Private (Student only)
 */
router.post('/', authenticate, favoriteController.addFavorite);

/**
 * @route   DELETE /favorites/:propertyId
 * @desc    Remove property from favorites
 * @access  Private (Student only)
 */
router.delete('/:propertyId', authenticate, favoriteController.removeFavorite);

/**
 * @route   GET /favorites/check/:propertyId
 * @desc    Check if property is favorited
 * @access  Private (Student only)
 */
router.get('/check/:propertyId', authenticate, favoriteController.checkFavorite);

export default router;
