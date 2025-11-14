import { useState } from 'react'
import { Settings, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react'

const LandlordPaymentRulesForm = ({ initialRules, onSave }) => {
  const [rules, setRules] = useState(initialRules || {
    allowReservations: true,
    enableDownpayment: false,
    downpaymentAmount: 3000
  })

  const handleToggle = (field) => {
    setRules(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleAmountChange = (value) => {
    setRules(prev => ({ ...prev, downpaymentAmount: parseInt(value) || 0 }))
  }

  const handleSave = () => {
    if (onSave) {
      onSave(rules)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">Payment Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Allow Reservations */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Allow Reservations</h4>
            <p className="text-sm text-gray-600">
              Students can reserve this property with a 48-hour hold
            </p>
          </div>
          <button
            onClick={() => handleToggle('allowReservations')}
            className={`ml-4 p-2 rounded-lg transition-colors ${
              rules.allowReservations
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {rules.allowReservations ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Enable Downpayment */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Enable Downpayment Option</h4>
            <p className="text-sm text-gray-600">
              Allow students to pay in installments (downpayment + remaining)
            </p>
          </div>
          <button
            onClick={() => handleToggle('enableDownpayment')}
            className={`ml-4 p-2 rounded-lg transition-colors ${
              rules.enableDownpayment
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {rules.enableDownpayment ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Downpayment Amount */}
        {rules.enableDownpayment && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <label className="block mb-2">
              <span className="text-sm font-semibold text-blue-900">Downpayment Amount</span>
              <p className="text-xs text-blue-700 mt-1">
                Set the initial payment amount students must pay
              </p>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={rules.downpaymentAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="3000"
                min="0"
              />
            </div>
            <p className="text-xs text-blue-600 mt-2">
              ₱{rules.downpaymentAmount.toLocaleString()} PHP
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          Save Payment Settings
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Offering downpayment options can attract more students who prefer flexible payment terms.
        </p>
      </div>
    </div>
  )
}

export default LandlordPaymentRulesForm
