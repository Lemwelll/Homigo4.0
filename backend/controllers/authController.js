/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

import * as authService from '../services/authService.js';
import { validationResult } from 'express-validator';
import { supabase } from '../config/database.js';

const { registerUser, loginUser } = authService;

/**
 * Register a new user
 * POST /auth/signup
 */
export const signup = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { fullName, email, password, phone, role, studentIdNumber, university, businessName } = req.body;

    // Call service to register user
    const result = await registerUser({
      fullName,
      email,
      password,
      phone,
      role,
      studentIdNumber,
      university,
      businessName
    });

    // Send success response
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        token: result.token
      }
    });

  } catch (error) {
    console.error('Signup error:', error.message);
    
    // Handle specific errors
    if (error.message === 'Email already registered') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('Password')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again'
    });
  }
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Call service to login user
    const result = await loginUser({ email, password });

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    
    // Generic error for security (don't reveal if email exists)
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
};

/**
 * Get user profile
 * GET /auth/profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data, error } = await supabase
      .from('users')
      .select(`
        id, full_name, email, phone, role, student_id_number, university, business_name, 
        is_verified, created_at, tin_number, business_address, residential_address,
        emergency_contact, valid_id_type, valid_id_number, bank_name, 
        bank_account_number, bank_account_name
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Get profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

/**
 * Update user profile
 * PUT /auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      full_name,
      phone,
      business_name,
      tin_number,
      business_address,
      residential_address,
      emergency_contact,
      valid_id_type,
      valid_id_number,
      bank_name,
      bank_account_number,
      bank_account_name
    } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (business_name !== undefined) updateData.business_name = business_name;
    if (tin_number !== undefined) updateData.tin_number = tin_number;
    if (business_address !== undefined) updateData.business_address = business_address;
    if (residential_address !== undefined) updateData.residential_address = residential_address;
    if (emergency_contact !== undefined) updateData.emergency_contact = emergency_contact;
    if (valid_id_type !== undefined) updateData.valid_id_type = valid_id_type;
    if (valid_id_number !== undefined) updateData.valid_id_number = valid_id_number;
    if (bank_name !== undefined) updateData.bank_name = bank_name;
    if (bank_account_number !== undefined) updateData.bank_account_number = bank_account_number;
    if (bank_account_name !== undefined) updateData.bank_account_name = bank_account_name;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update profile'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: data
    });

  } catch (error) {
    console.error('Update profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};


/**
 * Search users by role and name
 */
export const searchUsers = async (req, res) => {
  try {
    const { role, search } = req.query;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role parameter is required'
      });
    }

    const users = await authService.searchUsers(role, search || '');

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Search users error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to search users'
    });
  }
};
