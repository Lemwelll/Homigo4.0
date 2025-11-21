/**
 * Property Service
 * Business logic for property management
 */

import { supabase } from '../config/database.js';

/**
 * Create a new property
 */
export const createProperty = async (propertyData, landlordId) => {
  try {
    // Insert property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        landlord_id: landlordId,
        title: propertyData.title,
        description: propertyData.description,
        location: propertyData.location,
        address: propertyData.address,
        rent_price: propertyData.price,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        allow_reservations: propertyData.paymentRules?.allowReservations ?? true,
        enable_downpayment: propertyData.paymentRules?.enableDownpayment ?? false,
        downpayment_amount: propertyData.paymentRules?.downpaymentAmount ?? 0,
        verification_status: 'pending_verification'
      })
      .select()
      .single();

    if (propertyError) throw propertyError;

    // Insert images if provided
    if (propertyData.images && propertyData.images.length > 0) {
      const imageInserts = propertyData.images.map((imageUrl, index) => ({
        property_id: property.id,
        image_url: imageUrl,
        is_primary: index === 0,
        display_order: index
      }));

      const { error: imagesError } = await supabase
        .from('property_images')
        .insert(imageInserts);

      if (imagesError) throw imagesError;
    }

    // Insert amenities if provided
    if (propertyData.amenities && propertyData.amenities.length > 0) {
      const amenityInserts = propertyData.amenities.map(amenity => ({
        property_id: property.id,
        amenity_name: amenity
      }));

      const { error: amenitiesError } = await supabase
        .from('property_amenities')
        .insert(amenityInserts);

      if (amenitiesError) throw amenitiesError;
    }

    return property;
  } catch (error) {
    console.error('Create property error:', error);
    throw error;
  }
};

/**
 * Get all properties for a landlord - OPTIMIZED
 */
export const getLandlordProperties = async (landlordId) => {
  try {
    // Fetch properties with minimal data first
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!properties || properties.length === 0) return [];

    const propertyIds = properties.map(p => p.id);

    // Fetch all related data in parallel
    const [imagesResult, amenitiesResult, countsResult] = await Promise.all([
      supabase
        .from('property_images')
        .select('property_id, id, image_url, is_primary, display_order')
        .in('property_id', propertyIds)
        .order('display_order'),
      supabase
        .from('property_amenities')
        .select('property_id, id, amenity_name')
        .in('property_id', propertyIds),
      // Get counts in parallel for all properties
      Promise.all(propertyIds.map(async (propId) => {
        const [bookings, reservations] = await Promise.all([
          supabase
            .from('bookings')
            .select('id', { count: 'exact', head: true })
            .eq('property_id', propId),
          supabase
            .from('reservations')
            .select('id', { count: 'exact', head: true })
            .eq('property_id', propId)
        ]);
        return {
          property_id: propId,
          total: (bookings.count || 0) + (reservations.count || 0)
        };
      }))
    ]);

    // Combine data efficiently
    return properties.map(property => {
      const inquiryCount = countsResult.find(c => c.property_id === property.id)?.total || 0;
      
      return {
        ...property,
        property_images: imagesResult.data?.filter(img => img.property_id === property.id) || [],
        property_amenities: amenitiesResult.data?.filter(a => a.property_id === property.id) || [],
        inquiries: inquiryCount
      };
    });

  } catch (error) {
    console.error('Get landlord properties error:', error);
    throw error;
  }
};

/**
 * Get property by ID
 */
export const getPropertyById = async (propertyId) => {
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
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
      `)
      .eq('id', propertyId)
      .single();

    if (error) throw error;

    return property;
  } catch (error) {
    console.error('Get property by ID error:', error);
    throw error;
  }
};

/**
 * Update property
 */
export const updateProperty = async (propertyId, landlordId, updateData) => {
  try {
    // Verify ownership
    const { data: existing, error: checkError } = await supabase
      .from('properties')
      .select('landlord_id')
      .eq('id', propertyId)
      .single();

    if (checkError) throw checkError;
    if (existing.landlord_id !== landlordId) {
      throw new Error('Unauthorized: You do not own this property');
    }

    // Update property
    const { data: property, error: updateError } = await supabase
      .from('properties')
      .update({
        title: updateData.title,
        description: updateData.description,
        location: updateData.location,
        address: updateData.address,
        rent_price: updateData.price,
        bedrooms: updateData.bedrooms,
        bathrooms: updateData.bathrooms,
        allow_reservations: updateData.paymentRules?.allowReservations,
        enable_downpayment: updateData.paymentRules?.enableDownpayment,
        downpayment_amount: updateData.paymentRules?.downpaymentAmount
      })
      .eq('id', propertyId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Update images if provided
    if (updateData.images) {
      // Delete old images
      await supabase
        .from('property_images')
        .delete()
        .eq('property_id', propertyId);

      // Insert new images
      if (updateData.images.length > 0) {
        const imageInserts = updateData.images.map((imageUrl, index) => ({
          property_id: propertyId,
          image_url: imageUrl,
          is_primary: index === 0,
          display_order: index
        }));

        await supabase
          .from('property_images')
          .insert(imageInserts);
      }
    }

    // Update amenities if provided
    if (updateData.amenities) {
      // Delete old amenities
      await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', propertyId);

      // Insert new amenities
      if (updateData.amenities.length > 0) {
        const amenityInserts = updateData.amenities.map(amenity => ({
          property_id: propertyId,
          amenity_name: amenity
        }));

        await supabase
          .from('property_amenities')
          .insert(amenityInserts);
      }
    }

    return property;
  } catch (error) {
    console.error('Update property error:', error);
    throw error;
  }
};

/**
 * Delete property
 */
export const deleteProperty = async (propertyId, landlordId) => {
  try {
    // Verify ownership
    const { data: existing, error: checkError } = await supabase
      .from('properties')
      .select('landlord_id')
      .eq('id', propertyId)
      .single();

    if (checkError) throw checkError;
    if (existing.landlord_id !== landlordId) {
      throw new Error('Unauthorized: You do not own this property');
    }

    // Delete property (CASCADE will handle related records)
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (deleteError) throw deleteError;

    return true;
  } catch (error) {
    console.error('Delete property error:', error);
    throw error;
  }
};

/**
 * Get all verified properties (Public/Student) - ULTRA OPTIMIZED
 */
export const getVerifiedProperties = async (limit = 50, offset = 0) => {
  try {
    // Try optimized view first
    const { data: viewProperties, error: viewError } = await supabase
      .from('fast_verified_properties')
      .select('*')
      .range(offset, offset + limit - 1);

    if (!viewError && viewProperties) {
      // Fetch amenities separately for better performance
      const propertyIds = viewProperties.map(p => p.id);
      const { data: amenities } = await supabase
        .from('property_amenities')
        .select('property_id, amenity_name')
        .in('property_id', propertyIds);

      // Attach amenities to properties
      return viewProperties.map(prop => ({
        ...prop,
        property_amenities: amenities?.filter(a => a.property_id === prop.id) || []
      }));
    }

    // Fallback to optimized query if view doesn't exist
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        id,
        landlord_id,
        title,
        location,
        address,
        rent_price,
        bedrooms,
        bathrooms,
        allow_reservations,
        enable_downpayment,
        downpayment_amount,
        created_at
      `)
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    if (!properties || properties.length === 0) {
      return [];
    }

    // Fetch related data in parallel
    const propertyIds = properties.map(p => p.id);
    const landlordIds = [...new Set(properties.map(p => p.landlord_id))];

    const [imagesResult, amenitiesResult, landlordsResult] = await Promise.all([
      supabase
        .from('property_images')
        .select('property_id, image_url, is_primary, display_order')
        .in('property_id', propertyIds)
        .order('display_order'),
      supabase
        .from('property_amenities')
        .select('property_id, amenity_name')
        .in('property_id', propertyIds),
      supabase
        .from('users')
        .select('id, full_name, phone')
        .in('id', landlordIds)
    ]);

    // Combine data efficiently
    return properties.map(prop => ({
      ...prop,
      property_images: imagesResult.data?.filter(img => img.property_id === prop.id) || [],
      property_amenities: amenitiesResult.data?.filter(a => a.property_id === prop.id) || [],
      users: landlordsResult.data?.find(u => u.id === prop.landlord_id) || null
    }));

  } catch (error) {
    console.error('Get verified properties error:', error);
    throw error;
  }
};

/**
 * Get all properties (Admin)
 */
export const getAllProperties = async (filters = {}) => {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
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
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status) {
      query = query.eq('verification_status', filters.status);
    }

    const { data: properties, error } = await query;

    if (error) throw error;

    return properties;
  } catch (error) {
    console.error('Get all properties error:', error);
    throw error;
  }
};

/**
 * Verify or reject property (Admin)
 */
export const verifyProperty = async (propertyId, adminId, action, adminNote = null) => {
  try {
    // Update property status
    const { data: property, error: updateError } = await supabase
      .from('properties')
      .update({
        verification_status: action === 'verify' ? 'verified' : 'rejected'
      })
      .eq('id', propertyId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log verification action
    const { error: logError } = await supabase
      .from('verification_logs')
      .insert({
        property_id: propertyId,
        admin_id: adminId,
        action: action === 'verify' ? 'verified' : 'rejected',
        admin_note: adminNote
      });

    if (logError) throw logError;

    return property;
  } catch (error) {
    console.error('Verify property error:', error);
    throw error;
  }
};
