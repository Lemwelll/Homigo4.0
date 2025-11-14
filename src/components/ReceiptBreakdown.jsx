import { Receipt } from 'lucide-react'

const ReceiptBreakdown = ({ 
  rentPrice, 
  reservationFee = 500,
  paymentType,
  downpaymentAmount,
  fullAmount 
}) => {
  const payableToday = paymentType === 'full' ? fullAmount : downpaymentAmount
  const remainingBalance = paymentType === 'downpayment' ? fullAmount - downpaymentAmount : 0

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">Payment Breakdown</h3>
      </div>

      <div className="space-y-3">
        {/* Rent Price */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Monthly Rent</span>
          <span className="font-semibold text-gray-900">₱{rentPrice.toLocaleString()}</span>
        </div>

        {/* Reservation Fee */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Reservation Fee</span>
          <span className="font-semibold text-gray-900">₱{reservationFee.toLocaleString()}</span>
        </div>

        {/* Payment Type */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {paymentType === 'full' ? 'Full Payment' : 'Downpayment'}
          </span>
          <span className="font-semibold text-gray-900">
            ₱{(paymentType === 'full' ? fullAmount : downpaymentAmount).toLocaleString()}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Total Payable Today */}
        <div className="flex justify-between">
          <span className="text-base font-bold text-gray-900">Total Payable Today</span>
          <span className="text-2xl font-bold text-primary-600">
            ₱{(payableToday + reservationFee).toLocaleString()}
          </span>
        </div>

        {/* Remaining Balance */}
        {paymentType === 'downpayment' && remainingBalance > 0 && (
          <>
            <div className="border-t border-gray-200 my-3"></div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-yellow-900">Remaining Balance</span>
                <span className="text-lg font-bold text-yellow-700">
                  ₱{remainingBalance.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Due after landlord approval and before move-in
              </p>
            </div>
          </>
        )}
      </div>

      {/* Payment Method Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          All payments are held in escrow for your protection
        </p>
      </div>
    </div>
  )
}

export default ReceiptBreakdown
