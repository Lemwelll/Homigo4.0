/**
 * Message Controller
 * Handles HTTP requests for messaging
 */

import * as messageService from '../services/messageService.js';
import { createNotification } from '../services/notificationService.js';

/**
 * Get all conversations for the logged-in user
 * GET /messages/conversations
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await messageService.getConversations(userId);

    return res.status(200).json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch conversations'
    });
  }
};

/**
 * Get messages with a specific user
 * GET /messages/:partnerId
 */
export const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { partnerId } = req.params;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: 'Partner ID is required'
      });
    }

    const messages = await messageService.getMessages(userId, partnerId);

    return res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch messages'
    });
  }
};

/**
 * Send a message
 * POST /messages
 */
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiver_id, message, property_id } = req.body;

    // Validate input
    if (!receiver_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and message are required'
      });
    }

    if (message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    const sentMessage = await messageService.sendMessage(
      senderId,
      receiver_id,
      message.trim(),
      property_id || null
    );

    // Create notification for receiver
    try {
      await createNotification({
        type: 'message',
        senderId: senderId,
        receiverId: receiver_id,
        title: 'New Message',
        message: message.trim().substring(0, 100),
        actionUrl: '/messages'
      });
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
      // Don't fail the message send if notification fails
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: sentMessage
    });
  } catch (error) {
    console.error('Send message error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message'
    });
  }
};

/**
 * Mark messages as read
 * PUT /messages/read/:partnerId
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { partnerId } = req.params;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: 'Partner ID is required'
      });
    }

    await messageService.markMessagesAsRead(userId, partnerId);

    return res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark messages as read'
    });
  }
};

/**
 * Get unread message count
 * GET /messages/unread/count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const count = await messageService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Get unread count error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get unread count'
    });
  }
};

/**
 * Delete a message
 * DELETE /messages/:messageId
 */
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: 'Message ID is required'
      });
    }

    await messageService.deleteMessage(messageId, userId);

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error.message);
    
    if (error.message === 'Unauthorized to delete this message') {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete message'
    });
  }
};
