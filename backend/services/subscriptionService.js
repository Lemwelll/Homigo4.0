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
    // Check subscriptions table first
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('tier, status, start_date, end_date')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // If subscription found in subscriptions table, return it
    if (subscription && !subError) {
      console.log('✅ Found active subscription:', subscription);
      return {
        tier: subscription.tier || 'free',
        startDate: subscription.start_date,
        endDate: subscription.end_date,
        status: subscription.status || 'active'
      };
    }

    // Fallback: Check users table for legacy subscription data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('subscription_tier, subscription_start_date, subscription_end_date, subscription_status')
      .eq('id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    // Return user data or default to free
    if (userData && userData.subscription_tier) {
      console.log('✅ Found subscription in users table:', userData.subscription_tier);
      return {
        tier: userData.subscription_tier || 'free',
        startDate: userData.subscription_start_date,
        endDate: userData.subscription_end_date,
        status: userData.subscription_status || 'active'
      };
    }

    // Default to free tier
    console.log('ℹ️ No subscription found, defaulting to free');
    return {
      tier: 'free',
      startDate: null,
      endDate: null,
      status: 'active'
    };
  } catch (error) {
    console.error('Get subscription error:', error);
    // Return free tier on error instead of throwing
    return {
      tier: 'free',
      startDate: null,
      endDate: null,
      status: 'active'
    };
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

    // 2. Create/Update subscription in subscriptions table
    console.log('🔄 Creating subscription record...');
    
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        tier: 'premium',
        status: 'active',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (subscriptionError) {
      console.error('❌ Subscription creation error:', subscriptionError);
      throw new Error('Failed to create subscription: ' + subscriptionError.message);
    }

    console.log('✅ Subscription created in subscriptions table:', subscription.id);

    // 3. Also update users table for backward compatibility
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
      console.error('⚠️ User update error (non-critical):', updateError);
      // Don't throw - subscriptions table is the source of truth
    } else {
      console.log('✅ User table also updated for backward compatibility');
    }

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
    console.log('🔄 Cancelling subscription for user:', userId);
    
    // 1. Update subscription in subscriptions table
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        end_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'active')
      .select()
      .maybeSingle(); // Use maybeSingle() to handle 0 or 1 rows

    if (subscriptionError) {
      console.error('❌ Subscription cancellation error:', subscriptionError);
      throw new Error('Failed to cancel subscription: ' + subscriptionError.message);
    }

    if (!subscription) {
      console.log('⚠️ No active subscription found to cancel');
      // Return a default response instead of erroring
      return {
        tier: 'free',
        status: 'cancelled',
        message: 'No active subscription found'
      };
    }

    console.log('✅ Subscription cancelled in subscriptions table');

    // 2. Also update users table for backward compatibility
    const { data: user, error: updateError } = await supabase
      .from('users')
      .update({
        subscription_tier: 'free',
        subscription_status: 'cancelled',
        subscription_end_date: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .maybeSingle(); // Use maybeSingle() here too

    if (updateError) {
      console.error('⚠️ User update error (non-critical):', updateError);
      // Don't throw - subscriptions table is the source of truth
    } else {
      console.log('✅ User table also updated for backward compatibility');
    }

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
