import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { CheckCheck, Eye, Bell } from 'lucide-react'
import NotificationCard from './NotificationCard'

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate()
  const { getUserNotifications, markAllAsRead } = useNotifications()
  
  const notifications = getUserNotifications().slice(0, 5) // Show only 5 recent

  const handleViewAll = () => {
    navigate('/notifications')
    onClose()
  }

  const handleMarkAllRead = () => {
    markAllAsRead()
  }

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-slideDown">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                compact={true}
                onClick={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleViewAll}
            className="w-full px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View All Notifications
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
