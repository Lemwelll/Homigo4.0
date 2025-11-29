/**
 * Profile Service
 * Handles user profile operations
 */

import { supabase } from '../config/database.js';

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const allowedFields = [
      'full_name',
      'email',
      'phone_number',
      'student_id_number',
      'university',
      'year_level',
      'course',
      'emergency_contact_name',
      'emergency_contact_number',
      'profile_picture_url',
      'bio',
      'address',
      'city',
      'province',
      'postal_code'
    ];

    // Filter updates to only include allowed fields
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Add updated_at timestamp
    filteredUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(filteredUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

/**
 * Update profile picture
 */
export const updateProfilePicture = async (userId, pictureUrl) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        profile_picture_url: pictureUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Update profile picture error:', error);
    throw error;
  }
};

/**
 * Get user statistics (for profile dashboard)
 */
export const getUserStats = async (userId, userRole) => {
  try {
    const stats = {};

    if (userRole === 'student') {
      // Get favorites count
      const { count: favoritesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get reservations count
      const { count: reservationsCount } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', userId);

      // Get bookings count
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', userId);

      stats.favorites = favoritesCount || 0;
      stats.reservations = reservationsCount || 0;
      stats.bookings = bookingsCount || 0;

    } else if (userRole === 'landlord') {
      // Get properties count
      const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('landlord_id', userId);

      // Get total views
      const { data: properties } = await supabase
        .from('properties')
        .select('views')
        .eq('landlord_id', userId);

      const totalViews = properties?.reduce((sum, prop) => sum + (prop.views || 0), 0) || 0;

      // Get reservations count
      const { count: reservationsCount } = await supabase
        .from('reservations')
        .select('r.*, p.landlord_id')
        .from('reservations as r')
        .innerJoin('properties as p', 'r.property_id', 'p.id')
        .eq('p.landlord_id', userId)
        .select('*', { count: 'exact', head: true });

      stats.properties = propertiesCount || 0;
      stats.totalViews = totalViews;
      stats.reservations = reservationsCount || 0;
    }

    return stats;
  } catch (error) {
    console.error('Get user stats error:', error);
    throw error;
  }
};

/**
 * Change password
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Get user's current password hash
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (getUserError) throw getUserError;

    // Verify current password
    const bcrypt = await import('bcrypt');
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};
