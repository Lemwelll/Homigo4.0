import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import PaymentOptionSelector from '../components/PaymentOptionSelector'
import EscrowInfoCard from '../components/EscrowInfoCard'
import ReceiptBreakdown from '../components/ReceiptBreakdown'
import PropertySummary from '../components/PropertySummary'
import PaymentForm from '../components/PaymentForm'
import Toast from '../components/Toast'
import { useBooking } from '../context/BookingContext'
import { ArrowLeft, CreditCard } from 'lucide-react'
import API_URL from '../config/api'

const SecurePayment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { createBooking, createEscrowPayment } = useBooking()
  
  // Get property from navigation state
  const property = location.state?.property

  const [selectedPaymentType, setSelectedPaymentType] = useState('full')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [toast, setToast] = useState(null)

  // Debug: Log property data
  console.log('SecurePayment - Received property:', property)

  if (!property) {
    return (
      <DashboardLayout userType="student">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Property Selected</h2>
          <button
            onClick={() => navigate('/student/browse')}
            className="btn-primary"
          >
            Browse Properties
          </button>
        </div>
      </DashboardLayout>
    )
  }

  // Payment rules from property - default to NO downpayment if not set
  const paymentRules = property.paymentRules || {
    allowReservations: true,
    enableDownpayment: false,
    downpaymentAmount: 0
  }

  const fullAmount = property.price
  const downpaymentAmount = paymentRules.downpaymentAmount || 0
  
  // If downpayment is not enabled, force full payment selection
  const isDownpaymentAvailable = paymentRules.enableDownpayment && downpaymentAmount > 0

  const handleProceedToPayment = () => {
    setShowPaymentForm(true)
  }

  const handlePaymentSubmit = async () => {
    try {
      // Prepare booking data in the format backend expects
      const amountPaid = selectedPaymentType === 'full' ? fullAmount : downpaymentAmount
      const totalAmount = selectedPaymentType === 'full' ? fullAmount : fullAmount
      const moveInDate = new Date()
      moveInDate.setDate(moveInDate.getDate() + 14) // 2 weeks from now

      // Get property ID - handle both naming conventions
      const propertyId = property.id || property.propertyId
      
      // Get landlord ID - handle both naming conventions
      let landlordId = property.landlord_id || property.landlordId
      
      // If still missing, try to fetch from backend
      if (!landlordId && propertyId) {
        console.log('⚠️ landlord_id missing, fetching from backend...')
        const token = localStorage.getItem('homigo_token')
        const response = await fetch(`${API_URL}/properties/${propertyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.success && data.data) {
          landlordId = data.data.landlord_id
          console.log('✅ Fetched landlord_id:', landlordId)
        }
      }

      const bookingData = {
        property_id: propertyId,
        landlord_id: landlordId,
        move_in_date: moveInDate.toISOString().split('T')[0],
        lease_duration_months: 12,
        monthly_rent: amountPaid,
        total_amount: totalAmount,
        payment_method: selectedPaymentType, // 'full' or 'downpayment'
        payment_reference: `REF-${Date.now()}`,
        student_message: `Booking for ${property.title}`
      }

      console.log('📤 Sending booking data:', bookingData)
      console.log('💰 Payment type:', selectedPaymentType)
      console.log('💵 Amount paid:', amountPaid)

      // Validate required fields before sending
      if (!bookingData.property_id || !bookingData.landlord_id || !bookingData.move_in_date) {
        throw new Error(`Missing required fields: property_id=${bookingData.property_id}, landlord_id=${bookingData.landlord_id}, move_in_date=${bookingData.move_in_date}`)
      }

      await createBooking(bookingData)
      
      setShowPaymentForm(false)
      setToast({
        message: `Payment submitted! Your ${selectedPaymentType === 'full' ? 'full payment' : 'downpayment'} is now held in escrow.`,
        type: 'success'
      })

      setTimeout(() => {
        navigate('/student/bookings')
      }, 2000)
    } catch (error) {
      console.error('Payment submission error:', error)
      setToast({
        message: 'Failed to create booking. Please try again.',
        type: 'error'
      })
    }
  }

  return (
    <DashboardLayout userType="student">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
          <p className="text-gray-600">Complete your booking with escrow protection</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Options & Escrow Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Option Selector */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <PaymentOptionSelector
                selectedOption={selectedPaymentType}
                onSelect={setSelectedPaymentType}
                fullAmount={fullAmount}
                downpaymentAmount={downpaymentAmount}
                downpaymentEnabled={isDownpaymentAvailable}
              />
            </div>

            {/* Escrow Info Card */}
            <EscrowInfoCard />

            {/* Proceed Button */}
            <button
              onClick={handleProceedToPayment}
              className="w-full px-6 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <CreditCard className="w-6 h-6" />
              Proceed to Payment
            </button>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Property Summary */}
            <PropertySummary property={property} />

            {/* Receipt Breakdown */}
            <ReceiptBreakdown
              rentPrice={property.price}
              reservationFee={500}
              paymentType={selectedPaymentType}
              downpaymentAmount={downpaymentAmount}
              fullAmount={fullAmount}
            />
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <PaymentForm
          property={{
            ...property,
            price: selectedPaymentType === 'full' ? fullAmount + 500 : downpaymentAmount + 500
          }}
          onSubmit={handlePaymentSubmit}
          onClose={() => setShowPaymentForm(false)}
        />
      )}

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

export default SecurePayment
