/**
 * Subscription Service
 * Handles subscription tier management and payment tracking
 */

import { supabase } from '../config/database.js';

/**
 * Get user's current subscription status
 */
export const getUserSubscription = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription_tier, subscription_start_date, subscription_end_date, subscription_status')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      tier: data.subscription_tier || 'free',
      startDate: data.subscription_start_date,
      endDate: data.subscription_end_date,
      status: data.subscription_status || 'active'
    };
  } catch (error) {
    console.error('Get subscription error:', error);
    throw error;
  }
};

/**
 * Upgrade user to premium
 */
export const upgradeToPremium = async (userId, paymentData) => {
  try {
    const { paymentMethod, amount, transactionId, cardDetails, gcashNumber } = paymentData;

    // Calculate subscription dates (1 month from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    console.log('🔄 Creating payment transaction...');
    
    // 1. CREATE PAYMENT TRANSACTION RECORD (THIS IS CRITICAL!)
    const { data: paymentTransaction, error: paymentError } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        payment_type: 'subscription',
        payment_method: paymentMethod,
        status: 'completed',
        transaction_id: transactionId,
        reference_type: 'subscription',
        payment_details: {
          method: paymentMethod,
          ...(cardDetails && { 
            cardLast4: cardDetails.cardNumber?.slice(-4),
            cardName: cardDetails.cardName 
          }),
          ...(gcashNumber && { gcashNumber })
        },
        processed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error('❌ Payment transaction error:', paymentError);
      throw new Error('Failed to create payment transaction: ' + paymentError.message);
    }

    console.log('✅ Payment transaction created:', paymentTransaction.id);

    // 2. Update user's subscription
    const { data: user, error: updateError } = await supabase
      .from('users')
      .update({
        subscription_tier: 'premium',
        subscription_start_date: startDate.toISOString(),
        subscription_end_date: endDate.toISOString(),
        subscription_status: 'active'
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('❌ User update error:', updateError);
      throw new Error('Failed to update user subscription: ' + updateError.message);
    }

    console.log('✅ User subscription updated to premium');

    // 3. Record in subscription history
    const { error: historyError } = await supabase
      .from('subscription_history')
      .insert({
        user_id: userId,
        tier: 'premium',
        action: 'upgrade',
        amount: amount,
        payment_method: paymentMethod,
        transaction_id: transactionId
      });

    if (historyError) {
      console.error('⚠️ Subscription history error:', historyError);
      // Don't throw - history is not critical
    } else {
      console.log('✅ Subscription history recorded');
    }

    console.log('🎉 Upgrade complete!');

    return {
      tier: user.subscription_tier,
      startDate: user.subscription_start_date,
      endDate: user.subscription_end_date,
      status: user.subscription_status,
      paymentTransaction: paymentTransaction
    };
  } catch (error) {
    console.error('❌ Upgrade to premium error:', error);
    throw error;
  }
};

/**
 * Cancel subscription (downgrade to free)
 */
export const cancelSubscription = async (userId) => {
  try {
    // Update user's subscription
    const { data: user, error: updateError } = await supabase
      .from('users')
      .update({
        subscription_tier: 'free',
        subscription_status: 'cancelled',
        subscription_end_date: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Record in subscription history
    const { error: historyError } = await supabase
      .from('subscription_history')
      .insert({
        user_id: userId,
        tier: 'free',
        action: 'cancel',
        amount: 0
      });

    if (historyError) throw historyError;

    return {
      tier: user.subscription_tier,
      status: user.subscription_status
    };
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw error;
  }
};

/**
 * Get subscription history for a user
 */
export const getSubscriptionHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('subscription_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Get subscription history error:', error);
    throw error;
  }
};

/**
 * Check if subscription is expired and update status
 */
export const checkSubscriptionExpiry = async (userId) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_tier, subscription_end_date, subscription_status')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // If premium and end date has passed
    if (user.subscription_tier === 'premium' && user.subscription_end_date) {
      const endDate = new Date(user.subscription_end_date);
      const now = new Date();

      if (now > endDate && user.subscription_status === 'active') {
        // Expire the subscription
        await supabase
          .from('users')
          .update({
            subscription_tier: 'free',
            subscription_status: 'expired'
          })
          .eq('id', userId);

        // Record in history
        await supabase
          .from('subscription_history')
          .insert({
            user_id: userId,
            tier: 'free',
            action: 'expired',
            amount: 0
          });

        return { tier: 'free', status: 'expired' };
      }
    }

    return { tier: user.subscription_tier, status: user.subscription_status };
  } catch (error) {
    console.error('Check subscription expiry error:', error);
    throw error;
  }
};
