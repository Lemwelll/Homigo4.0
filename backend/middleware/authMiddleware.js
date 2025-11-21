/**
 * Authentication Middleware
 * Protects routes and verifies JWT tokens
 */

import { verifyToken } from '../utils/jwtUtils.js';

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Attach user info to request
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Check if user is a landlord
 */
export const isLandlord = (req, res, next) => {
  if (req.user.role !== 'landlord') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Landlord role required.'
    });
  }
  next();
};

/**
 * Check if user is an admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

/**
 * Check if user is either landlord or admin
 */
export const isLandlordOrAdmin = (req, res, next) => {
  if (req.user.role !== 'landlord' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Landlord or Admin role required.'
    });
  }
  next();
};
