/**
 * Admin Controller
 * Handles admin-specific operations
 */

import { supabase } from '../config/database.js';

/**
 * Get all landlords
 * @route GET /admin/landlords
 */
export const getAllLandlords = async (req, res) => {
  try {
    // Get all landlords
    const { data: landlords, error: landlordsError } = await supabase
      .from('users')
      .select(`
        id, full_name, email, phone, business_name, created_at, is_verified,
        tin_number, business_address, residential_address, emergency_contact,
        valid_id_type, valid_id_number, bank_name, bank_account_number, bank_account_name,
        verified_at, verified_by
      `)
      .eq('role', 'landlord')
      .order('created_at', { ascending: false });

    if (landlordsError) throw landlordsError;

    // Get property counts for each landlord
    const landlordsWithStats = await Promise.all(
      landlords.map(async (landlord) => {
        const { data: properties, error: propsError } = await supabase
          .from('properties')
          .select('id, verification_status')
          .eq('landlord_id', landlord.id);

        if (propsError) {
          console.error('Error fetching properties for landlord:', landlord.id, propsError);
          return {
            ...landlord,
            total_properties: 0,
            verified_properties: 0,
            pending_properties: 0
          };
        }

        return {
          ...landlord,
          total_properties: properties.length,
          verified_properties: properties.filter(p => p.verification_status === 'verified').length,
          pending_properties: properties.filter(p => p.verification_status === 'pending_verification').length
        };
      })
    );

    res.status(200).json({
      success: true,
      data: landlordsWithStats,
      count: landlordsWithStats.length
    });
  } catch (error) {
    console.error('Error fetching landlords:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch landlords',
      error: error.message
    });
  }
};

/**
 * Get all students
 * @route GET /admin/students
 */
export const getAllStudents = async (req, res) => {
  try {
    // Get all students
    const { data: students, error: studentsError } = await supabase
      .from('users')
      .select('id, full_name, email, phone, student_id_number, university, created_at, is_verified')
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    if (studentsError) throw studentsError;

    // Get stats for each student
    const studentsWithStats = await Promise.all(
      students.map(async (student) => {
        const [favoritesResult, reservationsResult, bookingsResult] = await Promise.all([
          supabase.from('favorites').select('id').eq('student_id', student.id),
          supabase.from('reservations').select('id').eq('student_id', student.id),
          supabase.from('bookings').select('id').eq('student_id', student.id)
        ]);

        return {
          ...student,
          total_favorites: favoritesResult.data?.length || 0,
          total_reservations: reservationsResult.data?.length || 0,
          total_bookings: bookingsResult.data?.length || 0
        };
      })
    );

    res.status(200).json({
      success: true,
      data: studentsWithStats,
      count: studentsWithStats.length
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

/**
 * Get platform statistics
 * @route GET /admin/stats
 */
export const getPlatformStats = async (req, res) => {
  try {
    // Get all data in parallel
    const [usersResult, propertiesResult, bookingsResult, reservationsResult] = await Promise.all([
      supabase.from('users').select('role').in('role', ['student', 'landlord']),
      supabase.from('properties').select('verification_status'),
      supabase.from('bookings').select('status'),
      supabase.from('reservations').select('status')
    ]);

    // Calculate user stats
    const users = {
      students: usersResult.data?.filter(u => u.role === 'student').length || 0,
      landlords: usersResult.data?.filter(u => u.role === 'landlord').length || 0
    };

    // Calculate property stats
    const properties = {
      total: propertiesResult.data?.length || 0,
      verified: propertiesResult.data?.filter(p => p.verification_status === 'verified').length || 0,
      pending: propertiesResult.data?.filter(p => p.verification_status === 'pending_verification').length || 0,
      rejected: propertiesResult.data?.filter(p => p.verification_status === 'rejected').length || 0
    };

    // Calculate booking stats
    const bookings = {
      total_bookings: bookingsResult.data?.length || 0,
      pending_bookings: bookingsResult.data?.filter(b => b.status === 'pending').length || 0,
      approved_bookings: bookingsResult.data?.filter(b => b.status === 'approved').length || 0,
      rejected_bookings: bookingsResult.data?.filter(b => b.status === 'rejected').length || 0
    };

    // Calculate reservation stats
    const reservations = {
      total_reservations: reservationsResult.data?.length || 0,
      pending_reservations: reservationsResult.data?.filter(r => r.status === 'pending').length || 0,
      accepted_reservations: reservationsResult.data?.filter(r => r.status === 'accepted').length || 0,
      rejected_reservations: reservationsResult.data?.filter(r => r.status === 'rejected').length || 0,
      expired_reservations: reservationsResult.data?.filter(r => r.status === 'expired').length || 0
    };

    res.status(200).json({
      success: true,
      data: {
        users,
        properties,
        bookings,
        reservations
      }
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform statistics',
      error: error.message
    });
  }
};

/**
 * Get dashboard analytics (comprehensive)
 * @route GET /admin/dashboard
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Set default date range if not provided (last 30 days)
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log('Fetching dashboard analytics for:', { start, end });

    // Fetch all data in parallel
    const [
      paymentsResult,
      bookingsResult,
      usersResult,
      landlordsResult,
      propertiesResult,
      subscriptionsResult
    ] = await Promise.all([
      // Revenue data
      supabase
        .from('payment_history')
        .select('amount, payment_date')
        .gte('payment_date', start)
        .lte('payment_date', end)
        .eq('status', 'completed'),
      
      // Bookings data
      supabase
        .from('bookings')
        .select('id, status, created_at, total_amount, property_id, properties(title)')
        .gte('created_at', start)
        .lte('created_at', end),
      
      // New users
      supabase
        .from('users')
        .select('id, role, created_at')
        .gte('created_at', start)
        .lte('created_at', end)
        .in('role', ['student', 'landlord']),
      
      // All landlords for verification status
      supabase
        .from('users')
        .select('id, is_verified')
        .eq('role', 'landlord'),
      
      // All properties
      supabase
        .from('properties')
        .select('id'),
      
      // Subscription data
      supabase
        .from('users')
        .select('subscription_tier')
        .eq('role', 'student')
    ]);

    // Process revenue
    const revenue = {
      totalRevenue: paymentsResult.data?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0,
      transactionCount: paymentsResult.data?.length || 0,
      dailyRevenue: []
    };

    // Process bookings
    const bookings = {
      total: bookingsResult.data?.length || 0,
      confirmed: bookingsResult.data?.filter(b => b.status === 'confirmed').length || 0,
      pending: bookingsResult.data?.filter(b => b.status === 'pending').length || 0,
      completed: bookingsResult.data?.filter(b => b.status === 'completed').length || 0,
      cancelled: bookingsResult.data?.filter(b => b.status === 'cancelled').length || 0
    };

    // Process users
    const users = {
      newStudents: usersResult.data?.filter(u => u.role === 'student').length || 0,
      newLandlords: usersResult.data?.filter(u => u.role === 'landlord').length || 0,
      totalActiveStudents: usersResult.data?.filter(u => u.role === 'student').length || 0,
      totalActiveLandlords: usersResult.data?.filter(u => u.role === 'landlord').length || 0,
      totalNewUsers: usersResult.data?.length || 0
    };

    // Process top properties
    const propertyStats = {};
    bookingsResult.data?.forEach(booking => {
      const propId = booking.property_id;
      if (!propertyStats[propId]) {
        propertyStats[propId] = {
          property_id: propId,
          title: booking.properties?.title || 'Unknown Property',
          bookings: 0,
          confirmed: 0,
          revenue: 0
        };
      }
      propertyStats[propId].bookings++;
      if (booking.status === 'confirmed') propertyStats[propId].confirmed++;
      if (booking.status === 'completed') propertyStats[propId].revenue += parseFloat(booking.total_amount || 0);
    });

    const topProperties = Object.values(propertyStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Process subscriptions
    const subscriptions = {
      free: subscriptionsResult.data?.filter(s => !s.subscription_tier || s.subscription_tier === 'free').length || 0,
      basic: subscriptionsResult.data?.filter(s => s.subscription_tier === 'basic').length || 0,
      premium: subscriptionsResult.data?.filter(s => s.subscription_tier === 'premium').length || 0
    };

    // Process verifications
    const verifications = {
      pending: landlordsResult.data?.filter(l => !l.is_verified).length || 0,
      verified: landlordsResult.data?.filter(l => l.is_verified).length || 0,
      rejected: 0,
      total: landlordsResult.data?.length || 0
    };

    const dashboardData = {
      revenue,
      bookings,
      users,
      topProperties,
      subscriptions,
      verifications,
      generatedAt: new Date().toISOString()
    };

    console.log('Dashboard analytics generated successfully');

    res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard analytics',
      error: error.message
    });
  }
};

/**
 * Verify a landlord account
 * @route POST /admin/landlords/:landlordId/verify
 */
export const verifyLandlord = async (req, res) => {
  try {
    const { landlordId } = req.params;
    const adminId = req.user.id;

    // Update landlord verification status
    const { data, error } = await supabase
      .from('users')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verified_by: adminId
      })
      .eq('id', landlordId)
      .eq('role', 'landlord')
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Landlord not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Landlord verified successfully',
      data
    });
  } catch (error) {
    console.error('Error verifying landlord:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify landlord',
      error: error.message
    });
  }
};

/**
 * Suspend a landlord account
 * @route POST /admin/landlords/:landlordId/suspend
 */
export const suspendLandlord = async (req, res) => {
  try {
    const { landlordId } = req.params;
    const { reason } = req.body;

    // Update landlord status to suspended
    const { data, error } = await supabase
      .from('users')
      .update({
        is_verified: false,
        suspended_at: new Date().toISOString(),
        suspension_reason: reason || 'No reason provided'
      })
      .eq('id', landlordId)
      .eq('role', 'landlord')
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Landlord not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Landlord suspended successfully',
      data
    });
  } catch (error) {
    console.error('Error suspending landlord:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to suspend landlord',
      error: error.message
    });
  }
};

/**
 * Get landlord verification documents
 * @route GET /admin/landlords/:landlordId/documents
 */
export const getLandlordDocuments = async (req, res) => {
  try {
    const { landlordId } = req.params;

    // Get all documents for this landlord
    const { data, error } = await supabase
      .from('verification_documents')
      .select('*')
      .eq('user_id', landlordId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Error fetching landlord documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
      error: error.message
    });
  }
};
