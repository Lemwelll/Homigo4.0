import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ReservationContext = createContext()

export const useReservation = () => {
  const context = useContext(ReservationContext)
  if (!context) {
    throw new Error('useReservation must be used within ReservationProvider')
  }
  return context
}

// Generate initial reservations with dummy data
const getInitialReservations = () => {
  const now = new Date()
  const twoDaysLater = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  const threeDaysLater = new Date(now.getTime() + 72 * 60 * 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  return [
    {
      id: 1,
      propertyId: 1,
      propertyTitle: "Modern Studio near UP Diliman",
      propertyImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      studentId: "student@homigo.com",
      studentName: "Demo Student",
      studentEmail: "student@homigo.com",
      studentPhone: "+63 917 123 4567",
      landlordId: "maria.santos@homigo.com",
      landlordName: "Maria Santos",
      price: "₱8,500/month",
      status: "reserved",
      reservedDate: now.toISOString(),
      expiryDate: twoDaysLater.toISOString(),
      message: "Hi! I'm interested in this property. I'm a 3rd year student at UP Diliman."
    },
    {
      id: 2,
      propertyId: 2,
      propertyTitle: "Cozy Apartment in Katipunan",
      propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      studentId: "student@homigo.com",
      studentName: "Demo Student",
      studentEmail: "student@homigo.com",
      studentPhone: "+63 917 123 4567",
      landlordId: "john.reyes@homigo.com",
      landlordName: "John Reyes",
      price: "₱9,200/month",
      status: "approved",
      reservedDate: oneDayAgo.toISOString(),
      expiryDate: threeDaysLater.toISOString(),
      message: "Looking for a long-term rental. Can move in by end of November."
    },
    {
      id: 3,
      propertyId: 3,
      propertyTitle: "Shared Room in Quezon City",
      propertyImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
      studentId: "student@homigo.com",
      studentName: "Demo Student",
      studentEmail: "student@homigo.com",
      studentPhone: "+63 917 123 4567",
      landlordId: "angela.reyes@homigo.com",
      landlordName: "Angela Reyes",
      price: "₱6,000/month",
      status: "rejected",
      reservedDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: oneDayAgo.toISOString(),
      rejectionReason: "Property is no longer available for the requested dates.",
      message: "Need a place for one semester only."
    },
    {
      id: 4,
      propertyId: 4,
      propertyTitle: "Spacious Condo Unit in Taft Avenue",
      propertyImage: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400",
      studentId: "carlos.mendoza@email.com",
      studentName: "Carlos Mendoza",
      studentEmail: "carlos.mendoza@email.com",
      studentPhone: "+63 921 567 8901",
      landlordId: "landlord@homigo.com",
      landlordName: "Demo Landlord",
      price: "₱12,000/month",
      status: "reserved",
      reservedDate: now.toISOString(),
      expiryDate: twoDaysLater.toISOString(),
      message: "I'm a graduate student at DLSU. Looking for a quiet place to study."
    },
    {
      id: 5,
      propertyId: 5,
      propertyTitle: "Budget-Friendly Dorm in España",
      propertyImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
      studentId: "sofia.ramos@email.com",
      studentName: "Sofia Ramos",
      studentEmail: "sofia.ramos@email.com",
      studentPhone: "+63 922 678 9012",
      landlordId: "landlord@homigo.com",
      landlordName: "Demo Landlord",
      price: "₱5,500/month",
      status: "reserved",
      reservedDate: now.toISOString(),
      expiryDate: threeDaysLater.toISOString(),
      message: "UST student. Need accommodation for the school year."
    }
  ]
}

export const ReservationProvider = ({ children }) => {
  const { user } = useAuth()

  const [reservations, setReservations] = useState(() => {
    const stored = localStorage.getItem('homigoReservations')
    if (stored) {
      try {
        const parsedReservations = JSON.parse(stored)
        if (parsedReservations && parsedReservations.length > 0) {
          return parsedReservations
        }
      } catch (error) {
        console.error('Error parsing stored reservations:', error)
      }
    }
    return getInitialReservations()
  })

  // Save to localStorage whenever reservations change
  useEffect(() => {
    localStorage.setItem('homigoReservations', JSON.stringify(reservations))
  }, [reservations])

  const createReservation = (property, message = '') => {
    const now = new Date()
    const expiryDate = new Date(now.getTime() + 48 * 60 * 60 * 1000) // 48 hours

    const newReservation = {
      id: Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.image,
      studentId: user?.email,
      studentName: user?.name,
      studentEmail: user?.email,
      studentPhone: user?.phone || "+63 917 123 4567",
      landlordId: property.landlordId || "landlord@homigo.com",
      landlordName: property.landlordName || "Property Owner",
      price: `₱${property.price.toLocaleString()}/month`,
      status: "reserved",
      reservedDate: now.toISOString(),
      expiryDate: expiryDate.toISOString(),
      message: message
    }

    setReservations(prev => [...prev, newReservation])
    return newReservation
  }

  const approveReservation = (reservationId) => {
    setReservations(prev => prev.map(reservation => {
      if (reservation.id === reservationId) {
        return {
          ...reservation,
          status: 'approved'
        }
      }
      return reservation
    }))
  }

  const rejectReservation = (reservationId, reason = '') => {
    setReservations(prev => prev.map(reservation => {
      if (reservation.id === reservationId) {
        return {
          ...reservation,
          status: 'rejected',
          rejectionReason: reason
        }
      }
      return reservation
    }))
  }

  const cancelReservation = (reservationId) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== reservationId))
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
    if (user?.role === 'student') {
      return reservations.filter(reservation => 
        reservation.studentId === user?.email || 
        reservation.studentId === 'student@homigo.com'
      )
    }
    return reservations.filter(reservation => reservation.studentId === user?.email)
  }

  const getLandlordReservations = () => {
    if (user?.role === 'landlord') {
      return reservations.filter(reservation => 
        reservation.landlordId === user?.email || 
        reservation.landlordId === 'landlord@homigo.com'
      )
    }
    return reservations.filter(reservation => reservation.landlordId === user?.email)
  }

  const isPropertyReserved = (propertyId) => {
    return reservations.some(
      reservation =>
        reservation.propertyId === propertyId &&
        reservation.studentId === user?.email &&
        (reservation.status === "reserved" || reservation.status === "approved")
    )
  }

  const value = {
    reservations,
    createReservation,
    approveReservation,
    rejectReservation,
    cancelReservation,
    expireReservation,
    getStudentReservations,
    getLandlordReservations,
    isPropertyReserved
  }

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  )
}
