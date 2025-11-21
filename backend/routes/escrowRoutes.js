/**
 * Escrow Routes
 * API endpoints for escrow management
 */

import express from 'express';
import * as escrowController from '../controllers/escrowController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All escrow routes require authentication
router.use(authenticate);

/**
 * @route   GET /escrow/landlord
 * @desc    Get landlord's escrow transactions
 * @access  Private (Landlord)
 */
router.get('/landlord', escrowController.getLandlordEscrow);

/**
 * @route   GET /escrow/student
 * @desc    Get student's escrow transactions
 * @access  Private (Student)
 */
router.get('/student', escrowController.getStudentEscrow);

/**
 * @route   GET /escrow/booking/:bookingId
 * @desc    Get escrow transaction by booking ID
 * @access  Private
 */
router.get('/booking/:bookingId', escrowController.getEscrowByBookingId);

export default router;
