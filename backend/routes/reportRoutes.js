import express from 'express';
import reportController from '../controllers/reportController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All report routes require admin authentication
router.use(authenticate);
router.use(isAdmin);

// Report endpoints
router.get('/revenue', reportController.getRevenueReport);
router.get('/bookings', reportController.getBookingStats);
router.get('/properties', reportController.getPropertyPerformance);
router.get('/users', reportController.getUserActivityReport);
router.get('/subscriptions', reportController.getSubscriptionReport);
router.get('/verifications', reportController.getVerificationReport);
router.get('/dashboard', reportController.getDashboardReport);
router.get('/export', reportController.exportReport);

export default router;
