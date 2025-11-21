/**
 * Notification Service
 * Creates in-app notifications for users
 */

import { supabase } from '../config/database.js';

/**
 * Create a notification
 */
export const createNotification = async (notificationData) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        type: notificationData.type,
        sender_id: notificationData.senderId || null,
        receiver_id: notificationData.receiverId,
        title: notificationData.title,
        message: notificationData.message,
        action_url: notificationData.actionUrl || null,
        is_read: false
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

/**
 * Notify landlord of new inquiry (booking/reservation)
 */
export const notifyNewInquiry = async (landlordId, studentName, propertyTitle, type = 'booking') => {
  return createNotification({
    type: type === 'booking' ? 'booking_created' : 'reservation_created',
    receiverId: landlordId,
    title: 'New Inquiry Received',
    message: `${studentName} is interested in "${propertyTitle}"`,
    actionUrl: type === 'booking' ? '/landlord/bookings' : '/landlord/reservations'
  });
};

/**
 * Notify student of booking/reservation status change
 */
export const notifyInquiryStatus = async (studentId, propertyTitle, status, type = 'booking') => {
  const statusMessages = {
    approved: `Your ${type} for "${propertyTitle}" has been approved!`,
    rejected: `Your ${type} for "${propertyTitle}" was declined.`,
    cancelled: `Your ${type} for "${propertyTitle}" has been cancelled.`
  };

  return createNotification({
    type: type === 'booking' ? `booking_${status}` : `reservation_${status}`,
    receiverId: studentId,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: statusMessages[status],
    actionUrl: `/student/${type}s`
  });
};

/**
 * Notify user of new message
 */
export const notifyNewMessage = async (receiverId, senderName, propertyTitle = null) => {
  // Get receiver's role to set correct action URL
  const { data: receiver } = await supabase
    .from('users')
    .select('role')
    .eq('id', receiverId)
    .single();

  const actionUrl = receiver?.role === 'student' ? '/student/messages' : '/landlord/messages';

  return createNotification({
    type: 'message_received',
    receiverId: receiverId,
    title: 'New Message',
    message: propertyTitle 
      ? `${senderName} sent you a message about "${propertyTitle}"`
      : `${senderName} sent you a message`,
    actionUrl: actionUrl
  });
};

/**
 * Notify student of price drop on favorited property
 */
export const notifyPriceDrop = async (studentId, propertyTitle, oldPrice, newPrice) => {
  const savings = oldPrice - newPrice;
  return createNotification({
    type: 'property_price_drop',
    receiverId: studentId,
    title: 'Price Drop Alert!',
    message: `"${propertyTitle}" price dropped by ₱${savings.toLocaleString()}! Now ₱${newPrice.toLocaleString()}/month`,
    actionUrl: '/student/favorites'
  });
};

/**
 * Notify landlord of property verification status
 */
export const notifyPropertyVerification = async (landlordId, propertyTitle, status) => {
  const messages = {
    verified: `Your property "${propertyTitle}" has been verified and is now live!`,
    rejected: `Your property "${propertyTitle}" verification was rejected. Please review and resubmit.`
  };

  return createNotification({
    type: status === 'verified' ? 'property_verified' : 'property_rejected',
    receiverId: landlordId,
    title: `Property ${status === 'verified' ? 'Verified' : 'Rejected'}`,
    message: messages[status],
    actionUrl: '/landlord/properties'
  });
};

/**
 * Notify about payment/escrow events
 */
export const notifyPayment = async (userId, title, message, actionUrl) => {
  return createNotification({
    type: 'payment_received',
    receiverId: userId,
    title: title,
    message: message,
    actionUrl: actionUrl
  });
};


/**
 * Get all notifications for a user
 */
export const getNotifications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('receiver_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Get notifications error:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId, userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('receiver_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('receiver_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Mark all as read error:', error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId, userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('receiver_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete notification error:', error);
    throw error;
  }
};
