import { Settings, Check, X } from 'lucide-react'

const ReservationSettingsCard = ({ property }) => {
  const { paymentRules } = property

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">Payment Rules</h3>
      </div>

      <div className="space-y-3">
        {/* Reservations Allowed */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Reservations</span>
          <div className="flex items-center gap-2">
            {paymentRules?.allowReservations ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Allowed</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-600">Not Allowed</span>
              </>
            )}
          </div>
        </div>

        {/* Downpayment Option */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Downpayment Option</span>
          <div className="flex items-center gap-2">
            {paymentRules?.enableDownpayment ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">Enabled</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-400">Disabled</span>
              </>
            )}
          </div>
        </div>

        {/* Downpayment Amount */}
        {paymentRules?.enableDownpayment && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Downpayment Amount</span>
              <span className="text-lg font-bold text-blue-600">
                ₱{paymentRules.downpaymentAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Students can pay this amount upfront
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservationSettingsCard
