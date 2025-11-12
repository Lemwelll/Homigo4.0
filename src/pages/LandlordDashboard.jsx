import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { PlusCircle, Home, Eye, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProperties } from '../context/PropertyContext'

const LandlordDashboard = () => {
  const navigate = useNavigate()
  const { properties, stats } = useProperties()
  
  // Landlord info (in real app, this would come from auth context)
  const landlordName = 'Maria Santos'

  const statsDisplay = [
    { label: 'Total Properties', value: stats.totalProperties, icon: Home, color: 'bg-secondary-500' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'bg-primary-500' },
    { label: 'Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'bg-yellow-500' },
    { label: 'Revenue', value: `₱${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-500' }
  ]

  const recentProperties = properties.slice(0, 2)
  
  // Activity feed
  const activities = [
    { id: 1, message: 'Your listing "Modern Studio near UP Diliman" was verified', time: '2 hours ago', type: 'success' },
    { id: 2, message: 'New inquiry received for "Cozy Room with WiFi"', time: '5 hours ago', type: 'info' },
    { id: 3, message: 'Property "Modern Studio" received 15 new views', time: '1 day ago', type: 'info' }
  ]

  return (
    <DashboardLayout userType="landlord">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {landlordName}! 👋</h1>
            <p className="text-secondary-100 text-lg">
              Manage your properties and connect with potential tenants
            </p>
          </div>
        </div>

        {/* Quick Action */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Property Overview</h2>
            <p className="text-gray-600">Track your listings performance</p>
          </div>
          <button
            onClick={() => navigate('/landlord/add-property')}
            className="btn-secondary flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Property</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {statsDisplay.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Activity Feed */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {activity.type === 'success' ? (
                    <TrendingUp className={`w-4 h-4 ${
                      activity.type === 'success' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Properties Preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Your Properties</h2>
            <button
              onClick={() => navigate('/landlord/properties')}
              className="flex items-center space-x-2 text-secondary-500 hover:text-secondary-600 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {recentProperties.length > 0 ? (
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div key={property.id} className="card hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full md:w-48 h-48 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{property.title}</h3>
                          <p className="text-gray-600">{property.location}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          property.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 text-sm">Price</p>
                          <p className="text-lg font-bold text-secondary-600">₱{property.price.toLocaleString()}/mo</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Views</p>
                          <p className="text-lg font-bold text-gray-800">{property.views}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Inquiries</p>
                          <p className="text-lg font-bold text-gray-800">{property.inquiries}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => navigate('/landlord/properties')}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first property</p>
              <button
                onClick={() => navigate('/landlord/add-property')}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add Property</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LandlordDashboard
