import { supabase } from '../config/database.js';

class PreferencesService {
  // Get user's notification preferences
  async getPreferences(userId) {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If no preferences exist, create default ones
    if (error && error.code === 'PGRST116') {
      return await this.createDefaultPreferences(userId);
    }

    if (error) throw error;
    return data;
  }

  // Create default preferences for a user
  async createDefaultPreferences(userId) {
    const { data, error } = await supabase
      .from('notification_preferences')
      .insert({ user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update user's notification preferences
  async updatePreferences(userId, preferences) {
    const {
      emailNewProperties,
      emailNewInquiries,
      emailMessages,
      emailReservations,
      emailBookings,
      emailPayments,
      emailReviews,
      emailMarketing,
      smsMessages,
      smsUrgent,
      smsReservations,
      pushMessages,
      pushReservations,
      pushBookings,
      weeklyReports,
      priceDropAlerts
    } = preferences;

    // First, ensure preferences exist
    await this.getPreferences(userId);

    const updateFields = {};
    if (emailNewProperties !== undefined) updateFields.email_new_properties = emailNewProperties;
    if (emailNewInquiries !== undefined) updateFields.email_new_inquiries = emailNewInquiries;
    if (emailMessages !== undefined) updateFields.email_messages = emailMessages;
    if (emailReservations !== undefined) updateFields.email_reservations = emailReservations;
    if (emailBookings !== undefined) updateFields.email_bookings = emailBookings;
    if (emailPayments !== undefined) updateFields.email_payments = emailPayments;
    if (emailReviews !== undefined) updateFields.email_reviews = emailReviews;
    if (emailMarketing !== undefined) updateFields.email_marketing = emailMarketing;
    if (smsMessages !== undefined) updateFields.sms_messages = smsMessages;
    if (smsUrgent !== undefined) updateFields.sms_urgent = smsUrgent;
    if (smsReservations !== undefined) updateFields.sms_reservations = smsReservations;
    if (pushMessages !== undefined) updateFields.push_messages = pushMessages;
    if (pushReservations !== undefined) updateFields.push_reservations = pushReservations;
    if (pushBookings !== undefined) updateFields.push_bookings = pushBookings;
    if (weeklyReports !== undefined) updateFields.weekly_reports = weeklyReports;
    if (priceDropAlerts !== undefined) updateFields.price_drop_alerts = priceDropAlerts;
    updateFields.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('notification_preferences')
      .update(updateFields)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Check if user has specific notification enabled
  async isNotificationEnabled(userId, notificationType) {
    const preferences = await this.getPreferences(userId);
    return preferences[notificationType] || false;
  }
}

export default new PreferencesService();
