/**
 * Reservation Controller
 * Handles HTTP requests for reservation functionality
 */

import * as reservationService from '../services/reservationService.js';
import { createNotification } from '../services/notificationService.js';

/**
 * Create a new reservation
 * POST /reservations
 */
export const createReservation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { property_id, message } = req.body;

    // Only students can create reservations
    if (userRole !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create reservations'
      });
    }

    // Validate input
    if (!property_id) {
      return res.status(400).json({
        success: false,
        message: 'Property ID is required'
      });
    }

    const reservation = await reservationService.createReservation(
      userId,
      property_id,
      message
    );

    // Create notification for landlord
    try {
      if (reservation.landlord_id) {
        await createNotification({
          type: 'reservation_created',
          senderId: userId,
          receiverId: reservation.landlord_id,
          title: 'New Reservation Request',
          message: `New reservation request for your property`,
          actionUrl: '/landlord/reservations'
        });
      }
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
      // Don't fail the reservation if notification fails
    }

    return res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation
    });

  } catch (error) {
    console.error('Create reservation error:', error.message);
    
    if (error.message.includes('not found') || 
        error.message.includes('not verified') ||
        error.message.includes('does not allow') ||
        error.message.includes('already have')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create reservation'
    });
  }
};

/**
 * Get user's reservations (student or landlord) - OPTIMIZED with caching
 * GET /reservations
 */
const reservationsCache = new Map();
const RESERVATIONS_CACHE_DURATION = 15000; // 15 seconds

export const getReservations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const cacheKey = `reservations_${userId}_${userRole}`;
    const now = Date.now();

    // Check cache first
    const cached = reservationsCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < RESERVATIONS_CACHE_DURATION) {
      return res.status(200).json({
        success: true,
        data: cached.data,
        cached: true
      });
    }

    let reservations;

    if (userRole === 'student') {
      reservations = await reservationService.getStudentReservations(userId);
    } else if (userRole === 'landlord') {
      reservations = await reservationService.getLandlordReservations(userId);
    } else {
      return res.status(403).json({
        success: false,
        message: 'Invalid role for reservations'
      });
    }

    // Update cache
    reservationsCache.set(cacheKey, {
      data: reservations,
      timestamp: now
    });

    // Clean old cache entries (keep only last 50 users)
    if (reservationsCache.size > 50) {
      const firstKey = reservationsCache.keys().next().value;
      reservationsCache.delete(firstKey);
    }

    return res.status(200).json({
      success: true,
      data: reservations
    });

  } catch (error) {
    console.error('Get reservations error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reservations'
    });
  }
};

/**
 * Get reservation by ID
 * GET /reservations/:id
 */
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const reservation = await reservationService.getReservationById(id);

    // Verify user has access to this reservation
    if (reservation.student_id !== userId && reservation.landlord_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this reservation'
      });
    }

    return res.status(200).json({
      success: true,
      data: reservation
    });

  } catch (error) {
    console.error('Get reservation by ID error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch reservation'
    });
  }
};

/**
 * Update reservation status (approve/reject by landlord)
 * PATCH /reservations/:id/status
 */
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { status, rejection_reason } = req.body;

    // Only landlords can update reservation status
    if (userRole !== 'landlord') {
      return res.status(403).json({
        success: false,
        message: 'Only landlords can update reservation status'
      });
    }

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "approved" or "rejected"'
      });
    }

    // Require rejection reason if rejecting
    if (status === 'rejected' && !rejection_reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a reservation'
      });
    }

    const updated = await reservationService.updateReservationStatus(
      id,
      userId,
      status,
      rejection_reason
    );

    return res.status(200).json({
      success: true,
      message: `Reservation ${status} successfully`,
      data: updated
    });

  } catch (error) {
    console.error('Update reservation status error:', error.message);
    
    if (error.message.includes('Unauthorized') || 
        error.message.includes('not found') ||
        error.message.includes('Cannot update')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update reservation status'
    });
  }
};

/**
 * Cancel reservation (by student)
 * DELETE /reservations/:id
 */
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Only students can cancel their reservations
    if (userRole !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can cancel reservations'
      });
    }

    const cancelled = await reservationService.cancelReservation(id, userId);

    return res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: cancelled
    });

  } catch (error) {
    console.error('Cancel reservation error:', error.message);
    
    if (error.message.includes('Unauthorized') || 
        error.message.includes('not found') ||
        error.message.includes('Cannot cancel')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel reservation'
    });
  }
};

/**
 * Check if property has active reservations
 * GET /reservations/check/:propertyId
 */
export const checkActiveReservation = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const hasActive = await reservationService.hasActiveReservation(propertyId);

    return res.status(200).json({
      success: true,
      data: { has_active_reservation: hasActive }
    });

  } catch (error) {
    console.error('Check active reservation error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to check reservation status'
    });
  }
};

/**
 * Expire old reservations (admin/cron endpoint)
 * POST /reservations/expire
 */
export const expireReservations = async (req, res) => {
  try {
    const expired = await reservationService.expireOldReservations();

    return res.status(200).json({
      success: true,
      message: `Expired ${expired.length} reservations`,
      data: expired
    });

  } catch (error) {
    console.error('Expire reservations error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to expire reservations'
    });
  }
};
