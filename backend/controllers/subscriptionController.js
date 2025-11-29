/**
 * Subscription Controller
 * Handles HTTP requests for subscription management
 */

import * as subscriptionService from '../services/subscriptionService.js';

/**
 * Get current subscription status
 * GET /subscriptions/status
 */
export const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check for expiry first
    await subscriptionService.checkSubscriptionExpiry(userId);

    // Get current status
    const subscription = await subscriptionService.getUserSubscription(userId);

    return res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get subscription status'
    });
  }
};

/**
 * Upgrade to premium
 * POST /subscriptions/upgrade
 */
export const upgradeToPremium = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentMethod, amount, cardDetails, gcashNumber } = req.body;

    // Validate payment data
    if (!paymentMethod || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment method and amount are required'
      });
    }

    // Generate mock transaction ID (in production, this comes from payment gateway)
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const paymentData = {
      paymentMethod,
      amount,
      transactionId
    };

    const subscription = await subscriptionService.upgradeToPremium(userId, paymentData);

    return res.status(200).json({
      success: true,
      message: 'Successfully upgraded to premium',
      data: subscription
    });
  } catch (error) {
    console.error('Upgrade to premium error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upgrade subscription'
    });
  }
};

/**
 * Cancel subscription
 * POST /subscriptions/cancel
 */
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;

    const subscription = await subscriptionService.cancelSubscription(userId);

    return res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
};

/**
 * Get subscription history
 * GET /subscriptions/history
 */
export const getSubscriptionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const history = await subscriptionService.getSubscriptionHistory(userId);

    return res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get subscription history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get subscription history'
    });
  }
};
