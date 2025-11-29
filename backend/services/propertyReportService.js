import { supabase } from '../config/database.js';

class PropertyReportService {
  // Create a new property report
  async createReport(reportData) {
    try {
      const { data, error } = await supabase
        .from('property_reports')
        .insert([{
          property_id: reportData.property_id,
          reported_by: reportData.reported_by,
          reason: reportData.reason,
          description: reportData.description
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get all reports (admin only)
  async getAllReports(filters = {}) {
    try {
      let query = supabase
        .from('property_reports')
        .select(`
          *,
          properties (
            id,
            title,
            location,
            property_images (image_url)
          ),
          users!property_reports_reported_by_fkey (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.property_id) {
        query = query.eq('property_id', filters.property_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get report by ID
  async getReportById(reportId) {
    try {
      const { data, error } = await supabase
        .from('property_reports')
        .select(`
          *,
          properties (
            id,
            title,
            location,
            description,
            property_images (image_url)
          ),
          users!property_reports_reported_by_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq('id', reportId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get reports by user
  async getReportsByUser(userId) {
    try {
      const { data, error } = await supabase
        .from('property_reports')
        .select(`
          *,
          properties (
            id,
            title,
            location
          )
        `)
        .eq('reported_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Resolve a report (admin only)
  async resolveReport(reportId, adminId, adminNote = '') {
    try {
      const { data, error } = await supabase
        .from('property_reports')
        .update({
          status: 'resolved',
          resolved_by: adminId,
          resolved_at: new Date().toISOString(),
          admin_note: adminNote
        })
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Dismiss a report (admin only)
  async dismissReport(reportId, adminId, adminNote = '') {
    try {
      const { data, error } = await supabase
        .from('property_reports')
        .update({
          status: 'dismissed',
          resolved_by: adminId,
          resolved_at: new Date().toISOString(),
          admin_note: adminNote
        })
        .eq('id', reportId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get report statistics
  async getReportStats() {
    try {
      const { data, error } = await supabase
        .from('property_reports')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        resolved: data.filter(r => r.status === 'resolved').length,
        dismissed: data.filter(r => r.status === 'dismissed').length
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Delete a report (admin only)
  async deleteReport(reportId) {
    try {
      const { error } = await supabase
        .from('property_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default new PropertyReportService();
