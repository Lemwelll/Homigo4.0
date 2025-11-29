import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import API_URL from '../config/api'
import ApiClient from '../utils/apiClient'

const EscrowContext = createContext()

export const useEscrow = () => {
  const context = useContext(EscrowContext)
  if (!context) {
    throw new Error('useEscrow must be used within EscrowProvider')
  }
  return context
}

export const EscrowProvider = ({ children }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get JWT token
  const getToken = () => {
    return localStorage.getItem('homigo_token')
  }

  // Fetch escrow transactions from API
  const fetchEscrowTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = getToken()
      
      if (!token) {
        console.log('No token found for escrow')
        setTransactions([])
        return
      }

      // Use different endpoint based on user role
      const endpoint = user?.role === 'student' ? '/escrow/student' : '/escrow/landlord'
      
      const data = await ApiClient.get(endpoint)

      if (data.success) {
        // Transform backend data to match frontend format
        const transformed = data.data.map(escrow => {
          console.log('🔍 Escrow booking data:', escrow.bookings)
          console.log('🔍 Payment type:', escrow.bookings?.payment_type)
          console.log('🔍 Remaining balance:', escrow.bookings?.remaining_balance)
          
          return {
            id: escrow.id,
            bookingId: escrow.booking_id,
            propertyId: escrow.property_id,
            propertyTitle: escrow.properties?.title || 'Property',
            propertyImage: escrow.properties?.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
            propertyLocation: escrow.properties?.location || '',
            studentName: escrow.users?.full_name || 'Student',
            studentEmail: escrow.users?.email || '',
            studentPhone: escrow.users?.phone || '',
            landlordName: escrow.properties?.users?.full_name || 'Landlord',
            amount: parseFloat(escrow.amount || 0),
            paymentType: escrow.bookings?.payment_type || 'full',
            remainingBalance: parseFloat(escrow.bookings?.remaining_balance || 0),
            status: escrow.status, // 'held', 'released', 'refunded'
            createdAt: escrow.created_at,
            date: new Date(escrow.created_at).toLocaleDateString(),
            heldDate: escrow.held_date,
            releasedDate: escrow.released_date,
            refundedDate: escrow.refunded_date,
            bookingStatus: escrow.bookings?.status || 'pending',
            moveInDate: escrow.bookings?.move_in_date,
            durationMonths: escrow.bookings?.duration_months
          }
        })
        
        setTransactions(transformed)
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error('Error fetching escrow transactions:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch escrow transactions on mount and when user changes
  useEffect(() => {
    if (user && (user.role === 'landlord' || user.role === 'student')) {
      fetchEscrowTransactions()
    }
  }, [user])

  // Legacy function for backward compatibility with LandlordEscrow page
  const getLandlordTransactions = (landlordId) => {
    // Since we already filter by landlord in the API, just return all transactions
    return transactions
  }

  // Function for StudentEscrow page
  const getStudentTransactions = (studentId) => {
    // Since we already filter by student in the API, just return all transactions
    return transactions
  }

  const getTransactionById = (id) => {
    return transactions.find(t => t.id === id)
  }

  const getHeldTransactions = () => {
    return transactions.filter(t => t.status === 'held')
  }

  const getReleasedTransactions = () => {
    return transactions.filter(t => t.status === 'released')
  }

  const getRefundedTransactions = () => {
    return transactions.filter(t => t.status === 'refunded')
  }

  const getTotalHeld = () => {
    return transactions
      .filter(t => t.status === 'held')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalReleased = () => {
    return transactions
      .filter(t => t.status === 'released')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const value = {
    transactions,
    loading,
    error,
    getLandlordTransactions,
    getStudentTransactions,
    getTransactionById,
    getHeldTransactions,
    getReleasedTransactions,
    getRefundedTransactions,
    getTotalHeld,
    getTotalReleased,
    fetchEscrowTransactions
  }

  return (
    <EscrowContext.Provider value={value}>
      {children}
    </EscrowContext.Provider>
  )
}
