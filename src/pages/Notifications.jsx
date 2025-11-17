import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import DashboardLayout from '../components/DashboardLayout'
import NotificationCard from '../components/NotificationCard'
import { Bell, Filter, CheckCheck } from 'lucide-react'

const Notifications = () => {
  const { user } = useAuth()
  const { getUserNotifications, markAllAsRead } = useNotifications()
  const [filter, setFilter] = useState('all') // all, unread, read

  const allNotifications = getUserNotifications()
  
  const filteredNotifications = allNotifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead
    if (filter === 'read') return notif.isRead
    return true
  })

  const unreadCount = allNotifications.filter(n => !n.isRead).length

  return (
    <DashboardLayout userType={user?.role || 'student'}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          </div>
          <p className="text-gray-600">
            Stay updated with your bookings, reservations, and messages
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{allNotifications.length}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Unread</p>
            <p className="text-2xl font-bold text-blue-900">{unreadCount}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-700 mb-1">Read</p>
            <p className="text-2xl font-bold text-green-900">{allNotifications.length - unreadCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Filter:</span>
              <div className="flex gap-2">
                {['all', 'unread', 'read'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      filter === filterType
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No {filter !== 'all' ? filter : ''} notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                compact={false}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Notifications
