import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import ReservationList from '../components/ReservationList'
import Toast from '../components/Toast'
import { useReservation } from '../context/ReservationContext'
import { useStudent } from '../context/StudentContext'
import { useBooking } from '../context/BookingContext'
import { useAccountTier } from '../context/AccountTierContext'
import { Clock } from 'lucide-react'

const StudentReservations = () => {
  const navigate = useNavigate()
  const { getStudentReservations, cancelReservation } = useReservation()
  const { properties } = useStudent()
  const { getStudentBookings } = useBooking()
  const { accountState } = useAccountTier()
  const [toast, setToast] = useState(null)

  const reservations = getStudentReservations()
  const bookings = getStudentBookings()
  
  console.log('🔍 All reservations:', reservations)
  console.log('🔍 All bookings:', bookings)
  
  // Check if a reservation has a corresponding booking (payment completed)
  const hasBooking = (reservation) => {
    const found = bookings.some(booking => {
      console.log('Comparing:', {
        bookingPropertyId: booking.propertyId,
        reservationPropertyId: reservation.property_id,
        match: booking.propertyId === reservation.property_id
      })
      return booking.propertyId === reservation.property_id
    })
    console.log(`Reservation ${reservation.propertyTitle} has booking:`, found)
    return found
  }
  
  // Mark reservations as completed if they have bookings
  const reservationsWithStatus = reservations.map(reservation => {
    const newStatus = hasBooking(reservation) ? 'completed' : reservation.status
    console.log(`Reservation ${reservation.propertyTitle}: ${reservation.status} -> ${newStatus}`)
    return {
      ...reservation,
      status: newStatus
    }
  })
  
  console.log('📋 Final reservations with status:', reservationsWithStatus)

  const handleCancel = (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      cancelReservation(reservationId)
      setToast({ message: 'Reservation cancelled successfully', type: 'success' })
    }
  }

  const handleProceedToPayment = (reservation) => {
    // Extract numeric price from formatted string (e.g., "₱9,200/month" -> 9200)
    const numericPrice = parseInt(reservation.price.replace(/[^\d]/g, ''))
    
    // Find the full property details to get payment rules
    // Use property_id from reservation (snake_case from backend)
    const property = properties.find(p => p.id === reservation.property_id)
    
    console.log('🔍 Reservation object:', reservation)
    console.log('🔍 Property ID:', reservation.property_id)
    console.log('🔍 Landlord ID:', reservation.landlord_id)
    
    // Create property object using reservation data (which is what student actually reserved)
    // but merge with property payment rules if available
    const propertyData = {
      id: reservation.property_id, // Use snake_case from backend
      propertyId: reservation.property_id, // Also add camelCase for compatibility
      title: reservation.propertyTitle,
      image: reservation.propertyImage,
      price: numericPrice,
      landlord_id: reservation.landlord_id, // Use snake_case for backend compatibility
      landlordId: reservation.landlord_id, // Keep camelCase for display
      landlordName: reservation.landlordName,
      landlordPhone: reservation.landlordPhone || property?.landlordPhone || '+63 912 345 6789',
      landlordEmail: reservation.landlordEmail || property?.landlordEmail || 'landlord@email.com',
      location: property?.location || 'Property Location',
      city: property?.city || 'City',
      bedrooms: property?.bedrooms || 1,
      bathrooms: property?.bathrooms || 1,
      amenities: property?.amenities || ['WiFi', 'Water', 'Electricity'],
      address: property?.address || 'Property Address',
      description: property?.description || 'Property description',
      verified: property?.verified || true,
      // Use property payment rules if available, otherwise default to no downpayment
      paymentRules: property?.paymentRules || {
        allowReservations: true,
        enableDownpayment: false,
        downpaymentAmount: 0
      }
    }
    
    console.log('✅ Proceeding to payment with property:', propertyData)
    navigate('/student/secure-payment', { state: { property: propertyData } })
  }

  return (
    <DashboardLayout userType="student">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
          </div>
          <p className="text-gray-600">
            Manage your property reservations and proceed to payment when approved
            {accountState.tier === 'free' && (() => {
              const activePendingCount = reservations.filter(r => r.status === 'pending').length
              return (
                <span className="ml-2 text-sm">
                  ({activePendingCount}/2 active - <button onClick={() => navigate('/student/settings')} className="text-primary-600 hover:underline">Upgrade for unlimited</button>)
                </span>
              )
            })()}
          </p>
        </div>

        <ReservationList
          reservations={reservationsWithStatus}
          onCancel={handleCancel}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </DashboardLayout>
  )
}

export default StudentReservations
