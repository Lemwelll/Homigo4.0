import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return context
}

// Generate initial bookings data
const getInitialBookings = (userEmail, userRole, userName) => {
  // For demo purposes, use fixed emails so data persists across logins
  // In production, this would come from the database
  const studentEmail = "student@homigo.com"
  const landlordEmail = "landlord@homigo.com"
  const studentName = "Demo Student"
  const landlordName = "Demo Landlord"

  return [
    // Student bookings
    {
      id: 1,
      propertyId: 1,
      propertyTitle: "Modern Studio near UP Diliman",
      propertyImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      studentId: studentEmail,
      studentName: studentName,
      studentEmail: studentEmail,
      studentPhone: "+63 917 123 4567",
      landlordId: "maria.santos@homigo.com",
      landlordName: "Maria Santos",
      status: "Pending",
      date: "2025-11-13",
      moveInDate: "2025-12-01",
      price: "₱8,500/month",
      duration: "6 months",
      message: "Hi! I'm interested in this property. I'm a 3rd year student at UP Diliman.",
      escrow: {
        status: "Held in Escrow",
        updatedAt: "2025-11-13"
      }
    },
    {
      id: 2,
      propertyId: 2,
      propertyTitle: "Cozy Apartment in Katipunan",
      propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      studentId: studentEmail,
      studentName: studentName,
      studentEmail: studentEmail,
      studentPhone: "+63 918 234 5678",
      landlordId: "john.reyes@homigo.com",
      landlordName: "John Reyes",
      status: "Approved",
      date: "2025-11-10",
      moveInDate: "2025-11-20",
      price: "₱9,200/month",
      duration: "12 months",
      message: "Looking for a long-term rental. Can move in by end of November.",
      escrow: {
        status: "Released",
        updatedAt: "2025-11-11"
      }
    },
    {
      id: 3,
      propertyId: 3,
      propertyTitle: "Shared Room in Quezon City",
      propertyImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
      studentId: studentEmail,
      studentName: studentName,
      studentEmail: studentEmail,
      studentPhone: "+63 919 345 6789",
      landlordId: "angela.reyes@homigo.com",
      landlordName: "Angela Reyes",
      status: "Rejected",
      date: "2025-11-11",
      moveInDate: "2025-11-15",
      price: "₱6,000/month",
      duration: "3 months",
      message: "Need a place for one semester only.",
      escrow: {
        status: "Refunded",
        updatedAt: "2025-11-12"
      }
    },
    {
      id: 13,
      propertyId: 13,
      propertyTitle: "Spacious Room near FEU",
      propertyImage: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400",
      studentId: studentEmail,
      studentName: studentName,
      studentEmail: studentEmail,
      studentPhone: "+63 920 456 7890",
      landlordId: "roberto.cruz@homigo.com",
      landlordName: "Roberto Cruz",
      status: "Pending",
      date: "2025-11-12",
      moveInDate: "2025-12-05",
      price: "₱7,500/month",
      duration: "8 months",
      message: "FEU student looking for accommodation near campus."
    },
    {
      id: 14,
      propertyId: 14,
      propertyTitle: "Affordable Bedspace in Manila",
      propertyImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
      studentId: studentEmail,
      studentName: studentName,
      studentEmail: studentEmail,
      studentPhone: "+63 921 567 8901",
      landlordId: "linda.garcia@homigo.com",
      landlordName: "Linda Garcia",
      status: "Approved",
      date: "2025-11-08",
      moveInDate: "2025-11-18",
      price: "₱5,000/month",
      duration: "10 months",
      message: "Need affordable accommodation for the school year."
    },
    {
      id: 15,
      propertyId: 15,
      propertyTitle: "Premium Condo in Makati",
      propertyImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400",
      studentId: studentEmail,
      studentName: studentName,
      studentEmail: studentEmail,
      studentPhone: "+63 922 678 9012",
      landlordId: "patricia.lim@homigo.com",
      landlordName: "Patricia Lim",
      status: "Pending",
      date: "2025-11-13",
      moveInDate: "2025-12-10",
      price: "₱16,000/month",
      duration: "6 months",
      message: "Working student. Need a place close to my office."
    },
    {
      id: 16,
      propertyId: 16,
      propertyTitle: "Shared Apartment in Pasay",
      propertyImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400",
      studentId: studentEmail,
      studentName: studentName,
      studentEmail: studentEmail,
      studentPhone: "+63 923 789 0123",
      landlordId: "miguel.santos@homigo.com",
      landlordName: "Miguel Santos",
      status: "Rejected",
      date: "2025-11-09",
      moveInDate: "2025-11-16",
      price: "₱8,000/month",
      duration: "4 months",
      message: "Looking for short-term accommodation."
    },
    {
      id: 17,
      propertyId: 17,
      propertyTitle: "Single Room in Mandaluyong",
      propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
      studentId: studentEmail,
      studentName: studentName,
      studentEmail: studentEmail,
      studentPhone: "+63 924 890 1234",
      landlordId: "carmen.diaz@homigo.com",
      landlordName: "Carmen Diaz",
      status: "Approved",
      date: "2025-11-07",
      moveInDate: "2025-11-25",
      price: "₱9,500/month",
      duration: "12 months",
      message: "Looking for a quiet place to focus on studies."
    },
    // Landlord bookings (these will show for landlord@homigo.com)
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
      status: "Pending",
      date: "2025-11-12",
      moveInDate: "2025-12-05",
      price: "₱12,000/month",
      duration: "12 months",
      message: "I'm a graduate student at DLSU. Looking for a quiet place to study.",
      escrow: {
        status: "Held in Escrow",
        updatedAt: "2025-11-12"
      }
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
      status: "Approved",
      date: "2025-11-08",
      moveInDate: "2025-11-18",
      price: "₱5,500/month",
      duration: "10 months",
      message: "UST student. Need accommodation for the school year.",
      escrow: {
        status: "Released",
        updatedAt: "2025-11-09"
      }
    },
    {
      id: 6,
      propertyId: 6,
      propertyTitle: "Fully Furnished Studio in Makati",
      propertyImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400",
      studentId: "juan.delacruz@email.com",
      studentName: "Juan Dela Cruz",
      studentEmail: "juan.delacruz@email.com",
      studentPhone: "+63 923 789 0123",
      landlordId: "landlord@homigo.com",
      landlordName: "Demo Landlord",
      status: "Pending",
      date: "2025-11-13",
      moveInDate: "2025-12-10",
      price: "₱15,000/month",
      duration: "6 months",
      message: "Working student. Need a place close to my office in Makati.",
      escrow: {
        status: "Held in Escrow",
        updatedAt: "2025-11-13"
      }
    },
    {
      id: 7,
      propertyId: 7,
      propertyTitle: "Bedspace in Sampaloc",
      propertyImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400",
      studentId: "anna.reyes@email.com",
      studentName: "Mark Lopez",
      studentEmail: "mark.lopez@email.com",
      studentPhone: "+63 924 890 1234",
      landlordId: "landlord@homigo.com",
      landlordName: "Demo Landlord",
      status: "Approved",
      date: "2025-11-09",
      moveInDate: "2025-11-16",
      price: "₱4,500/month",
      duration: "8 months",
      message: "First year college student. Looking for affordable accommodation.",
      escrow: {
        status: "Released",
        updatedAt: "2025-11-10"
      }
    },
    {
      id: 8,
      propertyId: 8,
      propertyTitle: "Two-Bedroom Apartment in Marikina",
      propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
      studentId: "pedro.garcia@email.com",
      studentName: "Grace Santos",
      studentEmail: "grace.santos@email.com",
      studentPhone: "+63 925 901 2345",
      landlordId: "landlord@homigo.com",
      landlordName: "Demo Landlord",
      status: "Rejected",
      date: "2025-11-07",
      moveInDate: "2025-11-25",
      price: "₱18,000/month",
      duration: "12 months",
      message: "Looking to share with a roommate. Both of us are working students.",
      escrow: {
        status: "Refunded",
        updatedAt: "2025-11-08"
      }
    },
    {
      id: 9,
      propertyId: 9,
      propertyTitle: "Single Room near Ateneo",
      propertyImage: "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=400",
      studentId: "lisa.tan@email.com",
      studentName: "Daniel Kim",
      studentEmail: "daniel.kim@email.com",
      studentPhone: "+63 926 012 3456",
      landlordId: "landlord@homigo.com",
      landlordName: "Demo Landlord",
      status: "Pending",
      date: "2025-11-13",
      moveInDate: "2025-12-01",
      price: "₱10,500/month",
      duration: "9 months",
      message: "Ateneo student. Prefer a quiet environment for studying.",
      escrow: {
        status: "Held in Escrow",
        updatedAt: "2025-11-13"
      }
    },
    {
      id: 10,
      propertyId: 10,
      propertyTitle: "Penthouse Unit in BGC",
      propertyImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      studentId: "mark.lopez@email.com",
      studentName: "Patricia Lim",
      studentEmail: "patricia.lim@email.com",
      studentPhone: "+63 927 123 4567",
      landlordId: "landlord@homigo.com",
      landlordName: "Demo Landlord",
      status: "Approved",
      date: "2025-11-06",
      moveInDate: "2025-11-15",
      price: "₱25,000/month",
      duration: "12 months",
      message: "MBA student. Looking for premium accommodation near campus.",
      escrow: {
        status: "Released",
        updatedAt: "2025-11-07"
      }
    },
    {
      id: 11,
      propertyId: 11,
      propertyTitle: "Affordable Room in Pasig",
      propertyImage: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400",
      studentId: "grace.santos@email.com",
      studentName: "Roberto Cruz",
      studentEmail: "roberto.cruz@email.com",
      studentPhone: "+63 928 234 5678",
      landlordId: "landlord@homigo.com",
      landlordName: "Demo Landlord",
      status: "Pending",
      date: "2025-11-12",
      moveInDate: "2025-11-28",
      price: "₱7,000/month",
      duration: "6 months",
      message: "College student. Need a safe and affordable place.",
      escrow: {
        status: "Held in Escrow",
        updatedAt: "2025-11-12"
      }
    },
    {
      id: 12,
      propertyId: 12,
      propertyTitle: "Luxury Condo in Ortigas",
      propertyImage: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=400",
      studentId: "daniel.kim@email.com",
      studentName: "Jennifer Tan",
      studentEmail: "jennifer.tan@email.com",
      studentPhone: "+63 929 345 6789",
      landlordId: "landlord@homigo.com",
      landlordName: "Demo Landlord",
      status: "Rejected",
      date: "2025-11-05",
      moveInDate: "2025-11-20",
      price: "₱20,000/month",
      duration: "12 months",
      message: "International student. Looking for modern amenities.",
      escrow: {
        status: "Refunded",
        updatedAt: "2025-11-06"
      }
    }
  ]
}

