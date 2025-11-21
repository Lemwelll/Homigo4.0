/**
 * Booking Routes
 * API endpoints for booking management
 */

import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticate);

/**
 * @route   POST /bookings
 * @desc    Create a new booking (students only)
 * @access  Private (Student)
 */
router.post('/', bookingController.createBooking);

/**
 * @route   GET /bookings
 * @desc    Get user's bookings (student or landlord)
 * @access  Private
 */
router.get('/', bookingController.getMyBookings);

/**
 * @route   GET /bookings/:id
 * @desc    Get booking by ID
 * @access  Private
 */
router.get('/:id', bookingController.getBookingById);

/**
 * @route   PATCH /bookings/:id/status
 * @desc    Update booking status
 * @access  Private
 */
router.patch('/:id/status', bookingController.updateBookingStatus);

/**
 * @route   DELETE /bookings/:id
 * @desc    Cancel booking
 * @access  Private
 */
router.delete('/:id', bookingController.cancelBooking);

export default router;
