/**
 * Escrow Controller
 * Handles HTTP requests for escrow management
 */

import * as escrowService from '../services/escrowService.js';

/**
 * Get landlord's escrow transactions
 * GET /escrow/landlord
 */
export const getLandlordEscrow = async (req, res) => {
  try {
    const landlordId = req.user.userId;
    const escrows = await escrowService.getLandlordEscrow(landlordId);

    return res.status(200).json({
      success: true,
      data: escrows
    });

  } catch (error) {
    console.error('Get landlord escrow error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch escrow transactions'
    });
  }
};

/**
 * Get escrow transaction by booking ID
 * GET /escrow/booking/:bookingId
 */
export const getEscrowByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const escrow = await escrowService.getEscrowByBookingId(bookingId);

    if (!escrow) {
      return res.status(200).json({
        success: false,
        message: 'Escrow transaction not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      data: escrow
    });

  } catch (error) {
    console.error('Get escrow error:', error.message);
    // Return 200 with success: false instead of 500 for missing escrow
    return res.status(200).json({
      success: false,
      message: error.message || 'Escrow transaction not found',
      data: null
    });
  }
};

/**
 * Get student's escrow transactions
 * GET /escrow/student
 */
export const getStudentEscrow = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const escrows = await escrowService.getStudentEscrow(studentId);

    return res.status(200).json({
      success: true,
      data: escrows
    });

  } catch (error) {
    console.error('Get student escrow error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch escrow transactions'
    });
  }
};

/**
 * Accept payment (Release escrow to landlord)
 * POST /escrow/:escrowId/accept
 */
export const acceptPayment = async (req, res) => {
  try {
    const { escrowId } = req.params;
    const landlordId = req.user.userId;

    const result = await escrowService.releaseEscrowById(escrowId, landlordId);

    return res.status(200).json({
      success: true,
      message: 'Payment accepted and released successfully',
      data: result
    });

  } catch (error) {
    console.error('Accept payment error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept payment'
    });
  }
};

/**
 * Decline payment (Refund escrow to student)
 * POST /escrow/:escrowId/decline
 */
export const declinePayment = async (req, res) => {
  try {
    const { escrowId } = req.params;
    const landlordId = req.user.userId;
    const { reason } = req.body;

    const result = await escrowService.refundEscrowById(escrowId, landlordId, reason);

    return res.status(200).json({
      success: true,
      message: 'Payment declined and refunded successfully',
      data: result
    });

  } catch (error) {
    console.error('Decline payment error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to decline payment'
    });
  }
};
