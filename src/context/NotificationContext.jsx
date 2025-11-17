import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

// Initial dummy notifications
const getInitialNotifications = () => {
  const now = new Date()
  return [
    {
      id: 1,
      type: 'booking_created',
      sender: 'student@homigo.com',
      senderName: 'Demo Student',
      receiver: 'landlord@homigo.com',
      title: 'New Booking Request',
      message: 'A student has requested to book your property "Modern Studio near UP Diliman"',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      actionUrl: '/landlord/bookings'
    },
    {
      id: 2,
      type: 'reservation_approved',
      sender: 'landlord@homigo.com',
      senderName: 'Demo Landlord',
      receiver: 'student@homigo.com',
      title: 'Reservation Approved',
      message: 'Your reservation for "Cozy Apartment in Katipunan" has been approved!',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      actionUrl: '/student/reservations'
    },
    {
      id: 3,
      type: 'payment_received',
      sender: 'student@homigo.com',
      senderName: 'Demo Student',
      receiver: 'landlord@homigo.com',
      title: 'Escrow Payment Received',
      message: 'Payment of ₱8,500 has been received and held in escrow',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      actionUrl: '/landlord/escrow'
    },
    {
      id: 4,
      type: 'message_received',
      sender: 'landlord@homigo.com',
      senderName: 'Maria Santos',
      receiver: 'student@homigo.com',
      title: 'New Message',
      message: 'Maria Santos sent you a message about your booking',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      actionUrl: '/student/messages'
    }
  ]
}

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth()
  
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('homigoNotifications')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing notifications:', error)
      }
    }
    return getInitialNotifications()
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('homigoNotifications', JSON.stringify(notifications))
  }, [notifications])

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
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    )
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    )
  }

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
  }

  // Get user notifications
  const getUserNotifications = () => {
    if (!user) return []
    return notifications.filter(notif => notif.receiver === user.email)
  }

  // Get unread count
  const getUnreadCount = () => {
    return getUserNotifications().filter(notif => !notif.isRead).length
  }

  // Notification triggers
  const notifyBookingCreated = (propertyTitle, landlordEmail) => {
    addNotification({
      type: 'booking_created',
      sender: user?.email,
      senderName: user?.name,
      receiver: landlordEmail,
      title: 'New Booking Request',
      message: `${user?.name} has requested to book your property "${propertyTitle}"`,
      actionUrl: '/landlord/bookings'
    })
  }

  const notifyReservationCreated = (propertyTitle, landlordEmail) => {
    addNotification({
      type: 'reservation_created',
      sender: user?.email,
      senderName: user?.name,
      receiver: landlordEmail,
      title: 'New Reservation Request',
      message: `${user?.name} has reserved your property "${propertyTitle}"`,
      actionUrl: '/landlord/reservations'
    })
  }

  const notifyReservationApproved = (propertyTitle, studentEmail) => {
    addNotification({
      type: 'reservation_approved',
      sender: user?.email,
      senderName: user?.name,
      receiver: studentEmail,
      title: 'Reservation Approved',
      message: `Your reservation for "${propertyTitle}" has been approved!`,
      actionUrl: '/student/reservations'
    })
  }

  const notifyReservationRejected = (propertyTitle, studentEmail) => {
    addNotification({
      type: 'reservation_rejected',
      sender: user?.email,
      senderName: user?.name,
      receiver: studentEmail,
      title: 'Reservation Declined',
      message: `Your reservation for "${propertyTitle}" has been declined`,
      actionUrl: '/student/reservations'
    })
  }

  const notifyPaymentReceived = (amount, landlordEmail) => {
    addNotification({
      type: 'payment_received',
      sender: user?.email,
      senderName: user?.name,
      receiver: landlordEmail,
      title: 'Escrow Payment Received',
      message: `Payment of ₱${amount.toLocaleString()} has been received and held in escrow`,
      actionUrl: '/landlord/escrow'
    })
  }

  const notifyBookingApproved = (propertyTitle, studentEmail) => {
    addNotification({
      type: 'booking_approved',
      sender: user?.email,
      senderName: user?.name,
      receiver: studentEmail,
      title: 'Booking Approved',
      message: `Your booking for "${propertyTitle}" has been approved!`,
      actionUrl: '/student/bookings'
    })
  }

  const notifyBookingRejected = (propertyTitle, studentEmail) => {
    addNotification({
      type: 'booking_rejected',
      sender: user?.email,
      senderName: user?.name,
      receiver: studentEmail,
      title: 'Booking Declined',
      message: `Your booking for "${propertyTitle}" has been declined`,
      actionUrl: '/student/bookings'
    })
  }

  const notifyMessageReceived = (senderName, receiverEmail) => {
    addNotification({
      type: 'message_received',
      sender: user?.email,
      senderName: senderName,
      receiver: receiverEmail,
      title: 'New Message',
      message: `${senderName} sent you a message`,
      actionUrl: user?.role === 'student' ? '/student/messages' : '/landlord/messages'
    })
  }

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUserNotifications,
    getUnreadCount,
    // Trigger functions
    notifyBookingCreated,
    notifyReservationCreated,
    notifyReservationApproved,
    notifyReservationRejected,
    notifyPaymentReceived,
    notifyBookingApproved,
    notifyBookingRejected,
    notifyMessageReceived
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
