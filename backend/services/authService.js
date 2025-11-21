/**
 * Authentication Service
 * Business logic for user authentication
 */

import { supabase } from '../config/database.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/passwordUtils.js';
import { generateToken } from '../utils/jwtUtils.js';

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise<object>} - Created user and token
 */
export const registerUser = async (userData) => {
  const { fullName, email, password, phone, role, studentIdNumber, university, businessName } = userData;

  // DEBUG: Log received data
  console.log('=== REGISTER USER DEBUG ===');
  console.log('Received userData:', {
    fullName,
    email,
    phone,
    role,
    studentIdNumber,
    university,
    businessName
  });

  // Validate role
  if (!['student', 'landlord'].includes(role)) {
    throw new Error('Invalid role. Must be either student or landlord');
  }

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.message);
  }

  // Check if email already exists
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('email')
    .eq('email', email.toLowerCase())
    .single();

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Prepare user data based on role
  const userRecord = {
    full_name: fullName,
    email: email.toLowerCase(),
    password_hash: passwordHash,
    phone: phone || null,
    role: role,
    is_active: true,
    is_verified: false
  };

  // Add student-specific fields
  if (role === 'student') {
    userRecord.student_id_number = studentIdNumber || null;
    userRecord.university = university || null;
    console.log('Adding student fields:', { studentIdNumber, university });
  }

  // Add landlord-specific fields
  if (role === 'landlord') {
    userRecord.business_name = businessName || null;
    console.log('Adding landlord fields:', { businessName });
  }

  console.log('Final userRecord to insert:', userRecord);

  // Create user in database
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert([userRecord])
    .select('id, full_name, email, phone, role, student_id_number, university, business_name, created_at')
    .single();

  console.log('Insert result:', { newUser, insertError });

  if (insertError) {
    throw new Error('Failed to create user account');
  }

  // Generate JWT token
  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role
  });

  return {
    user: newUser,
    token
  };
};

/**
 * Login user
 * @param {object} credentials - User login credentials
 * @returns {Promise<object>} - User data and token
 */
export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user by email
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (fetchError || !user) {
    throw new Error('Invalid email or password');
  }

  // Check if account is active
  if (!user.is_active) {
    throw new Error('Account is deactivated. Please contact support');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  // Return user data (without password hash)
  const { password_hash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token
  };
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} - User data
 */
export const getUserById = async (userId) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, full_name, email, phone, role, is_active, is_verified, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new Error('User not found');
  }

  return user;
};


/**
 * Search users by role and name
 */
export const searchUsers = async (role, searchQuery) => {
  try {
    let query = supabase
      .from('users')
      .select('id, full_name, email, role')
      .eq('role', role)
      .eq('is_active', true);

    if (searchQuery) {
      query = query.ilike('full_name', `%${searchQuery}%`);
    }

    const { data, error } = await query.limit(10);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
};
