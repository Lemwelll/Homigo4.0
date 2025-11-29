import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'
import API_URL from '../config/api'

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const { user } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookingsCache, setBookingsCache] = useState(new Map())
  const [lastBookingsFetch, setLastBookingsFetch] = useState(0)

  // Get JWT token from localStorage
  const getToken = () => {
    return localStorage.getItem('homigo_token')
  }

  // Fetch bookings from API - OPTIMIZED with caching
  const fetchBookings = useCallback(async (forceRefresh = false) => {
    try {
      const now = Date.now()
      const cacheKey = 'user-bookings'
      const CACHE_DURATION = 20000 // 20 seconds

      // Check cache first
      if (!forceRefresh && bookingsCache.has(cacheKey) && (now - lastBookingsFetch) < CACHE_DURATION) {
        setBookings(bookingsCache.get(cacheKey))
        return
      }

      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        console.log('No token found for bookings')
        setBookings([])
        setLoading(false)
        return
      }

      const data = await ApiClient.get('/bookings')

      if (data.success) {
        // Transform backend data - fetch escrow data only for active bookings
        const transformedBookings = await Promise.all(data.data.map(async (booking) => {
          let escrowStatus = null;
          
          // Only fetch escrow for confirmed/active bookings to reduce API calls
          if (booking.status === 'confirmed' || booking.status === 'active') {
            try {
              const escrowData = await ApiClient.get(`/escrow/booking/${booking.id}`);
              
              if (escrowData.success && escrowData.data) {
                escrowStatus = {
                  status: escrowData.data.status === 'held' ? 'Held in Escrow' : 
                          escrowData.data.status === 'released' ? 'Released' : 'Refunded',
                  updatedAt: escrowData.data.updated_at
                };
              }
            } catch (err) {
              // Silently fail for escrow data
            }
          }

          return {
            id: booking.id,
            propertyId: booking.property_id,
            propertyTitle: booking.properties?.title || 'Property',
            propertyImage: booking.properties?.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
            studentId: booking.student_id,
            studentName: booking.users?.full_name || 'Student',
            studentEmail: booking.users?.email || '',
            studentPhone: booking.users?.phone || '',
            landlordId: booking.landlord_id,
            landlordName: booking.properties?.users?.full_name || 'Landlord',
            status: booking.status,
            date: booking.created_at,
            moveInDate: booking.move_in_date,
            price: `₱${parseFloat(booking.amount_paid || 0).toLocaleString()}/month`,
            duration: `${booking.duration_months || 0} months`,
            message: booking.message || '',
            paymentType: booking.payment_type,
            totalAmount: parseFloat(booking.amount_paid || 0),
            remainingBalance: parseFloat(booking.remaining_balance || 0),
            monthlyRent: parseFloat(booking.amount_paid || 0),
            leaseDurationMonths: booking.duration_months,
            escrow: escrowStatus
          };
        }));
        
        setBookings(transformedBookings);
        setBookingsCache(prev => new Map(prev).set(cacheKey, transformedBookings))
        setLastBookingsFetch(now)
      } else {
        setError(data.message)
        setBookings([])
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Bookings request timeout')
      } else {
        console.error('Error fetching bookings:', error)
      }
      setError(error.message)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [bookingsCache, lastBookingsFetch])

  // Fetch bookings on mount and when user changes
  useEffect(() => {
    if (user && (user.role === 'student' || user.role === 'landlord')) {
      fetchBookings()
    }
  }, [user])

  const createBooking = async (bookingData) => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (data.success) {
        // Add new booking to state
        await fetchBookings() // Refresh bookings list
        return data.data
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update booking in state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        ))
        return data.data
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error updating booking status:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (bookingId) => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        // Update booking in state
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ))
        return data.data
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getStudentBookings = () => {
    return bookings.filter(booking => 
      booking.studentId === user?.id
    )
  }

  const getLandlordBookings = () => {
    return bookings.filter(booking => 
      booking.landlordId === user?.id
    )
  }

  const isPropertyBooked = (propertyId) => {
    return bookings.some(
      booking =>
        booking.propertyId === propertyId &&
        booking.studentId === user?.id &&
        (booking.status === 'confirmed' || booking.status === 'active')
    )
  }

  // Legacy escrow functions for backward compatibility
  const createEscrowPayment = (bookingId) => {
    console.log('createEscrowPayment called for booking:', bookingId)
    // This is now handled by the booking creation process
  }

  const releaseEscrowPayment = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'approved')
      await fetchBookings() // Refresh bookings to show updated status
    } catch (error) {
      console.error('Error releasing escrow:', error)
      throw error
    }
  }

  const refundEscrowPayment = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'rejected')
      await fetchBookings() // Refresh bookings to show updated status
    } catch (error) {
      console.error('Error refunding escrow:', error)
      throw error
    }
  }

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    getStudentBookings,
    getLandlordBookings,
    isPropertyBooked,
    createEscrowPayment,
    releaseEscrowPayment,
    refundEscrowPayment,
    fetchBookings
  }), [bookings, loading, error, fetchBookings])

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}
