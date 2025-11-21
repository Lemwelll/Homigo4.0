/**
 * Activity Routes
 */

import express from 'express';
import * as activityController from '../controllers/activityController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Track property view (public - no auth required)
router.post('/track-view/:propertyId', activityController.trackView);

// Get landlord activities (protected)
router.get('/landlord', authenticate, activityController.getLandlordActivities);

export default router;
