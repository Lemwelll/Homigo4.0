/**
 * Payment Service
 * Handles payment transactions, history, and refunds
 */

import { supabase } from '../config/database.js';

/**
 * Create a new payment transaction
 */
export const createPaymentTransaction = async (transactionData) => {
  try {
    const {
      userId,
      amount,
      paymentType,
      paymentMethod,
      transactionId,
      referenceId,
      referenceType,
      paymentDetails,
      gatewayResponse
    } = transactionData;

    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        payment_type: paymentType,
        payment_method: paymentMethod,
        status: 'completed', // In demo mode, all payments are successful
        transaction_id: transactionId,
        reference_id: referenceId,
        reference_type: referenceType,
        payment_details: paymentDetails,
        gateway_response: gatewayResponse,
        processed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Create payment transaction error:', error);
    throw error;
  }
};

/**
 * Get payment history for a user
 */
export const getPaymentHistory = async (userId, options = {}) => {
  try {
    const { limit = 50, offset = 0, paymentType, status, startDate, endDate } = options;

    let query = supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (paymentType) {
      query = query.eq('payment_type', paymentType);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Get payment history error:', error);
    throw error;
  }
};

/**
 * Get payment statistics for a user
 */
export const getPaymentStats = async (userId) => {
  try {
    // Get total spent
    const { data: totalSpent, error: totalError } = await supabase
      .from('payment_transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (totalError) throw totalError;

    // Get transaction count by type
    const { data: transactionCounts, error: countError } = await supabase
      .from('payment_transactions')
      .select('payment_type')
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (countError) throw countError;

    // Calculate statistics
    const total = (totalSpent || []).reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0);
    
    const countsByType = (transactionCounts || []).reduce((acc, transaction) => {
      acc[transaction.payment_type] = (acc[transaction.payment_type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalSpent: total,
      totalTransactions: (transactionCounts || []).length,
      transactionsByType: countsByType
    };
  } catch (error) {
    console.error('Get payment stats error:', error);
    throw error;
  }
};

/**
 * Get a specific transaction by ID
 */
export const getTransactionById = async (transactionId, userId) => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    throw error;
  }
};

/**
 * Update transaction status
 */
export const updateTransactionStatus = async (transactionId, status, gatewayResponse = null) => {
  try {
    const updateData = {
      status: status,
      updated_at: new Date().toISOString()
    };

    if (gatewayResponse) {
      updateData.gateway_response = gatewayResponse;
    }

    if (status === 'completed') {
      updateData.processed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('payment_transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Update transaction status error:', error);
    throw error;
  }
};

/**
 * Create a refund request
 */
export const createRefundRequest = async (transactionId, userId, refundAmount, reason) => {
  try {
    const { data, error } = await supabase
      .from('payment_refunds')
      .insert({
        transaction_id: transactionId,
        user_id: userId,
        refund_amount: refundAmount,
        refund_reason: reason,
        refund_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Create refund request error:', error);
    throw error;
  }
};

/**
 * Get refund history for a user
 */
export const getRefundHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('payment_refunds')
      .select(`
        *,
        payment_transactions!inner(amount, payment_type, transaction_id, created_at)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Get refund history error:', error);
    throw error;
  }
};

/**
 * Save payment method (for future use)
 */
export const savePaymentMethod = async (userId, methodData) => {
  try {
    const { methodType, methodName, encryptedDetails, isDefault, expiresAt } = methodData;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: userId,
        method_type: methodType,
        method_name: methodName,
        encrypted_details: encryptedDetails,
        is_default: isDefault,
        expires_at: expiresAt
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Save payment method error:', error);
    throw error;
  }
};

/**
 * Get user's saved payment methods
 */
export const getPaymentMethods = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('id, method_type, method_name, is_default, expires_at, created_at')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Get payment methods error:', error);
    throw error;
  }
};
