/**
 * Upload Routes
 * Defines API endpoints for file uploads
 */

import express from 'express';
import { uploadStudentId, uploadGovernmentId, uploadVerificationDocument } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /upload/student-id
 * @desc    Upload student ID photo (base64)
 * @access  Public (should be protected in production)
 */
router.post('/student-id', uploadStudentId);

/**
 * @route   POST /upload/government-id
 * @desc    Upload government ID photo (base64)
 * @access  Public (should be protected in production)
 */
router.post('/government-id', uploadGovernmentId);

/**
 * @route   POST /upload/verification-document
 * @desc    Upload verification document (base64)
 * @access  Private
 */
router.post('/verification-document', authenticate, uploadVerificationDocument);

export default router;
