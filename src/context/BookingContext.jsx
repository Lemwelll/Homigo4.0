import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

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
  
  const [bookings, setBookings] = useState([
    {
      id: 1,
      propertyId: 1,
      propertyTitle: "Modern Studio near UP Diliman",
      propertyImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      studentId: "student@homigo.com",
      studentName: "Maria Santos",
      landlordId: "landlord@homigo.com",
      landlordName: "John Reyes",
      status: "Pending",
      date: "2025-11-13",
      price: "₱8,500/month"
    },
    {
      id: 2,
      propertyId: 2,
      propertyTitle: "Cozy Apartment in Katipunan",
      propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      studentId: "student@homigo.com",
      studentName: "Maria Santos",
      landlordId: "landlord@homigo.com",
      landlordName: "Juan Dela Cruz",
      status: "Approved",
      date: "2025-11-10",
      price: "₱9,200/month"
    },
    {
      id: 3,
      propertyId: 3,
      propertyTitle: "Shared Room in Quezon City",
      propertyImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
      studentId: "student@homigo.com",
      studentName: "Maria Santos",
      landlordId: "landlord@homigo.com",
      landlordName: "Angela Reyes",
      status: "Rejected",
      date: "2025-11-11",
      price: "₱6,000/month"
    }
  ])

  const createBooking = (property) => {
    const newBooking = {
      id: bookings.length + 1,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.image,
      studentId: user?.email,
      studentName: user?.name,
      landlordId: property.landlordId || "landlord@homigo.com",
      landlordName: property.landlordName || "Property Owner",
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      price: property.price
    }
    
    setBookings([...bookings, newBooking])
    return newBooking
  }

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ))
  }

  const getStudentBookings = () => {
    return bookings.filter(booking => booking.studentId === user?.email)
  }

  const getLandlordBookings = () => {
    return bookings.filter(booking => booking.landlordId === user?.email)
  }

  const isPropertyBooked = (propertyId) => {
    return bookings.some(
      booking => 
        booking.propertyId === propertyId && 
        booking.studentId === user?.email &&
        (booking.status === "Pending" || booking.status === "Approved")
    )
  }

  const value = {
    bookings,
    createBooking,
    updateBookingStatus,
    getStudentBookings,
    getLandlordBookings,
    isPropertyBooked
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}
