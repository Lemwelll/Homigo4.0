/**
 * Property Routes
 * Defines API endpoints for property management
 */

import express from 'express';
import { authenticate, isLandlord, isAdmin } from '../middleware/authMiddleware.js';
import * as propertyController from '../controllers/propertyController.js';

const router = express.Router();

// ============================================
// LANDLORD ROUTES (Protected)
// ============================================

/**
 * @route   POST /properties
 * @desc    Create a new property
 * @access  Private (Landlord only)
 */
router.post('/', authenticate, isLandlord, propertyController.createProperty);

/**
 * @route   GET /properties/my-properties
 * @desc    Get all properties for logged-in landlord
 * @access  Private (Landlord only)
 */
router.get('/my-properties', authenticate, isLandlord, propertyController.getMyProperties);

/**
 * @route   GET /properties/verified
 * @desc    Get all verified properties (for students/public)
 * @access  Public
 */
router.get('/verified', propertyController.getVerifiedProperties);

/**
 * @route   GET /properties/:id
 * @desc    Get property by ID
 * @access  Public
 */
router.get('/:id', propertyController.getPropertyById);

/**
 * @route   PUT /properties/:id
 * @desc    Update property
 * @access  Private (Landlord only - must own property)
 */
router.put('/:id', authenticate, isLandlord, propertyController.updateProperty);

/**
 * @route   DELETE /properties/:id
 * @desc    Delete property
 * @access  Private (Landlord only - must own property)
 */
router.delete('/:id', authenticate, isLandlord, propertyController.deleteProperty);

// ============================================
// ADMIN ROUTES (Protected)
// ============================================

/**
 * @route   GET /properties/admin/all
 * @desc    Get all properties (with optional status filter)
 * @access  Private (Admin only)
 */
router.get('/admin/all', authenticate, isAdmin, propertyController.getAllProperties);

/**
 * @route   POST /properties/admin/verify/:id
 * @desc    Verify or reject a property
 * @access  Private (Admin only)
 */
router.post('/admin/verify/:id', authenticate, isAdmin, propertyController.verifyProperty);

export default router;
