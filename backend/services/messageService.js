/**
 * Message Service
 * Handles all messaging operations
 */

import { supabase } from '../config/database.js';
import * as notificationService from './notificationService.js';

/**
 * Get all conversations for a user
 */
export const getConversations = async (userId) => {
  try {
    // Get all unique conversations (users the current user has messaged with)
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, full_name, email, role),
        receiver:users!messages_receiver_id_fkey(id, full_name, email, role),
        property:properties(id, title, location)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group messages by conversation partner
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      const partner = msg.sender_id === userId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partnerId,
          partnerName: partner.full_name,
          partnerEmail: partner.email,
          partnerRole: partner.role,
          lastMessage: msg.message,
          lastMessageTime: msg.created_at,
          unreadCount: 0,
          property: msg.property
        });
      }

      // Count unread messages from this partner
      if (msg.receiver_id === userId && !msg.is_read) {
        const conv = conversationsMap.get(partnerId);
        conv.unreadCount++;
      }
    });

    return Array.from(conversationsMap.values());
  } catch (error) {
    console.error('Get conversations error:', error);
    throw error;
  }
};

/**
 * Get messages between two users
 */
export const getMessages = async (userId, partnerId) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, full_name, email, role),
        receiver:users!messages_receiver_id_fkey(id, full_name, email, role),
        property:properties(id, title, location)
      `)
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Mark messages as read
    await markMessagesAsRead(userId, partnerId);

    return messages;
  } catch (error) {
    console.error('Get messages error:', error);
    throw error;
  }
};

/**
 * Send a message
 */
export const sendMessage = async (senderId, receiverId, message, propertyId = null) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        property_id: propertyId,
        is_read: false
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, full_name, email, role),
        receiver:users!messages_receiver_id_fkey(id, full_name, email, role),
        property:properties(id, title, location)
      `)
      .single();

    if (error) throw error;

    // Send notification to receiver about new message
    try {
      const senderName = data.sender?.full_name || 'Someone';
      const propertyTitle = data.property?.title || null;
      await notificationService.notifyNewMessage(receiverId, senderName, propertyTitle);
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
      // Don't throw - message was sent successfully
    }

    return data;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (userId, partnerId) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('receiver_id', userId)
      .eq('sender_id', partnerId)
      .eq('is_read', false);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Mark messages as read error:', error);
    throw error;
  }
};

/**
 * Get unread message count
 */
export const getUnreadCount = async (userId) => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error('Get unread count error:', error);
    throw error;
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId, userId) => {
  try {
    // Verify the user is the sender
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('sender_id')
      .eq('id', messageId)
      .single();

    if (fetchError) throw fetchError;

    if (message.sender_id !== userId) {
      throw new Error('Unauthorized to delete this message');
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Delete message error:', error);
    throw error;
  }
};
