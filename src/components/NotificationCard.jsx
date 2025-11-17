import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  MessageSquare, 
  Home,
  Clock,
  Trash2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const NotificationCard = ({ notification, compact = false, onClick }) => {
  const navigate = useNavigate()
  const { markAsRead, deleteNotification } = useNotifications()

  const getIcon = () => {
    switch (notification.type) {
      case 'booking_created':
      case 'booking_approved':
      case 'booking_rejected':
        return Calendar
      case 'reservation_created':
      case 'reservation_approved':
      case 'reservation_rejected':
        return Clock
      case 'payment_received':
        return DollarSign
      case 'message_received':
        return MessageSquare
      default:
        return Home
    }
  }

  const getIconColor = () => {
    if (notification.type.includes('approved')) return 'text-green-600 bg-green-100'
    if (notification.type.includes('rejected') || notification.type.includes('declined')) return 'text-red-600 bg-red-100'
    if (notification.type.includes('payment')) return 'text-blue-600 bg-blue-100'
    if (notification.type.includes('message')) return 'text-purple-600 bg-purple-100'
    return 'text-yellow-600 bg-yellow-100'
  }

  const Icon = getIcon()
  const iconColor = getIconColor()

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
    if (onClick) onClick()
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    deleteNotification(notification.id)
  }

  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })

  return (
    <div
      onClick={handleClick}
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
        !notification.isRead ? 'bg-blue-50' : ''
      } ${compact ? '' : 'rounded-lg border border-gray-200 mb-3'}`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold text-gray-900 ${!notification.isRead ? 'font-bold' : ''}`}>
              {notification.title}
            </h4>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">{timeAgo}</span>
            {!compact && (
              <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard
