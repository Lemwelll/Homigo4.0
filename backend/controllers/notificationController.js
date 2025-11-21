/**
 * Notification Controller
 * Handles HTTP requests for notifications
 */

import * as notificationService from '../services/notificationService.js';

/**
 * Get all notifications for logged-in user
 * GET /notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data, error } = await notificationService.getNotifications(userId);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications'
    });
  }
};

/**
 * Mark notification as read
 * PUT /notifications/:id/read
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await notificationService.markAsRead(id, userId);

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notification as read'
    });
  }
};

/**
 * Mark all notifications as read
 * PUT /notifications/read-all
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await notificationService.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark all notifications as read'
    });
  }
};

/**
 * Delete a notification
 * DELETE /notifications/:id
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await notificationService.deleteNotification(id, userId);

    return res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Delete notification error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete notification'
    });
  }
};