export const BookingProvider = ({ children }) => {
  const { user } = useAuth()

  // Initialize bookings from localStorage or generate new ones
  const [bookings, setBookings] = useState(() => {
    const stored = localStorage.getItem('homigoBookings')
    if (stored) {
      try {
        const parsedBookings = JSON.parse(stored)
        // If stored bookings exist and have data, use them
        if (parsedBookings && parsedBookings.length > 0) {
          return parsedBookings
        }
      } catch (error) {
        console.error('Error parsing stored bookings:', error)
      }
    }
    
    // Generate initial bookings with current user or default
    // For landlords, use their email; for students, use their email
    const currentEmail = user?.email || (user?.role === 'landlord' ? 'landlord@homigo.com' : 'student@homigo.com')
    const currentRole = user?.role || 'student'
    const currentName = user?.name || 'Current User'
    
    return getInitialBookings(currentEmail, currentRole, currentName)
  })

  // Save to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('homigoBookings', JSON.stringify(bookings))
  }, [bookings])

  const createBooking = (property) => {
    const newBooking = {
      id: Date.now(), // Use timestamp for unique ID
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.image,
      studentId: user?.email,
      studentName: user?.name,
      studentEmail: user?.email,
      studentPhone: user?.phone || "+63 917 123 4567",
      landlordId: property.landlordId || "landlord@homigo.com",
      landlordName: property.landlordName || "Property Owner",
      status: "Pending",
      date: new Date().toISOString().split('T')[0],
      moveInDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
      price: `₱${property.price.toLocaleString()}/month`,
      duration: "12 months",
      message: "I'm interested in renting this property.",
      paymentType: property.paymentType || 'full',
      amountPaid: property.amountPaid || property.price,
      remainingBalance: property.remainingBalance || 0
    }

    setBookings(prev => [...prev, newBooking])
    return newBooking
  }

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings(bookings.map(booking => {
      if (booking.id === bookingId) {
        // Determine escrow status based on booking status
        let escrowStatus = booking.escrow?.status || 'Pending'

        if (newStatus === 'Approved') {
          escrowStatus = 'Released'
        } else if (newStatus === 'Rejected') {
          escrowStatus = 'Refunded'
        }

        return {
          ...booking,
          status: newStatus,
          escrow: {
            status: escrowStatus,
            updatedAt: new Date().toISOString()
          }
        }
      }
      return booking
    }))
  }

  const createEscrowPayment = (bookingId) => {
    setBookings(bookings.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          escrow: {
            status: 'Held in Escrow',
            updatedAt: new Date().toISOString()
          }
        }
      }
      return booking
    }))
  }

  const releaseEscrowPayment = (bookingId) => {
    setBookings(bookings.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: 'Approved',
          escrow: {
            status: 'Released',
            updatedAt: new Date().toISOString()
          }
        }
      }
      return booking
    }))
  }

  const refundEscrowPayment = (bookingId) => {
    setBookings(bookings.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: 'Rejected',
          escrow: {
            status: 'Refunded',
            updatedAt: new Date().toISOString()
          }
        }
      }
      return booking
    }))
  }

  const getStudentBookings = () => {
    // For demo purposes, show all student bookings to any student user
    // In production, this would filter by actual student ID
    if (user?.role === 'student') {
      return bookings.filter(booking => 
        booking.studentId === user?.email || 
        booking.studentId === 'student@homigo.com'
      )
    }
    return bookings.filter(booking => booking.studentId === user?.email)
  }

  const getLandlordBookings = () => {
    // For demo purposes, show all landlord bookings to any landlord user
    // In production, this would filter by actual landlord ID
    if (user?.role === 'landlord') {
      return bookings.filter(booking => 
        booking.landlordId === user?.email || 
        booking.landlordId === 'landlord@homigo.com'
      )
    }
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
    isPropertyBooked,
    createEscrowPayment,
    releaseEscrowPayment,
    refundEscrowPayment
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}
