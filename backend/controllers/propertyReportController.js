import propertyReportService from '../services/propertyReportService.js';

class PropertyReportController {
  // Create a new report
  async createReport(req, res) {
    try {
      const { property_id, reason, description } = req.body;
      const userId = req.user.id;

      if (!property_id || !reason || !description) {
        return res.status(400).json({
          success: false,
          message: 'Property ID, reason, and description are required'
        });
      }

      const report = await propertyReportService.createReport({
        property_id,
        reported_by: userId,
        reason,
        description
      });

      res.status(201).json({
        success: true,
        message: 'Report submitted successfully',
        data: report
      });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit report'
      });
    }
  }

  // Get all reports (admin only)
  async getAllReports(req, res) {
    try {
      const { status, property_id } = req.query;
      
      const reports = await propertyReportService.getAllReports({
        status,
        property_id
      });

      res.json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reports'
      });
    }
  }

  // Get report by ID
  async getReportById(req, res) {
    try {
      const { id } = req.params;
      
      const report = await propertyReportService.getReportById(id);

      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch report'
      });
    }
  }

  // Get user's reports
  async getUserReports(req, res) {
    try {
      const userId = req.user.id;
      
      const reports = await propertyReportService.getReportsByUser(userId);

      res.json({
        success: true,
        count: reports.length,
        data: reports
      });
    } catch (error) {
      console.error('Error fetching user reports:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reports'
      });
    }
  }

  // Resolve a report (admin only)
  async resolveReport(req, res) {
    try {
      const { id } = req.params;
      const { admin_note } = req.body;
      const adminId = req.user.id;

      const report = await propertyReportService.resolveReport(
        id,
        adminId,
        admin_note || ''
      );

      res.json({
        success: true,
        message: 'Report resolved successfully',
        data: report
      });
    } catch (error) {
      console.error('Error resolving report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resolve report'
      });
    }
  }

  // Dismiss a report (admin only)
  async dismissReport(req, res) {
    try {
      const { id } = req.params;
      const { admin_note } = req.body;
      const adminId = req.user.id;

      const report = await propertyReportService.dismissReport(
        id,
        adminId,
        admin_note || ''
      );

      res.json({
        success: true,
        message: 'Report dismissed successfully',
        data: report
      });
    } catch (error) {
      console.error('Error dismissing report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to dismiss report'
      });
    }
  }

  // Get report statistics (admin only)
  async getReportStats(req, res) {
    try {
      const stats = await propertyReportService.getReportStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching report stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }
  }

  // Delete a report (admin only)
  async deleteReport(req, res) {
    try {
      const { id } = req.params;

      await propertyReportService.deleteReport(id);

      res.json({
        success: true,
        message: 'Report deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete report'
      });
    }
  }
}

export default new PropertyReportController();
