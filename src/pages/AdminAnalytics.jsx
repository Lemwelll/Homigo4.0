import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  TrendingUp, 
  Users, 
  Home, 
  DollarSign, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [dashboardData, setDashboardData] = useState({
    revenue: { totalRevenue: 0, transactionCount: 0, dailyRevenue: [] },
    bookings: { total: 0, confirmed: 0, pending: 0, completed: 0, cancelled: 0 },
    users: { newStudents: 0, newLandlords: 0, totalActiveStudents: 0, totalActiveLandlords: 0, totalNewUsers: 0 },
    topProperties: [],
    subscriptions: { free: 0, basic: 0, premium: 0 },
    verifications: { pending: 0, verified: 0, rejected: 0, total: 0 }
  });

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.startDate, dateRange.endDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('homigo_token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || 'https://homigo-backend.onrender.com';
      
      console.log('Fetching analytics from:', `${API_URL}/admin/dashboard`);
      console.log('Date range:', dateRange);
      
      const response = await fetch(
        `${API_URL}/admin/dashboard?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Analytics data received:', data);
      
      if (data.success) {
        setDashboardData(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
        console.error('Failed to fetch dashboard data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (type) => {
    try {
      const token = localStorage.getItem('homigo_token');
      const API_URL = import.meta.env.VITE_API_URL || 'https://homigo-backend.onrender.com';
      const response = await fetch(
        `${API_URL}/reports/export?type=${type}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_report_${dateRange.startDate}_${dateRange.endDate}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Analytics</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Platform performance and insights</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="card">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div className="flex items-center space-x-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm opacity-90 mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">
              ₱{dashboardData?.revenue?.totalRevenue?.toLocaleString() || '0'}
            </p>
            <p className="text-xs opacity-75 mt-2">
              {dashboardData?.revenue?.transactionCount || 0} transactions
            </p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <Home className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm opacity-90 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold">{dashboardData?.bookings?.total || 0}</p>
            <p className="text-xs opacity-75 mt-2">
              {dashboardData?.bookings?.confirmed || 0} confirmed
            </p>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm opacity-90 mb-1">New Users</p>
            <p className="text-3xl font-bold">{dashboardData?.users?.totalNewUsers || 0}</p>
            <p className="text-xs opacity-75 mt-2">
              {dashboardData?.users?.newStudents || 0} students, {dashboardData?.users?.newLandlords || 0} landlords
            </p>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <Home className="w-8 h-8 opacity-80" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm opacity-90 mb-1">Active Users</p>
            <p className="text-3xl font-bold">
              {(dashboardData?.users?.totalActiveStudents || 0) + (dashboardData?.users?.totalActiveLandlords || 0)}
            </p>
            <p className="text-xs opacity-75 mt-2">
              {dashboardData?.users?.totalActiveStudents || 0} students
            </p>
          </div>
        </div>

        {/* Booking Status Breakdown */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Status</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-800">
                {dashboardData?.bookings?.pending || 0}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-green-800">
                {dashboardData?.bookings?.confirmed || 0}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Completed</p>
              <p className="text-2xl font-bold text-blue-800">
                {dashboardData?.bookings?.completed || 0}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700 mb-1">Cancelled</p>
              <p className="text-2xl font-bold text-red-800">
                {dashboardData?.bookings?.cancelled || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Breakdown */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Subscription Tiers</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-1">Free</p>
              <p className="text-2xl font-bold text-gray-800">
                {dashboardData?.subscriptions?.free || 0}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Basic</p>
              <p className="text-2xl font-bold text-blue-800">
                {dashboardData?.subscriptions?.basic || 0}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-700 mb-1">Premium</p>
              <p className="text-2xl font-bold text-purple-800">
                {dashboardData?.subscriptions?.premium || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Top Performing Properties */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Performing Properties</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700">Property</th>
                  <th className="text-left py-3 px-4 text-gray-700">Bookings</th>
                  <th className="text-left py-3 px-4 text-gray-700">Confirmed</th>
                  <th className="text-left py-3 px-4 text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.topProperties?.map((property, index) => (
                  <tr key={property.property_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-500">#{index + 1}</span>
                        <span className="text-gray-800">{property.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{property.bookings}</td>
                    <td className="py-3 px-4 text-gray-700">{property.confirmed}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">
                      ₱{property.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!dashboardData?.topProperties || dashboardData.topProperties.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No property data available for this period
              </div>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Landlord Verification Status</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-800">
                {dashboardData?.verifications?.pending || 0}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Verified</p>
              <p className="text-2xl font-bold text-green-800">
                {dashboardData?.verifications?.verified || 0}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-800">
                {dashboardData?.verifications?.rejected || 0}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-800">
                {dashboardData?.verifications?.total || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Export Reports</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportReport('revenue')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Revenue Report</span>
            </button>
            <button
              onClick={() => exportReport('bookings')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Booking Stats</span>
            </button>
            <button
              onClick={() => exportReport('properties')}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Property Performance</span>
            </button>
            <button
              onClick={() => exportReport('dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Full Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
