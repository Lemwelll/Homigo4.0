/**
 * Reservation Routes
 * Defines API endpoints for reservation functionality
 */

import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as reservationController from '../controllers/reservationController.js';

const router = express.Router();

/**
 * @route   POST /reservations
 * @desc    Create a new reservation (48-hour hold)
 * @access  Private (Student only)
 */
router.post('/', authenticate, reservationController.createReservation);

/**
 * @route   GET /reservations
 * @desc    Get user's reservations (student or landlord)
 * @access  Private
 */
router.get('/', authenticate, reservationController.getReservations);

/**
 * @route   GET /reservations/check/:propertyId
 * @desc    Check if property has active reservations
 * @access  Public
 */
router.get('/check/:propertyId', reservationController.checkActiveReservation);

/**
 * @route   POST /reservations/expire
 * @desc    Expire old reservations (cron/admin)
 * @access  Public (should be protected in production)
 */
router.post('/expire', reservationController.expireReservations);

/**
 * @route   GET /reservations/:id
 * @desc    Get reservation by ID
 * @access  Private
 */
router.get('/:id', authenticate, reservationController.getReservationById);

/**
 * @route   PATCH /reservations/:id/status
 * @desc    Update reservation status (approve/reject by landlord)
 * @access  Private (Landlord only)
 */
router.patch('/:id/status', authenticate, reservationController.updateReservationStatus);

/**
 * @route   DELETE /reservations/:id
 * @desc    Cancel reservation (by student)
 * @access  Private (Student only)
 */
router.delete('/:id', authenticate, reservationController.cancelReservation);

export default router;
