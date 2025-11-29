import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'
import API_URL from '../config/api'

const ReservationContext = createContext()

export const useReservation = () => {
  const context = useContext(ReservationContext)
  if (!context) {
    throw new Error('useReservation must be used within ReservationProvider')
  }
  return context
}

export const ReservationProvider = ({ children }) => {
  const { user } = useAuth()

  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reservationsCache, setReservationsCache] = useState(new Map())
  const [lastReservationsFetch, setLastReservationsFetch] = useState(0)

  // Get JWT token from localStorage
  const getToken = () => {
    return localStorage.getItem('homigo_token')
  }

  // Fetch reservations from API - OPTIMIZED with caching
  const fetchReservations = useCallback(async (forceRefresh = false) => {
    try {
      const now = Date.now()
      const cacheKey = 'user-reservations'
      const CACHE_DURATION = 15000 // 15 seconds

      // Check cache first
      if (!forceRefresh && reservationsCache.has(cacheKey) && (now - lastReservationsFetch) < CACHE_DURATION) {
        setReservations(reservationsCache.get(cacheKey))
        return
      }

      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        console.log('No token found for reservations')
        setReservations([])
        setLoading(false)
        return
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

      const response = await fetch(`${API_URL}/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (data.success) {
        // Transform backend data to match frontend format
        const transformedReservations = data.data.map(res => ({
          id: res.id,
          property_id: res.property_id,
          student_id: res.student_id,
          landlord_id: res.landlord_id,
          status: res.status,
          message: res.message,
          rejection_reason: res.rejection_reason,
          propertyTitle: res.properties?.title || 'Property',
          propertyImage: res.properties?.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
          price: `₱${parseFloat(res.properties?.rent_price || 0).toLocaleString()}`,
          landlordName: res.properties?.users?.full_name || res.users?.full_name || 'Landlord',
          studentName: res.users?.full_name || 'Student',
          studentEmail: res.users?.email || '',
          expiryDate: res.expiry_date,
          reservedDate: res.created_at,
          rejectionReason: res.rejection_reason
        }))
        setReservations(transformedReservations)
        setReservationsCache(prev => new Map(prev).set(cacheKey, transformedReservations))
        setLastReservationsFetch(now)
      } else {
        setError(data.message)
        setReservations([])
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Reservations request timeout')
      } else {
        console.error('Error fetching reservations:', error)
      }
      setError(error.message)
      setReservations([])
    } finally {
      setLoading(false)
    }
  }, [reservationsCache, lastReservationsFetch])

  // Fetch reservations on mount and when user changes
  useEffect(() => {
    if (user && (user.role === 'student' || user.role === 'landlord')) {
      fetchReservations()
    }
  }, [user])

  const createReservation = async (property, message = '') => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          property_id: property.id,
          message: message
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add new reservation to state
        setReservations(prev => [...prev, data.data])
        return { success: true, data: data.data }
      } else {
        // Return error without throwing
        setError(data.message)
        return { success: false, error: data.message }
      }
    } catch (error) {
      console.error('Error creating reservation:', error)
      const errorMessage = error.message || 'Failed to create reservation'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const approveReservation = async (reservationId) => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/reservations/${reservationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'approved'
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update reservation in state
        setReservations(prev => prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'approved' }
            : reservation
        ))
        return data.data
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error approving reservation:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const rejectReservation = async (reservationId, reason = '') => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/reservations/${reservationId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'rejected',
          rejection_reason: reason
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update reservation in state
        setReservations(prev => prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'rejected', rejection_reason: reason }
            : reservation
        ))
        return data.data
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error rejecting reservation:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelReservation = async (reservationId) => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        // Update reservation in state
        setReservations(prev => prev.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'cancelled' }
            : reservation
        ))
        return data.data
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const expireReservation = (reservationId) => {
    setReservations(prev => prev.map(reservation => {
      if (reservation.id === reservationId) {
        return {
          ...reservation,
          status: 'expired'
        }
      }
      return reservation
    }))
  }

  const getStudentReservations = () => {
    // Show all student reservations including completed ones
    return reservations.filter(reservation => 
      reservation.student_id === user?.id
    )
  }

  const getLandlordReservations = () => {
    return reservations.filter(reservation => 
      reservation.landlord_id === user?.id
    )
  }

  const isPropertyReserved = (propertyId) => {
    return reservations.some(
      reservation =>
        reservation.property_id === propertyId &&
        reservation.student_id === user?.id &&
        (reservation.status === "reserved" || reservation.status === "approved")
    )
  }

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    reservations,
    loading,
    error,
    createReservation,
    approveReservation,
    rejectReservation,
    cancelReservation,
    expireReservation,
    getStudentReservations,
    getLandlordReservations,
    isPropertyReserved,
    fetchReservations
  }), [reservations, loading, error, fetchReservations])

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  )
}
