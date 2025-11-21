/**
 * Favorite Service
 * Business logic for student favorites
 */

import { supabase } from '../config/database.js';

/**
 * Get student's favorite properties
 */
export const getStudentFavorites = async (studentId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        property_id,
        created_at,
        properties (
          id,
          title,
          description,
          location,
          address,
          rent_price,
          bedrooms,
          bathrooms,
          verification_status,
          property_images (
            id,
            image_url,
            is_primary,
            display_order
          ),
          property_amenities (
            id,
            amenity_name
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

    return data;
  } catch (error) {
    console.error('Get favorites error:', error);
    throw error;
  }
};

/**
 * Add property to favorites
 */
export const addFavorite = async (studentId, propertyId) => {
  try {
    const { data, error} = await supabase
      .from('favorites')
      .insert({
        student_id: studentId,
        property_id: propertyId
      })
      .select()
      .single();

    if (error) {
      // Check if it's a duplicate error
      if (error.code === '23505') {
        throw new Error('Property already in favorites');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Add favorite error:', error);
    throw error;
  }
};

/**
 * Remove property from favorites
 */
export const removeFavorite = async (studentId, propertyId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('student_id', studentId)
      .eq('property_id', propertyId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Remove favorite error:', error);
    throw error;
  }
};

/**
 * Check if property is favorited by student
 */
export const isFavorite = async (studentId, propertyId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('student_id', studentId)
      .eq('property_id', propertyId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Check favorite error:', error);
    throw error;
  }
};
