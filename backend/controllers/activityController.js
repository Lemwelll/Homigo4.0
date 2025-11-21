/**
 * Activity Controller
 * Handles activity-related HTTP requests
 */

import * as activityService from '../services/activityService.js';

/**
 * Track property view
 */
export const trackView = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const result = await activityService.trackPropertyView(propertyId);

    res.json({
      success: true,
      message: 'View tracked successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get landlord activities
 */
export const getLandlordActivities = async (req, res, next) => {
  try {
    const landlordId = req.user.userId; // Use userId from auth middleware

    const activities = await activityService.getLandlordActivities(landlordId);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};
