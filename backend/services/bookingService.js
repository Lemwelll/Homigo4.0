/**
 * Booking Service
 * Handles all booking-related database operations
 */

import { supabase } from '../config/database.js';
import * as escrowService from './escrowService.js';
import * as notificationService from './notificationService.js';

/**
 * Create a new booking (after payment completion)
 */
export const createBooking = async (bookingData) => {
  try {
    const {
      property_id,
      student_id,
      landlord_id,
      reservation_id,
      move_in_date,
      lease_duration_months,
      monthly_rent,
      total_amount,
      payment_method,
      payment_reference,
      student_message
    } = bookingData;

    // Determine payment type and remaining balance
    const paymentType = payment_method === 'downpayment' ? 'downpayment' : 'full';
    const remainingBalance = paymentType === 'downpayment' 
      ? (total_amount - monthly_rent) 
      : 0;

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        property_id,
        student_id,
        landlord_id,
        move_in_date,
        duration_months: lease_duration_months,
        amount_paid: monthly_rent,
        remaining_balance: remainingBalance,
        payment_type: paymentType,
        message: student_message,
        status: 'pending'
      })
      .select(`
        *,
        properties (
          id,
          title,
          location,
          rent_price,
          property_images (
            image_url,
            is_primary
          )
        ),
        users!bookings_student_id_fkey (
          id,
          full_name,
          email,
          phone,
          university,
          student_id_number
        )
      `)
      .single();

    if (error) throw error;

    // Create escrow transaction
    await escrowService.createEscrowTransaction({
      booking_id: booking.id,
      property_id,
      student_id,
      landlord_id,
      amount: monthly_rent
    });

    // Send notification to landlord about new inquiry
    try {
      const studentName = booking.users?.full_name || 'A student';
      const propertyTitle = booking.properties?.title || 'your property';
      await notificationService.notifyNewInquiry(landlord_id, studentName, propertyTitle, 'booking');
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
      // Don't throw - booking was successful
    }

    // If this booking is from a reservation, mark the reservation as completed
    if (reservation_id) {
      const { error: reservationError } = await supabase
        .from('reservations')
        .update({ status: 'completed' })
        .eq('id', reservation_id);

      if (reservationError) {
        console.error('Error updating reservation status:', reservationError);
        // Don't throw - booking was successful, just log the error
      }
    }

    return booking;
  } catch (error) {
    console.error('Create booking error:', error);
    throw error;
  }
};

/**
 * Get student's bookings
 */
export const getStudentBookings = async (studentId) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (
          id,
          title,
          description,
          location,
          address,
          rent_price,
          bedrooms,
          bathrooms,
          property_images (
            id,
            image_url,
            is_primary
          ),
          users!properties_landlord_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return bookings;
  } catch (error) {
    console.error('Get student bookings error:', error);
    throw error;
  }
};

/**
 * Get landlord's bookings
 */
export const getLandlordBookings = async (landlordId) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (
          id,
          title,
          location,
          rent_price,
          property_images (
            image_url,
            is_primary
          )
        ),
        users!bookings_student_id_fkey (
          id,
          full_name,
          email,
          phone,
          university,
          student_id_number
        )
      `)
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return bookings;
  } catch (error) {
    console.error('Get landlord bookings error:', error);
    throw error;
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId) => {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (
          id,
          title,
          location,
          rent_price,
          property_images (
            image_url,
            is_primary
          )
        ),
        users!bookings_student_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;

    return booking;
  } catch (error) {
    console.error('Get booking by ID error:', error);
    throw error;
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (bookingId, userId, status, userRole) => {
  try {
    // Verify ownership
    const { data: booking, error: checkError } = await supabase
      .from('bookings')
      .select('id, student_id, landlord_id, status')
      .eq('id', bookingId)
      .single();

    if (checkError) throw checkError;
    if (!booking) throw new Error('Booking not found');

    // Check authorization
    if (userRole === 'student' && booking.student_id !== userId) {
      throw new Error('Unauthorized: You do not own this booking');
    }
    if (userRole === 'landlord' && booking.landlord_id !== userId) {
      throw new Error('Unauthorized: You do not own this booking');
    }

    // Update booking
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;

    // Handle escrow based on status
    if (userRole === 'landlord') {
      if (status === 'approved') {
        // Release escrow to landlord
        await escrowService.releaseEscrow(bookingId, userId);
      } else if (status === 'rejected') {
        // Refund escrow to student
        await escrowService.refundEscrow(bookingId, userId);
      }
    }

    return updated;
  } catch (error) {
    console.error('Update booking status error:', error);
    throw error;
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId, userId, userRole) => {
  try {
    return await updateBookingStatus(bookingId, userId, 'cancelled', userRole);
  } catch (error) {
    console.error('Cancel booking error:', error);
    throw error;
  }
};

/**
 * Check if property has active bookings
 */
export const hasActiveBooking = async (propertyId) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', propertyId)
      .in('status', ['confirmed', 'active'])
      .limit(1);

    if (error) throw error;

    return bookings && bookings.length > 0;
  } catch (error) {
    console.error('Check active booking error:', error);
    throw error;
  }
};
