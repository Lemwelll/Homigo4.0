/**
 * Payment Controller
 * Handles HTTP requests for payment history and transactions
 */

import * as paymentService from '../services/paymentService.js';

/**
 * Get payment history for current user
 * GET /payments/history
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit, offset, payment_type, status, start_date, end_date } = req.query;

    const options = {
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
      paymentType: payment_type,
      status: status,
      startDate: start_date,
      endDate: end_date
    };

    const transactions = await paymentService.getPaymentHistory(userId, options);

    return res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
};

/**
 * Get payment statistics for current user
 * GET /payments/stats
 */
export const getPaymentStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const stats = await paymentService.getPaymentStats(userId);

    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment statistics'
    });
  }
};

/**
 * Get specific transaction details
 * GET /payments/transaction/:id
 */
export const getTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactionId = req.params.id;

    const transaction = await paymentService.getTransactionById(transactionId, userId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    return res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get transaction details'
    });
  }
};

/**
 * Create refund request
 * POST /payments/refund
 */
export const createRefundRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { transaction_id, refund_amount, reason } = req.body;

    if (!transaction_id || !refund_amount || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID, refund amount, and reason are required'
      });
    }

    // Verify the transaction belongs to the user
    const transaction = await paymentService.getTransactionById(transaction_id, userId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if refund amount is valid
    if (parseFloat(refund_amount) > parseFloat(transaction.amount)) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed transaction amount'
      });
    }

    const refund = await paymentService.createRefundRequest(
      transaction_id,
      userId,
      refund_amount,
      reason
    );

    return res.status(201).json({
      success: true,
      message: 'Refund request created successfully',
      data: refund
    });
  } catch (error) {
    console.error('Create refund request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create refund request'
    });
  }
};

/**
 * Get refund history
 * GET /payments/refunds
 */
export const getRefundHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const refunds = await paymentService.getRefundHistory(userId);

    return res.json({
      success: true,
      data: refunds
    });
  } catch (error) {
    console.error('Get refund history error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get refund history'
    });
  }
};

/**
 * Save payment method
 * POST /payments/methods
 */
export const savePaymentMethod = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { method_type, method_name, is_default, expires_at } = req.body;

    if (!method_type || !method_name) {
      return res.status(400).json({
        success: false,
        message: 'Method type and name are required'
      });
    }

    // In a real app, you'd encrypt sensitive details here
    const methodData = {
      methodType: method_type,
      methodName: method_name,
      encryptedDetails: {}, // Would contain encrypted card details
      isDefault: is_default || false,
      expiresAt: expires_at
    };

    const paymentMethod = await paymentService.savePaymentMethod(userId, methodData);

    return res.status(201).json({
      success: true,
      message: 'Payment method saved successfully',
      data: paymentMethod
    });
  } catch (error) {
    console.error('Save payment method error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save payment method'
    });
  }
};

/**
 * Get saved payment methods
 * GET /payments/methods
 */
export const getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.userId;

    const methods = await paymentService.getPaymentMethods(userId);

    return res.json({
      success: true,
      data: methods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment methods'
    });
  }
};

/**
 * Generate receipt for transaction
 * GET /payments/receipt/:id
 */
export const getReceipt = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactionId = req.params.id;

    const transaction = await paymentService.getTransactionById(transactionId, userId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Generate receipt data
    const receipt = {
      transaction_id: transaction.transaction_id,
      amount: transaction.amount,
      payment_type: transaction.payment_type,
      payment_method: transaction.payment_method,
      status: transaction.status,
      date: transaction.created_at,
      processed_date: transaction.processed_at,
      receipt_number: `RCP-${transaction.id}-${Date.now()}`
    };

    return res.json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error('Get receipt error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate receipt'
    });
  }
};
