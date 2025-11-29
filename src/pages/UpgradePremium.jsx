import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAccountTier } from '../context/AccountTierContext'
import DashboardLayout from '../components/DashboardLayout'
import { Crown, CheckCircle, Sparkles, CreditCard, Wallet, X } from 'lucide-react'

const UpgradePremium = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { accountState, upgradeToPremium } = useAccountTier()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('')
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    gcashNumber: ''
  })

  const isStudent = user?.role === 'student'
  const price = isStudent ? 149 : 199
  const planName = isStudent ? 'Premium Student' : 'Premium Landlord'

  const studentBenefits = [
    'Unlimited favorites',
    'Unlimited reservations',
    'Priority support',
    'Advanced search filters',
    'Early access to new listings'
  ]

  const landlordBenefits = [
    'Unlimited property listings',
    'Featured listings (top placement)',
    'Priority support & faster responses',
    'Advanced analytics & insights',
    'Verified landlord badge'
  ]

  const benefits = isStudent ? studentBenefits : landlordBenefits

  const handleShowPayment = () => {
    setShowPaymentModal(true)
  }

  const handleProcessPayment = async () => {
    // Validate payment details
    if (selectedPayment === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        alert('Please fill in all card details')
        return
      }
    } else if (selectedPayment === 'gcash') {
      if (!paymentDetails.gcashNumber) {
        alert('Please enter your GCash number')
        return
      }
    } else {
      alert('Please select a payment method')
      return
    }

    // Prepare payment data for backend
    const paymentData = {
      paymentMethod: selectedPayment,
      amount: price,
      cardDetails: selectedPayment === 'card' ? {
        cardNumber: paymentDetails.cardNumber,
        cardName: paymentDetails.cardName,
        expiryDate: paymentDetails.expiryDate,
        cvv: paymentDetails.cvv
      } : null,
      gcashNumber: selectedPayment === 'gcash' ? paymentDetails.gcashNumber : null
    }

    // Process payment through backend
    setShowPaymentModal(false)
    const result = await upgradeToPremium(paymentData)
    
    if (result.success) {
      setShowSuccess(true)
      setTimeout(() => {
        const dashboardPath = isStudent ? '/student/dashboard' : '/landlord/dashboard'
        navigate(dashboardPath)
      }, 2000)
    } else {
      alert(result.error || 'Payment failed. Please try again.')
    }
  }

  if (accountState.tier === 'premium') {
    return (
      <DashboardLayout userType={user?.role}>
        <div className="max-w-2xl mx-auto">
          <div className="card text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Already Premium!</h1>
            <p className="text-gray-600 mb-6">
              You're enjoying all the benefits of {planName}
            </p>
            <button
              onClick={() => navigate(isStudent ? '/student/dashboard' : '/landlord/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType={user?.role}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-gray-600">
            Unlock unlimited access and premium features
          </p>
        </div>

        {showSuccess && (
          <div className="card bg-green-50 border-2 border-green-500 mb-6">
            <div className="flex items-center gap-3 text-green-700">
              <Sparkles className="w-6 h-6" />
              <div>
                <p className="font-bold">You are now a premium member!</p>
                <p className="text-sm">All restrictions are removed. Redirecting to dashboard...</p>
              </div>
            </div>
          </div>
        )}

        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-primary-900 mb-2">{planName}</h2>
            <div className="text-5xl font-bold text-primary-900 mb-2">₱{price}</div>
            <p className="text-primary-700">per month</p>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Premium Benefits:</h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleShowPayment}
            disabled={showSuccess}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showSuccess ? 'Processing...' : 'Subscribe to Premium'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Secure payment processing
          </p>
        </div>

        <div className="card bg-gray-50">
          <h3 className="font-bold text-gray-900 mb-3">Current Plan: Free</h3>
          <p className="text-sm text-gray-600 mb-4">
            {isStudent 
              ? 'Limited to 3 favorites and 2 active reservations'
              : 'Limited to 3 property listings'}
          </p>
          <p className="text-sm text-gray-700">
            Upgrade now to remove all limitations and access premium features instantly.
          </p>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-primary-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary-600">₱{price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">per month</p>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Payment Method
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedPayment('card')}
                    className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                      selectedPayment === 'card'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-primary-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedPayment('gcash')}
                    className={`w-full p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                      selectedPayment === 'gcash'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Wallet className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">GCash</p>
                      <p className="text-sm text-gray-600">Mobile wallet payment</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Card Payment Form */}
              {selectedPayment === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentDetails.cardName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength="3"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* GCash Payment Form */}
              {selectedPayment === 'gcash' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GCash Mobile Number
                    </label>
                    <input
                      type="text"
                      placeholder="09XX XXX XXXX"
                      maxLength="11"
                      value={paymentDetails.gcashNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, gcashNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      You will receive a payment request on your GCash app
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessPayment}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition font-semibold"
                >
                  Pay ₱{price}
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-4">
                🔒 Demo mode - No actual payment will be processed
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default UpgradePremium
