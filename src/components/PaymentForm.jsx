import { useState } from 'react'
import { CreditCard, Building2, Shield, X, AlertCircle } from 'lucide-react'

const PaymentForm = ({ property, onSubmit, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card' or 'bank'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Card payment fields
  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  })

  // Bank transfer fields
  const [bankData, setBankData] = useState({
    accountName: '',
    accountNumber: '',
    bankName: ''
  })

  const validateCardForm = () => {
    const newErrors = {}
    
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required'
    }
    
    if (!cardData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required'
    } else if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits'
    }
    
    if (!cardData.expirationDate.trim()) {
      newErrors.expirationDate = 'Expiration date is required'
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expirationDate)) {
      newErrors.expirationDate = 'Format must be MM/YY'
    }
    
    if (!cardData.cvv.trim()) {
      newErrors.cvv = 'CVV is required'
    } else if (cardData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits'
    }
    
    return newErrors
  }

  const validateBankForm = () => {
    const newErrors = {}
    
    if (!bankData.accountName.trim()) {
      newErrors.accountName = 'Account name is required'
    }
    
    if (!bankData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required'
    }
    
    if (!bankData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required'
    }
    
    return newErrors
  }

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s/g, '')
    if (value.length <= 16 && /^\d*$/.test(value)) {
      // Format with spaces every 4 digits
      value = value.match(/.{1,4}/g)?.join(' ') || value
      setCardData({ ...cardData, cardNumber: value })
    }
  }

  const handleExpirationChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length <= 4) {
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2)
      }
      setCardData({ ...cardData, expirationDate: value })
    }
  }

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 3) {
      setCardData({ ...cardData, cvv: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate based on payment method
    const validationErrors = paymentMethod === 'card' 
      ? validateCardForm() 
      : validateBankForm()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        method: paymentMethod,
        data: paymentMethod === 'card' ? cardData : bankData,
        amount: property.price,
        timestamp: new Date().toISOString()
      }
      
      onSubmit(paymentData)
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
            <p className="text-sm text-gray-600 mt-1">Complete payment to hold booking in escrow</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Escrow Protected Payment</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Your payment will be securely held until the landlord approves your booking
            </p>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-900">{property.title}</p>
              <p className="text-2xl font-bold text-primary-600 mt-1">{property.price}</p>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'card'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'card' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <p className={`text-sm font-medium ${
                  paymentMethod === 'card' ? 'text-primary-900' : 'text-gray-700'
                }`}>
                  Credit/Debit Card
                </p>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className={`w-6 h-6 mx-auto mb-2 ${
                  paymentMethod === 'bank' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <p className={`text-sm font-medium ${
                  paymentMethod === 'bank' ? 'text-primary-900' : 'text-gray-700'
                }`}>
                  Bank Transfer
                </p>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit}>
            {paymentMethod === 'card' ? (
              <div className="space-y-4">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardData.cardholderName}
                    onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                      errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                  {errors.cardholderName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={handleCardNumberChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012 3456"
                    disabled={isSubmitting}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                {/* Expiration & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      value={cardData.expirationDate}
                      onChange={handleExpirationChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                        errors.expirationDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="MM/YY"
                      disabled={isSubmitting}
                    />
                    {errors.expirationDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.expirationDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      onChange={handleCvvChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123"
                      disabled={isSubmitting}
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Account Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={bankData.accountName}
                    onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                      errors.accountName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                    disabled={isSubmitting}
                  />
                  {errors.accountName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.accountName}
                    </p>
                  )}
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={bankData.accountNumber}
                    onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                      errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1234567890"
                    disabled={isSubmitting}
                  />
                  {errors.accountNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.accountNumber}
                    </p>
                  )}
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankData.bankName}
                    onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
                      errors.bankName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="BDO, BPI, Metrobank, etc."
                    disabled={isSubmitting}
                  />
                  {errors.bankName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.bankName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Submit Payment & Hold in Escrow
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Your payment information is encrypted and secure
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaymentForm
