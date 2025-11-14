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

  const handlePaymentSubmit = () => {
    // Create booking with payment type
    const bookingData = {
      ...property,
      paymentType: selectedPaymentType,
      amountPaid: selectedPaymentType === 'full' ? fullAmount : downpaymentAmount,
      remainingBalance: selectedPaymentType === 'downpayment' ? fullAmount - downpaymentAmount : 0
    }

    const booking = createBooking(bookingData)
    createEscrowPayment(booking.id)

    setShowPaymentForm(false)
    setToast({
      message: `Payment submitted! Your ${selectedPaymentType === 'full' ? 'full payment' : 'downpayment'} is now held in escrow.`,
      type: 'success'
    })

    setTimeout(() => {
      navigate('/student/bookings')
    }, 2000)
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
