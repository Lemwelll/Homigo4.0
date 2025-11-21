/**
 * Activity Service
 * Handles activity tracking and retrieval
 */

import { supabase } from '../config/database.js';

/**
 * Track property view
 */
export const trackPropertyView = async (propertyId) => {
  try {
    // Get current view count
    const { data: property, error: fetchError } = await supabase
      .from('properties')
      .select('views')
      .eq('id', propertyId)
      .single();

    if (fetchError) throw fetchError;

    // Increment view count
    const newViews = (property.views || 0) + 1;
    
    const { data, error } = await supabase
      .from('properties')
      .update({ views: newViews })
      .eq('id', propertyId)
      .select('views')
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Track property view error:', error);
    throw error;
  }
};

/**
 * Get landlord activities
 */
export const getLandlordActivities = async (landlordId) => {
  try {
    const activities = [];

    // Get recent bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        created_at,
        status,
        payment_type,
        properties (
          title
        ),
        users!bookings_student_id_fkey (
          full_name
        )
      `)
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (bookingsError) throw bookingsError;

    // Transform bookings to activities
    bookings?.forEach(booking => {
      const paymentInfo = booking.payment_type === 'downpayment' ? ' (Downpayment)' : ' (Full Payment)';
      activities.push({
        id: `booking-${booking.id}`,
        type: 'booking',
        message: `New booking from ${booking.users?.full_name || 'Student'} for "${booking.properties?.title || 'Property'}"${paymentInfo}`,
        time: booking.created_at,
        status: booking.status
      });
    });

    // Get recent reservations
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select(`
        id,
        created_at,
        status,
        properties (
          title
        ),
        users!reservations_student_id_fkey (
          full_name
        )
      `)
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (reservationsError) throw reservationsError;

    // Transform reservations to activities
    reservations?.forEach(reservation => {
      activities.push({
        id: `reservation-${reservation.id}`,
        type: 'reservation',
        message: `New reservation from ${reservation.users?.full_name || 'Student'} for "${reservation.properties?.title || 'Property'}"`,
        time: reservation.created_at,
        status: reservation.status
      });
    });

    // Get recent property verifications
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, title, verification_status, updated_at')
      .eq('landlord_id', landlordId)
      .eq('verification_status', 'verified')
      .order('updated_at', { ascending: false })
      .limit(3);

    if (propertiesError) throw propertiesError;

    // Transform properties to activities
    properties?.forEach(property => {
      activities.push({
        id: `property-${property.id}`,
        type: 'verification',
        message: `Your listing "${property.title}" was verified`,
        time: property.updated_at,
        status: 'success'
      });
    });

    // Sort all activities by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    return activities.slice(0, 10); // Return top 10 most recent
  } catch (error) {
    console.error('Get landlord activities error:', error);
    throw error;
  }
};
