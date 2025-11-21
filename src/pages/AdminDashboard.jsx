import React from 'react'
import AdminLayout from '../components/AdminLayout'
import StatsCard from '../components/StatsCard'
import StatusBadge from '../components/StatusBadge'
import { useAdmin } from '../context/AdminContext'
import { Users, CheckCircle, Home, Flag, TrendingUp, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { stats, activities, properties, landlords } = useAdmin()

  const statsData = [
    {
      icon: Users,
      label: 'Total Landlords',
      value: stats.totalLandlords,
      color: 'bg-primary-500',
      trend: { value: '+3', label: 'this week', positive: true }
    },
    {
      icon: Clock,
      label: 'Pending Verifications',
      value: stats.pendingVerifications,
      color: 'bg-yellow-500',
      trend: { value: stats.pendingVerifications, label: 'awaiting review', positive: false }
    },
    {
      icon: Home,
      label: 'Active Properties',
      value: stats.activeProperties,
      color: 'bg-green-500',
      trend: { value: '+5', label: 'this month', positive: true }
    },
    {
      icon: Flag,
      label: 'Reported Listings',
      value: stats.reportedListings,
      color: 'bg-red-500',
      trend: { value: stats.reportedListings, label: 'need attention', positive: false }
    }
  ]

  const pendingProperties = (properties || []).filter(p => p.status === 'Pending').slice(0, 3)
  const pendingLandlords = (landlords || []).filter(l => l.status === 'Pending').slice(0, 3)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage platform activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Verifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Pending Property Verifications</h2>
              <button
                onClick={() => navigate('/admin/verifications')}
                className="text-primary-500 hover:text-primary-600 font-semibold text-sm"
              >
                View All →
              </button>
            </div>
            
            {pendingProperties.length > 0 ? (
              <div className="space-y-3">
                {pendingProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{property.title}</p>
                        <p className="text-sm text-gray-500">{property.landlordName}</p>
                      </div>
                    </div>
                    <StatusBadge status={property.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No pending verifications</p>
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
            <div className="space-y-3">
              {(activities || []).slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'verification' ? 'bg-green-100' :
                    activity.type === 'landlord' ? 'bg-blue-100' :
                    'bg-yellow-100'
                  }`}>
                    {activity.type === 'verification' && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.type === 'landlord' && <Users className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'report' && <Flag className="w-4 h-4 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Landlords */}
        {pendingLandlords.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Pending Landlord Verifications</h2>
              <button
                onClick={() => navigate('/admin/landlords')}
                className="text-primary-500 hover:text-primary-600 font-semibold text-sm"
              >
                View All →
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {pendingLandlords.map((landlord) => (
                <div key={landlord.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{landlord.name}</h3>
                    <StatusBadge status={landlord.status} />
                  </div>
                  <p className="text-sm text-gray-600">{landlord.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Joined: {landlord.joinDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-700 mb-1">Verification Rate</p>
                <p className="text-2xl font-bold text-primary-800">
                  {Math.round((stats.activeProperties / (stats.activeProperties + stats.pendingVerifications)) * 100)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Verified Landlords</p>
                <p className="text-2xl font-bold text-green-800">{stats.verifiedLandlords}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">Pending Reviews</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {stats.pendingVerifications + stats.pendingLandlords}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
