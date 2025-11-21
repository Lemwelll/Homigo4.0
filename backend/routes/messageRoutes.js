/**
 * Message Routes
 * Defines API endpoints for messaging
 */

import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as messageController from '../controllers/messageController.js';

const router = express.Router();

/**
 * @route   GET /messages/conversations
 * @desc    Get all conversations for logged-in user
 * @access  Private
 */
router.get('/conversations', authenticate, messageController.getConversations);

/**
 * @route   GET /messages/unread/count
 * @desc    Get unread message count
 * @access  Private
 */
router.get('/unread/count', authenticate, messageController.getUnreadCount);

/**
 * @route   GET /messages/:partnerId
 * @desc    Get messages with a specific user
 * @access  Private
 */
router.get('/:partnerId', authenticate, messageController.getMessages);

/**
 * @route   POST /messages
 * @desc    Send a message
 * @access  Private
 */
router.post('/', authenticate, messageController.sendMessage);

/**
 * @route   PUT /messages/read/:partnerId
 * @desc    Mark messages as read
 * @access  Private
 */
router.put('/read/:partnerId', authenticate, messageController.markAsRead);

/**
 * @route   DELETE /messages/:messageId
 * @desc    Delete a message
 * @access  Private
 */
router.delete('/:messageId', authenticate, messageController.deleteMessage);

export default router;
