/**
 * Payment Routes
 * API endpoints for payment history and transaction management
 */

import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Payment history and statistics
router.get('/history', paymentController.getPaymentHistory);
router.get('/stats', paymentController.getPaymentStats);

// Transaction details
router.get('/transaction/:id', paymentController.getTransaction);
router.get('/receipt/:id', paymentController.getReceipt);

// Refund management
router.post('/refund', paymentController.createRefundRequest);
router.get('/refunds', paymentController.getRefundHistory);

// Payment methods
router.post('/methods', paymentController.savePaymentMethod);
router.get('/methods', paymentController.getPaymentMethods);

export default router;
