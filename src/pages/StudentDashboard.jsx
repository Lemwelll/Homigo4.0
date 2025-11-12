import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useStudent } from '../context/StudentContext'
import { useNavigate } from 'react-router-dom'
import { Search, Heart, MessageSquare, Settings, Home, TrendingUp, ArrowRight } from 'lucide-react'

const StudentDashboard = () => {
  const navigate = useNavigate()
  const { student, stats, properties } = useStudent()

  const quickActions = [
    {
      icon: Search,
      title: 'Browse Properties',
      description: `${stats.totalProperties} listings available`,
      link: '/student/browse',
      color: 'bg-primary-500',
      hoverColor: 'hover:bg-primary-600'
    },
    {
      icon: Heart,
      title: 'Saved Listings',
      description: `${stats.savedListings} properties saved`,
      link: '/student/favorites',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      icon: MessageSquare,
      title: 'Messages',
      description: `${stats.newMessages} new message${stats.newMessages !== 1 ? 's' : ''}`,
      link: '/student/messages',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Manage your account',
      link: '/student/settings',
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    }
  ]

  const recentProperties = properties.slice(0, 3)

  return (
    <DashboardLayout userType="student">
      <div className="space-y-4 sm:space-y-6">
        {/* Welcome Banner */}
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white opacity-10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {student.name}! 👋</h1>
            <p className="text-primary-100 text-base sm:text-lg">
              Ready to find your perfect home? Let's get started!
            </p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="card bg-gradient-to-br from-blue-50 to-primary-50">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-800">Your Activity</h2>
          </div>
          <p className="text-gray-700">
            You have <span className="font-bold text-primary-600">{stats.savedListings} saved listing{stats.savedListings !== 1 ? 's' : ''}</span> and{' '}
            <span className="font-bold text-green-600">{stats.newMessages} new message{stats.newMessages !== 1 ? 's' : ''}</span>.
          </p>
        </div>

        {/* Quick Access Cards */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <div
                  key={index}
                  onClick={() => navigate(action.link)}
                  className={`card cursor-pointer transform hover:scale-105 transition-all duration-300 ${action.color} text-white overflow-hidden relative group p-4 sm:p-6`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex justify-center mb-2 sm:mb-4">
                      <div className="bg-white bg-opacity-20 p-2 sm:p-4 rounded-full">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-center mb-1 sm:mb-2">{action.title}</h3>
                    <p className="text-center text-xs sm:text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Featured Properties */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Featured Properties</h2>
            <button
              onClick={() => navigate('/student/browse')}
              className="flex items-center space-x-1 sm:space-x-2 text-primary-500 hover:text-primary-600 font-semibold text-sm sm:text-base"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => navigate(`/property/${property.id}`)}
                className="card p-0 overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  {property.verified && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Verified
                    </div>
                  )}
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-primary-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-sm sm:text-base">
                    ₱{property.price.toLocaleString()}/mo
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{property.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{property.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <div className="flex items-start space-x-4">
            <div className="bg-yellow-500 p-3 rounded-full">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">💡 Pro Tip</h3>
              <p className="text-gray-700">
                Save your favorite properties to compare them later. You can also message landlords directly to schedule viewings!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentDashboard
