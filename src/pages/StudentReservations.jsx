import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import ReservationList from '../components/ReservationList'
import Toast from '../components/Toast'
import { useReservation } from '../context/ReservationContext'
import { useStudent } from '../context/StudentContext'
import { Clock } from 'lucide-react'

const StudentReservations = () => {
  const navigate = useNavigate()
  const { getStudentReservations, cancelReservation } = useReservation()
  const { properties } = useStudent()
  const [toast, setToast] = useState(null)

  const reservations = getStudentReservations()

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
    const property = properties.find(p => p.id === reservation.propertyId)
    
    // Create property object using reservation data (which is what student actually reserved)
    // but merge with property payment rules if available
    const propertyData = {
      id: reservation.propertyId,
      title: reservation.propertyTitle,
      image: reservation.propertyImage,
      price: numericPrice,
      landlordId: reservation.landlordId,
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
    
    console.log('Proceeding to payment with property:', propertyData)
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
          </p>
        </div>

        <ReservationList
          reservations={reservations}
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
