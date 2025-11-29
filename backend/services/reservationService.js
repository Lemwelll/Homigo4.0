/**
 * Reservation Service
 * Handles all reservation-related database operations
 */

import { supabase } from '../config/database.js';

/**
 * Create a new reservation (48-hour hold)
 */
export const createReservation = async (studentId, propertyId, message = '') => {
  try {
    // Check if property allows reservations
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('id, landlord_id, allow_reservations, verification_status')
      .eq('id', propertyId)
      .single();

    if (propError) throw propError;
    if (!property) throw new Error('Property not found');
    // Removed verification check to allow reservations on all properties
    if (!property.allow_reservations) {
      throw new Error('Property does not allow reservations');
    }

    // Check if student already has an active reservation for this property
    const { data: existing, error: checkError } = await supabase
      .from('reservations')
      .select('id, status')
      .eq('student_id', studentId)
      .eq('property_id', propertyId)
      .in('status', ['reserved', 'approved'])
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      throw new Error('You already have an active reservation for this property');
    }

    // Check tier limits - Free tier: max 2 active reservations
    // For now, assume all users are on free tier (default behavior)
    // Count reservations with status 'reserved' or 'approved' (active reservations)
    const { data: activeReservations, error: countError } = await supabase
      .from('reservations')
      .select('id', { count: 'exact', head: false })
      .eq('student_id', studentId)
      .in('status', ['reserved', 'approved']);

    if (countError) throw countError;

    const FREE_RESERVATION_LIMIT = 2;

    // Enforce free tier limit (all users are free tier by default)
    if (activeReservations && activeReservations.length >= FREE_RESERVATION_LIMIT) {
      throw new Error(`Free tier limit reached. You can only have ${FREE_RESERVATION_LIMIT} active reservations. Upgrade to premium for unlimited reservations.`);
    }

    // Calculate expiry date (48 hours from now)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 48);

    // Create reservation
    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert({
        property_id: propertyId,
        student_id: studentId,
        landlord_id: property.landlord_id,
        status: 'reserved',
        message: message,
        expiry_date: expiryDate.toISOString()
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
        users!reservations_student_id_fkey (
          id,
          full_name,
          email
        )
      `)
      .single();

    if (error) throw error;

    return reservation;
  } catch (error) {
    console.error('Create reservation error:', error);
    throw error;
  }
};

/**
 * Get student's reservations - OPTIMIZED
 */
export const getStudentReservations = async (studentId) => {
  try {
    // Fetch reservations with minimal data
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(50); // Limit for performance

    if (error) throw error;
    if (!reservations || reservations.length === 0) return [];

    const propertyIds = [...new Set(reservations.map(r => r.property_id))];
    const landlordIds = [...new Set(reservations.map(r => r.landlord_id))];

    // Fetch related data in parallel
    const [propertiesResult, imagesResult, landlordsResult] = await Promise.all([
      supabase
        .from('properties')
        .select('id, title, location, rent_price, bedrooms, bathrooms')
        .in('id', propertyIds),
      supabase
        .from('property_images')
        .select('property_id, image_url')
        .in('property_id', propertyIds)
        .eq('is_primary', true),
      supabase
        .from('users')
        .select('id, full_name, phone')
        .in('id', landlordIds)
    ]);

    // Combine data efficiently
    return reservations.map(reservation => ({
      ...reservation,
      properties: {
        ...(propertiesResult.data?.find(p => p.id === reservation.property_id) || {}),
        property_images: imagesResult.data?.filter(img => img.property_id === reservation.property_id) || [],
        users: landlordsResult.data?.find(u => u.id === reservation.landlord_id) || null
      }
    }));

  } catch (error) {
    console.error('Get student reservations error:', error);
    throw error;
  }
};

/**
 * Get landlord's reservations - OPTIMIZED
 */
export const getLandlordReservations = async (landlordId) => {
  try {
    // Fetch reservations with minimal data
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false })
      .limit(50); // Limit for performance

    if (error) throw error;
    if (!reservations || reservations.length === 0) return [];

    const propertyIds = [...new Set(reservations.map(r => r.property_id))];
    const studentIds = [...new Set(reservations.map(r => r.student_id))];

    // Fetch related data in parallel
    const [propertiesResult, imagesResult, studentsResult] = await Promise.all([
      supabase
        .from('properties')
        .select('id, title, location, rent_price')
        .in('id', propertyIds),
      supabase
        .from('property_images')
        .select('property_id, image_url')
        .in('property_id', propertyIds)
        .eq('is_primary', true),
      supabase
        .from('users')
        .select('id, full_name, email, phone, university, student_id_number')
        .in('id', studentIds)
    ]);

    // Combine data efficiently
    return reservations.map(reservation => ({
      ...reservation,
      properties: {
        ...(propertiesResult.data?.find(p => p.id === reservation.property_id) || {}),
        property_images: imagesResult.data?.filter(img => img.property_id === reservation.property_id) || []
      },
      users: studentsResult.data?.find(u => u.id === reservation.student_id) || null
    }));

  } catch (error) {
    console.error('Get landlord reservations error:', error);
    throw error;
  }
};

/**
 * Get reservation by ID
 */
export const getReservationById = async (reservationId) => {
  try {
    const { data: reservation, error } = await supabase
      .from('reservations')
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
        users!reservations_student_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('id', reservationId)
      .single();

    if (error) throw error;

    return reservation;
  } catch (error) {
    console.error('Get reservation by ID error:', error);
    throw error;
  }
};

/**
 * Update reservation status (approve/reject by landlord)
 */
export const updateReservationStatus = async (reservationId, landlordId, status, rejectionReason = null) => {
  try {
    // Verify landlord owns this reservation
    const { data: reservation, error: checkError } = await supabase
      .from('reservations')
      .select('id, landlord_id, status')
      .eq('id', reservationId)
      .single();

    if (checkError) throw checkError;
    if (!reservation) throw new Error('Reservation not found');
    if (reservation.landlord_id !== landlordId) {
      throw new Error('Unauthorized: You do not own this reservation');
    }
    if (reservation.status !== 'reserved') {
      throw new Error(`Cannot update reservation with status: ${reservation.status}`);
    }

    // Update reservation
    const updateData = {
      status: status
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { data: updated, error } = await supabase
      .from('reservations')
      .update(updateData)
      .eq('id', reservationId)
      .select()
      .single();

    if (error) throw error;

    return updated;
  } catch (error) {
    console.error('Update reservation status error:', error);
    throw error;
  }
};

/**
 * Cancel reservation (by student)
 */
export const cancelReservation = async (reservationId, studentId) => {
  try {
    // Verify student owns this reservation
    const { data: reservation, error: checkError } = await supabase
      .from('reservations')
      .select('id, student_id, status')
      .eq('id', reservationId)
      .single();

    if (checkError) throw checkError;
    if (!reservation) throw new Error('Reservation not found');
    if (reservation.student_id !== studentId) {
      throw new Error('Unauthorized: You do not own this reservation');
    }
    if (!['reserved', 'approved'].includes(reservation.status)) {
      throw new Error(`Cannot cancel reservation with status: ${reservation.status}`);
    }

    // Cancel reservation
    const { data: cancelled, error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', reservationId)
      .select()
      .single();

    if (error) throw error;

    return cancelled;
  } catch (error) {
    console.error('Cancel reservation error:', error);
    throw error;
  }
};

/**
 * Check if property has active reservations
 */
export const hasActiveReservation = async (propertyId) => {
  try {
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('id')
      .eq('property_id', propertyId)
      .in('status', ['reserved', 'approved'])
      .limit(1);

    if (error) throw error;

    return reservations && reservations.length > 0;
  } catch (error) {
    console.error('Check active reservation error:', error);
    throw error;
  }
};

/**
 * Expire old reservations (called by cron job or on-demand)
 */
export const expireOldReservations = async () => {
  try {
    const now = new Date().toISOString();

    const { data: expired, error } = await supabase
      .from('reservations')
      .update({ status: 'expired' })
      .eq('status', 'reserved')
      .lt('expiry_date', now)
      .select();

    if (error) throw error;

    return expired;
  } catch (error) {
    console.error('Expire old reservations error:', error);
    throw error;
  }
};
