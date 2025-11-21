/**
 * Authentication Routes
 * Defines API endpoints for authentication
 */

import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const { signup, login, getProfile, updateProfile } = authController;

const router = express.Router();

/**
 * @route   POST /auth/signup
 * @desc    Register a new user (student or landlord)
 * @access  Public
 */
router.post(
  '/signup',
  [
    // Validation middleware
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2, max: 255 })
      .withMessage('Full name must be between 2 and 255 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
      .withMessage('Please provide a valid phone number'),
    
    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isIn(['student', 'landlord'])
      .withMessage('Role must be either student or landlord'),
    
    // Student-specific fields (optional)
    body('studentIdNumber')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Student ID must be less than 50 characters'),
    
    body('university')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('University name must be less than 255 characters'),
    
    // Landlord-specific fields (optional)
    body('businessName')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Business name must be less than 255 characters')
  ],
  signup
);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    // Validation middleware
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  login
);

/**
 * @route   GET /auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PUT /auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, updateProfile);

// Search users
router.get('/users', authenticate, authController.searchUsers);

export default router;
