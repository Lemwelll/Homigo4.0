/**
 * Profile Routes
 * API endpoints for user profile management
 */

import express from 'express';
import * as profileController from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Profile operations
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

// Profile picture
router.post('/picture', profileController.updateProfilePicture);

// Statistics
router.get('/stats', profileController.getStats);

// Password change
router.post('/change-password', profileController.changePassword);

export default router;
