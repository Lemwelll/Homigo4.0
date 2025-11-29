import { X, CheckCircle, Clock, AlertCircle, Check, XCircle } from 'lucide-react'
import { useState } from 'react'
import PaymentStatusBadge from './PaymentStatusBadge'

const PaymentDetailsModal = ({ transaction, onClose, userType, onAccept, onDecline }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  
  if (!transaction) return null

  // Generate timeline from transaction data if not provided
  const generateTimeline = (trans) => {
    const timeline = []
    
    if (trans.createdAt || trans.heldDate) {
      timeline.push({
        status: 'held',
        date: trans.heldDate || trans.createdAt,
        label: 'Payment Held in Escrow'
      })
    }
    
    if (trans.status === 'released' && trans.releasedDate) {
      timeline.push({
        status: 'released',
        date: trans.releasedDate,
        label: 'Payment Released to Landlord'
      })
    }
    
    if (trans.status === 'refunded' && trans.refundedDate) {
      timeline.push({
        status: 'refunded',
        date: trans.refundedDate,
        label: 'Payment Refunded to Student'
      })
    }
    
    return timeline
  }

  const getTimelineIcon = (status) => {
    switch (status) {
      case 'released':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'refunded':
        return <CheckCircle className="w-5 h-5 text-purple-500" />
      case 'held':
        return <Clock className="w-5 h-5 text-blue-500" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Property Info */}
          <div className="flex gap-4">
            <img
              src={transaction.propertyImage}
              alt={transaction.propertyTitle}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {transaction.propertyTitle}
              </h3>
              <p className="text-gray-600 text-sm mb-2">ID: {transaction.propertyId}</p>
              <PaymentStatusBadge status={transaction.status} />
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-semibold text-gray-900">{transaction.id}</span>
            </div>
            
            {/* Payment Type Badge */}
            {transaction.paymentType && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Type</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  transaction.paymentType === 'full' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {transaction.paymentType === 'full' ? 'Paid in Full' : 'Downpayment'}
                </span>
              </div>
            )}
            
            {/* Show downpayment details if applicable */}
            {transaction.paymentType === 'downpayment' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Downpayment Amount</span>
                  <span className="font-semibold text-blue-600">₱{transaction.amount.toLocaleString()}</span>
                </div>
                {transaction.remainingBalance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining Balance</span>
                    <span className="font-semibold text-yellow-600">₱{transaction.remainingBalance.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="text-gray-900 font-medium">Total Property Price</span>
                  <span className="font-bold text-gray-900">₱{(transaction.amount + (transaction.remainingBalance || 0)).toLocaleString()}</span>
                </div>
              </>
            )}
            
            {/* Show full amount if not downpayment */}
            {transaction.paymentType !== 'downpayment' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold text-gray-900">₱{transaction.amount.toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold text-gray-900">{transaction.date}</span>
            </div>
            {userType === 'student' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Landlord</span>
                <span className="font-semibold text-gray-900">{transaction.landlordName}</span>
              </div>
            )}
            {userType === 'landlord' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Student</span>
                <span className="font-semibold text-gray-900">{transaction.studentName}</span>
              </div>
            )}
          </div>

          {/* Payment Timeline */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Payment Timeline</h4>
            <div className="space-y-4">
              {(transaction.timeline || generateTimeline(transaction)).map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {getTimelineIcon(item.status)}
                    {index < (transaction.timeline || generateTimeline(transaction)).length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {userType === 'landlord' && transaction.status === 'held' && onAccept && onDecline ? (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={async () => {
                  setIsProcessing(true)
                  await onAccept(transaction.id)
                  setIsProcessing(false)
                }}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                <Check className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Accept Payment'}
              </button>
              <button
                onClick={async () => {
                  setIsProcessing(true)
                  await onDecline(transaction.id)
                  setIsProcessing(false)
                }}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
              >
                <XCircle className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Decline Payment'}
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  disabled
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                >
                  Request Refund
                </button>
                <button
                  disabled
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                >
                  Contact Support
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Action buttons will be enabled in future updates
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentDetailsModal
