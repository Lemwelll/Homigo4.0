/**
 * Escrow Service
 * Handles escrow transaction operations
 */

import { supabase } from '../config/database.js';

/**
 * Create escrow transaction when booking is created
 */
export const createEscrowTransaction = async (escrowData) => {
  try {
    const {
      booking_id,
      property_id,
      student_id,
      landlord_id,
      amount
    } = escrowData;

    const { data: escrow, error } = await supabase
      .from('escrow_transactions')
      .insert({
        booking_id,
        property_id,
        student_id,
        landlord_id,
        amount,
        status: 'held',
        held_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return escrow;
  } catch (error) {
    console.error('Create escrow transaction error:', error);
    throw error;
  }
};

/**
 * Release escrow payment to landlord
 */
export const releaseEscrow = async (bookingId, landlordId) => {
  try {
    // Verify landlord owns this escrow
    const { data: escrow, error: checkError } = await supabase
      .from('escrow_transactions')
      .select('id, landlord_id, status')
      .eq('booking_id', bookingId)
      .single();

    if (checkError) throw checkError;
    if (!escrow) throw new Error('Escrow transaction not found');
    if (escrow.landlord_id !== landlordId) {
      throw new Error('Unauthorized: You do not own this escrow');
    }
    if (escrow.status !== 'held') {
      throw new Error(`Cannot release escrow with status: ${escrow.status}`);
    }

    // Update escrow status to released
    const { data: updated, error } = await supabase
      .from('escrow_transactions')
      .update({
        status: 'released',
        released_date: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return updated;
  } catch (error) {
    console.error('Release escrow error:', error);
    throw error;
  }
};

/**
 * Refund escrow payment to student
 */
export const refundEscrow = async (bookingId, landlordId) => {
  try {
    // Verify landlord owns this escrow
    const { data: escrow, error: checkError } = await supabase
      .from('escrow_transactions')
      .select('id, landlord_id, status')
      .eq('booking_id', bookingId)
      .single();

    if (checkError) throw checkError;
    if (!escrow) throw new Error('Escrow transaction not found');
    if (escrow.landlord_id !== landlordId) {
      throw new Error('Unauthorized: You do not own this escrow');
    }
    if (escrow.status !== 'held') {
      throw new Error(`Cannot refund escrow with status: ${escrow.status}`);
    }

    // Update escrow status to refunded
    const { data: updated, error } = await supabase
      .from('escrow_transactions')
      .update({
        status: 'refunded',
        refunded_date: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    return updated;
  } catch (error) {
    console.error('Refund escrow error:', error);
    throw error;
  }
};

/**
 * Get landlord's escrow transactions
 */
export const getLandlordEscrow = async (landlordId) => {
  try {
    const { data: escrows, error } = await supabase
      .from('escrow_transactions')
      .select(`
        *,
        bookings (
          id,
          move_in_date,
          duration_months,
          status,
          payment_type,
          remaining_balance
        ),
        properties (
          id,
          title,
          location,
          property_images!inner (
            image_url,
            is_primary
          ),
          users!properties_landlord_id_fkey (
            id,
            full_name,
            email,
            phone
          )
        ),
        users!escrow_transactions_student_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Sort property images to put primary image first
    const escrowsWithSortedImages = escrows?.map(escrow => {
      if (escrow.properties?.property_images) {
        escrow.properties.property_images.sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return 0;
        });
      }
      return escrow;
    });

    return escrowsWithSortedImages;
  } catch (error) {
    console.error('Get landlord escrow error:', error);
    throw error;
  }
};

/**
 * Get student's escrow transactions
 */
export const getStudentEscrow = async (studentId) => {
  try {
    const { data: escrows, error } = await supabase
      .from('escrow_transactions')
      .select(`
        *,
        bookings (
          id,
          move_in_date,
          duration_months,
          status,
          payment_type,
          remaining_balance
        ),
        properties (
          id,
          title,
          location,
          property_images!inner (
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

    // Sort property images to put primary image first
    const escrowsWithSortedImages = escrows?.map(escrow => {
      if (escrow.properties?.property_images) {
        escrow.properties.property_images.sort((a, b) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return 0;
        });
      }
      return escrow;
    });

    return escrowsWithSortedImages;
  } catch (error) {
    console.error('Get student escrow error:', error);
    throw error;
  }
};

/**
 * Get escrow transaction by booking ID
 */
export const getEscrowByBookingId = async (bookingId) => {
  try {
    const { data: escrow, error } = await supabase
      .from('escrow_transactions')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    // If no escrow found (PGRST116 error), return null instead of throwing
    if (error && error.code === 'PGRST116') {
      return null;
    }

    if (error) throw error;

    return escrow;
  } catch (error) {
    console.error('Get escrow by booking ID error:', error);
    return null; // Return null instead of throwing for missing escrow
  }
};


/**
 * Release escrow payment by escrow ID
 */
export const releaseEscrowById = async (escrowId, landlordId) => {
  try {
    // First check if using escrow_transactions or escrow_payments table
    let escrow, error;
    
    // Try escrow_payments first (newer table)
    const { data: escrowPayment, error: paymentError } = await supabase
      .from('escrow_payments')
      .select('id, landlord_id, status, property_id')
      .eq('id', escrowId)
      .single();

    if (!paymentError && escrowPayment) {
      escrow = escrowPayment;
      error = null;
    } else {
      // Fallback to escrow_transactions
      const { data: escrowTrans, error: transError } = await supabase
        .from('escrow_transactions')
        .select('id, landlord_id, status, property_id')
        .eq('id', escrowId)
        .single();
      
      escrow = escrowTrans;
      error = transError;
    }

    if (error) throw error;
    if (!escrow) throw new Error('Escrow transaction not found');
    if (escrow.landlord_id !== landlordId) {
      throw new Error('Unauthorized: You do not own this escrow');
    }
    
    // Check current status
    if (escrow.status === 'released') {
      throw new Error('This payment has already been accepted and released');
    }
    if (escrow.status === 'refunded') {
      throw new Error('This payment has already been declined and refunded');
    }
    if (escrow.status !== 'held') {
      throw new Error(`Cannot release escrow with status: ${escrow.status}`);
    }

    // Update escrow status to released
    const tableName = escrowPayment ? 'escrow_payments' : 'escrow_transactions';
    const { data: updated, error: updateError } = await supabase
      .from(tableName)
      .update({
        status: 'released',
        released_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', escrowId)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log(`✅ Escrow ${escrowId} released for property ${escrow.property_id}`);
    return updated;
  } catch (error) {
    console.error('Release escrow by ID error:', error);
    throw error;
  }
};

/**
 * Refund escrow payment by escrow ID
 */
export const refundEscrowById = async (escrowId, landlordId, reason) => {
  try {
    // First check if using escrow_transactions or escrow_payments table
    let escrow, error;
    
    // Try escrow_payments first (newer table)
    const { data: escrowPayment, error: paymentError } = await supabase
      .from('escrow_payments')
      .select('id, landlord_id, status, property_id')
      .eq('id', escrowId)
      .single();

    if (!paymentError && escrowPayment) {
      escrow = escrowPayment;
      error = null;
    } else {
      // Fallback to escrow_transactions
      const { data: escrowTrans, error: transError } = await supabase
        .from('escrow_transactions')
        .select('id, landlord_id, status, property_id')
        .eq('id', escrowId)
        .single();
      
      escrow = escrowTrans;
      error = transError;
    }

    if (error) throw error;
    if (!escrow) throw new Error('Escrow transaction not found');
    if (escrow.landlord_id !== landlordId) {
      throw new Error('Unauthorized: You do not own this escrow');
    }
    
    // Check current status
    if (escrow.status === 'released') {
      throw new Error('This payment has already been accepted and released');
    }
    if (escrow.status === 'refunded') {
      throw new Error('This payment has already been declined and refunded');
    }
    if (escrow.status !== 'held') {
      throw new Error(`Cannot refund escrow with status: ${escrow.status}`);
    }

    // Update escrow status to refunded
    const tableName = escrowPayment ? 'escrow_payments' : 'escrow_transactions';
    const { data: updated, error: updateError } = await supabase
      .from(tableName)
      .update({
        status: 'refunded',
        refunded_date: new Date().toISOString(),
        refund_reason: reason || 'Declined by landlord',
        updated_at: new Date().toISOString()
      })
      .eq('id', escrowId)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log(`✅ Escrow ${escrowId} refunded for property ${escrow.property_id}`);
    return updated;
  } catch (error) {
    console.error('Refund escrow by ID error:', error);
    throw error;
  }
};
