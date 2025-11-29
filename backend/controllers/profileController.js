/**
 * Profile Controller
 * Handles HTTP requests for user profile operations
 */

import * as profileService from '../services/profileService.js';

/**
 * Get current user's profile
 * GET /profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await profileService.getUserProfile(userId);

    return res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get profile'
    });
  }
};

/**
 * Update current user's profile
 * PUT /profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    // Validate required fields if email is being updated
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
    }

    const updatedProfile = await profileService.updateUserProfile(userId, updates);

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle unique constraint violations (e.g., duplicate email)
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

/**
 * Update profile picture
 * POST /profile/picture
 */
export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { pictureUrl } = req.body;

    if (!pictureUrl) {
      return res.status(400).json({
        success: false,
        message: 'Picture URL is required'
      });
    }

    const updatedProfile = await profileService.updateProfilePicture(userId, pictureUrl);

    return res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile picture'
    });
  }
};

/**
 * Get user statistics
 * GET /profile/stats
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    const stats = await profileService.getUserStats(userId, userRole);

    return res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
};

/**
 * Change password
 * POST /profile/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    await profileService.changePassword(userId, currentPassword, newPassword);

    return res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    
    if (error.message === 'Current password is incorrect') {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};
