import { supabase } from '../config/database.js';

class ReportService {
  // Revenue Reports
  async getRevenueReport(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('payment_history')
        .select('amount, payment_date, payment_type')
        .gte('payment_date', startDate)
        .lte('payment_date', endDate)
        .eq('status', 'completed')
        .order('payment_date');

      if (error) throw error;

      // Handle null or empty data
      if (!data || data.length === 0) {
        return {
          totalRevenue: 0,
          dailyRevenue: [],
          transactionCount: 0
        };
      }

      // Aggregate by date
      const dailyRevenue = {};
      let totalRevenue = 0;

      data.forEach(payment => {
        const date = payment.payment_date.split('T')[0];
        if (!dailyRevenue[date]) {
          dailyRevenue[date] = 0;
        }
        dailyRevenue[date] += parseFloat(payment.amount || 0);
        totalRevenue += parseFloat(payment.amount || 0);
      });

      return {
        totalRevenue,
        dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({
          date,
          amount
        })),
        transactionCount: data.length
      };
    } catch (error) {
      console.error('Error in getRevenueReport:', error);
      throw error;
    }
  }

  // Booking Statistics
  async getBookingStats(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('status, created_at, total_amount')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      // Handle null or empty data
      if (!data || data.length === 0) {
        return {
          total: 0,
          confirmed: 0,
          pending: 0,
          cancelled: 0,
          completed: 0,
          totalRevenue: 0
        };
      }

      const stats = {
        total: data.length,
        confirmed: data.filter(b => b.status === 'confirmed').length,
        pending: data.filter(b => b.status === 'pending').length,
        cancelled: data.filter(b => b.status === 'cancelled').length,
        completed: data.filter(b => b.status === 'completed').length,
        totalRevenue: data
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0)
      };

      return stats;
    } catch (error) {
      console.error('Error in getBookingStats:', error);
      throw error;
    }
  }

  // Property Performance
  async getPropertyPerformance(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          property_id,
          properties (title, monthly_rent),
          total_amount,
          status
        `)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      // Handle null or empty data
      if (!data || data.length === 0) {
        return [];
      }

      // Group by property
      const propertyStats = {};

      data.forEach(booking => {
        const propId = booking.property_id;
        if (!propertyStats[propId]) {
          propertyStats[propId] = {
            property_id: propId,
            title: booking.properties?.title || 'Unknown Property',
            bookings: 0,
            revenue: 0,
            confirmed: 0
          };
        }

        propertyStats[propId].bookings++;
        if (booking.status === 'completed') {
          propertyStats[propId].revenue += parseFloat(booking.total_amount || 0);
        }
        if (booking.status === 'confirmed') {
          propertyStats[propId].confirmed++;
        }
      });

      return Object.values(propertyStats).sort((a, b) => b.revenue - a.revenue);
    } catch (error) {
      console.error('Error in getPropertyPerformance:', error);
      throw error;
    }
  }

  // User Activity Report
  async getUserActivityReport(startDate, endDate) {
    try {
      // Get student registrations
      const { data: students, error: studentsError } = await supabase
        .from('users')
        .select('created_at')
        .eq('role', 'student')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (studentsError) throw studentsError;

      // Get landlord registrations
      const { data: landlords, error: landlordsError } = await supabase
        .from('users')
        .select('created_at')
        .eq('role', 'landlord')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (landlordsError) throw landlordsError;

      // Get total active users (check if is_active column exists, fallback to all users)
      const { count: activeStudents } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      const { count: activeLandlords } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'landlord');

      return {
        newStudents: students?.length || 0,
        newLandlords: landlords?.length || 0,
        totalActiveStudents: activeStudents || 0,
        totalActiveLandlords: activeLandlords || 0,
        totalNewUsers: (students?.length || 0) + (landlords?.length || 0)
      };
    } catch (error) {
      console.error('Error in getUserActivityReport:', error);
      throw error;
    }
  }

  // Subscription Report
  async getSubscriptionReport() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier, subscription_status')
        .eq('role', 'student');

      if (error) throw error;

      // Handle null or empty data
      if (!data || data.length === 0) {
        return {
          free: 0,
          basic: 0,
          premium: 0,
          active: 0,
          expired: 0,
          cancelled: 0
        };
      }

      const stats = {
        free: data.filter(s => s.subscription_tier === 'free' || !s.subscription_tier).length,
        basic: data.filter(s => s.subscription_tier === 'basic').length,
        premium: data.filter(s => s.subscription_tier === 'premium').length,
        active: data.filter(s => s.subscription_status === 'active').length,
        expired: data.filter(s => s.subscription_status === 'expired').length,
        cancelled: data.filter(s => s.subscription_status === 'cancelled').length
      };

      return stats;
    } catch (error) {
      console.error('Error in getSubscriptionReport:', error);
      throw error;
    }
  }

  // Verification Status Report
  async getVerificationReport() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_verified, created_at')
        .eq('role', 'landlord');

      if (error) throw error;

      const stats = {
        pending: data.filter(l => !l.is_verified).length,
        verified: data.filter(l => l.is_verified).length,
        rejected: 0, // We don't have a rejected status in the current schema
        total: data.length
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Generate comprehensive dashboard report
  async getDashboardReport(startDate, endDate) {
    try {
      const [
        revenue,
        bookings,
        properties,
        users,
        subscriptions,
        verifications
      ] = await Promise.all([
        this.getRevenueReport(startDate, endDate),
        this.getBookingStats(startDate, endDate),
        this.getPropertyPerformance(startDate, endDate),
        this.getUserActivityReport(startDate, endDate),
        this.getSubscriptionReport(),
        this.getVerificationReport()
      ]);

      return {
        revenue,
        bookings,
        topProperties: properties.slice(0, 10),
        users,
        subscriptions,
        verifications,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ReportService();
