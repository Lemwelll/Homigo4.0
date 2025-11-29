import reportService from '../services/reportService.js';

class ReportController {
  async getRevenueReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const report = await reportService.getRevenueReport(startDate, endDate);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error generating revenue report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate revenue report'
      });
    }
  }

  async getBookingStats(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const stats = await reportService.getBookingStats(startDate, endDate);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error generating booking stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate booking statistics'
      });
    }
  }

  async getPropertyPerformance(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const performance = await reportService.getPropertyPerformance(startDate, endDate);

      res.json({
        success: true,
        data: performance
      });
    } catch (error) {
      console.error('Error generating property performance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate property performance report'
      });
    }
  }

  async getUserActivityReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const activity = await reportService.getUserActivityReport(startDate, endDate);

      res.json({
        success: true,
        data: activity
      });
    } catch (error) {
      console.error('Error generating user activity report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate user activity report'
      });
    }
  }

  async getSubscriptionReport(req, res) {
    try {
      const report = await reportService.getSubscriptionReport();

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error generating subscription report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate subscription report'
      });
    }
  }

  async getVerificationReport(req, res) {
    try {
      const report = await reportService.getVerificationReport();

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error generating verification report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate verification report'
      });
    }
  }

  async getDashboardReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const report = await reportService.getDashboardReport(startDate, endDate);

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error generating dashboard report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate dashboard report'
      });
    }
  }

  async exportReport(req, res) {
    try {
      const { type, startDate, endDate } = req.query;

      if (!type || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Report type, start date, and end date are required'
        });
      }

      let data;
      let filename;

      switch (type) {
        case 'revenue':
          data = await reportService.getRevenueReport(startDate, endDate);
          filename = `revenue_report_${startDate}_${endDate}.json`;
          break;
        case 'bookings':
          data = await reportService.getBookingStats(startDate, endDate);
          filename = `booking_stats_${startDate}_${endDate}.json`;
          break;
        case 'properties':
          data = await reportService.getPropertyPerformance(startDate, endDate);
          filename = `property_performance_${startDate}_${endDate}.json`;
          break;
        case 'dashboard':
          data = await reportService.getDashboardReport(startDate, endDate);
          filename = `dashboard_report_${startDate}_${endDate}.json`;
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid report type'
          });
      }

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.json(data);
    } catch (error) {
      console.error('Error exporting report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export report'
      });
    }
  }
}

export default new ReportController();
