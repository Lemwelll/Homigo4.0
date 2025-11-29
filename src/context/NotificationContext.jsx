import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import API_URL from '../config/api'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}


export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  // Get JWT token
  const getToken = () => {
    return localStorage.getItem('homigo_token')
  }

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const token = getToken()
      
      if (!token) return

      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setNotifications(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications()

      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        fetchNotifications()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [user])

  // Add new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notification
    }
    setNotifications(prev => [newNotification, ...prev])
    return newNotification
  }

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      const token = getToken()
      
      await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = getToken()
      
      await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      )
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const token = getToken()
      
      await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Get user notifications
  const getUserNotifications = () => {
    return notifications
  }

  // Get unread count
  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.is_read).length
  }

  const value = {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUserNotifications,
    getUnreadCount
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
