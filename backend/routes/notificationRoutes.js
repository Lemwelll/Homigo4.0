/**
 * Notification Routes
 * Defines API endpoints for notifications
 */

import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

/**
 * @route   GET /notifications
 * @desc    Get all notifications for logged-in user
 * @access  Private
 */
router.get('/', authenticate, notificationController.getNotifications);

/**
 * @route   PUT /notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', authenticate, notificationController.markAsRead);

/**
 * @route   PUT /notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', authenticate, notificationController.markAllAsRead);

/**
 * @route   DELETE /notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', authenticate, notificationController.deleteNotification);

export default router;
