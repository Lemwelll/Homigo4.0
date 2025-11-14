import { Check } from 'lucide-react'

const PaymentOptionSelector = ({ 
  selectedOption, 
  onSelect, 
  fullAmount, 
  downpaymentAmount,
  downpaymentEnabled 
}) => {
  const options = [
    {
      id: 'full',
      title: 'Full Payment',
      amount: fullAmount,
      description: 'Pay the full amount now',
      badge: 'Most Popular',
      recommended: true
    }
  ]

  if (downpaymentEnabled) {
    options.push({
      id: 'downpayment',
      title: 'Downpayment',
      amount: downpaymentAmount,
      description: `Pay ₱${downpaymentAmount.toLocaleString()} now, rest later`,
      badge: 'Flexible',
      recommended: false
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Select Payment Option</h3>
      
      {/* Info message when downpayment is not available */}
      {!downpaymentEnabled && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            ℹ️ This property only accepts full payment. Downpayment option is not available.
          </p>
        </div>
      )}

      <div className={`grid ${downpaymentEnabled ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
              selectedOption === option.id
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            {/* Checkmark */}
            {selectedOption === option.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Badge */}
            {option.badge && (
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                option.recommended 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {option.badge}
              </div>
            )}

            {/* Title */}
            <h4 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h4>

            {/* Amount */}
            <p className="text-3xl font-bold text-primary-600 mb-2">
              ₱{option.amount.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-sm text-gray-600">{option.description}</p>

            {/* Additional info for downpayment */}
            {option.id === 'downpayment' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Remaining: ₱{(fullAmount - downpaymentAmount).toLocaleString()}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PaymentOptionSelector
