/**
 * Booking Controller
 * Handles HTTP requests for booking management
 */

import * as bookingService from '../services/bookingService.js';

/**
 * Create a new booking
 * POST /bookings
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Only students can create bookings
    if (userRole !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can create bookings'
      });
    }

    const bookingData = {
      ...req.body,
      student_id: userId
    };

    // Validate required fields
    if (!bookingData.property_id || !bookingData.landlord_id || !bookingData.move_in_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const booking = await bookingService.createBooking(bookingData);

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Create booking error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
};

/**
 * Get user's bookings (student or landlord)
 * GET /bookings
 */
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let bookings;

    if (userRole === 'student') {
      bookings = await bookingService.getStudentBookings(userId);
    } else if (userRole === 'landlord') {
      bookings = await bookingService.getLandlordBookings(userId);
    } else {
      return res.status(403).json({
        success: false,
        message: 'Invalid user role'
      });
    }

    return res.status(200).json({
      success: true,
      data: bookings
    });

  } catch (error) {
    console.error('Get my bookings error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

/**
 * Get booking by ID
 * GET /bookings/:id
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch booking'
    });
  }
};

/**
 * Update booking status
 * PATCH /bookings/:id/status
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const booking = await bookingService.updateBookingStatus(id, userId, status, userRole);

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Update booking status error:', error.message);
    
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update booking status'
    });
  }
};

/**
 * Cancel booking
 * DELETE /bookings/:id
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const booking = await bookingService.cancelBooking(id, userId, userRole);

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });

  } catch (error) {
    console.error('Cancel booking error:', error.message);
    
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
};
