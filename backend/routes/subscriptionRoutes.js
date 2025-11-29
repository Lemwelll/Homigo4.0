/**
 * Subscription Routes
 * API endpoints for subscription management
 */

import express from 'express';
import * as subscriptionController from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get current subscription status
router.get('/status', subscriptionController.getSubscriptionStatus);

// Upgrade to premium
router.post('/upgrade', subscriptionController.upgradeToPremium);

// Cancel subscription
router.post('/cancel', subscriptionController.cancelSubscription);

// Get subscription history
router.get('/history', subscriptionController.getSubscriptionHistory);

export default router;
