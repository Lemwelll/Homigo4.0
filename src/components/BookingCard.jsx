import { Calendar, User, Home, Shield, DollarSign } from 'lucide-react'
import StatusBadge from './StatusBadge'
import EscrowStatusBadge from './EscrowStatusBadge'

const BookingCard = ({ booking, userRole, onApprove, onReject, onCancel }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Property Image */}
        <div className="w-full sm:w-24 h-24 flex-shrink-0">
          <img
            src={booking.propertyImage}
            alt={booking.propertyTitle}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Booking Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {booking.propertyTitle}
            </h3>
            <div className="flex flex-col gap-1">
              <StatusBadge status={booking.status} />
              {booking.escrow && (
                <EscrowStatusBadge status={booking.escrow.status} />
              )}
              {booking.paymentType && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  booking.paymentType === 'full' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  <DollarSign className="w-3 h-3 mr-1" />
                  {booking.paymentType === 'full' ? 'Paid in Full' : 'Downpayment'}
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-1 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {userRole === 'student' ? booking.landlordName : booking.studentName}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium text-blue-600">{booking.price}</span>
            </div>
          </div>

          {/* Escrow Information */}
          {booking.escrow && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Escrow Protected</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                {booking.escrow.status === 'Held in Escrow' && 'Payment securely held until confirmed'}
                {booking.escrow.status === 'Released' && 'Payment released to landlord'}
                {booking.escrow.status === 'Refunded' && 'Payment refunded to student'}
              </p>
              {booking.paymentType === 'downpayment' && booking.remainingBalance > 0 && (
                <p className="text-xs text-yellow-700 mt-2 font-medium">
                  Remaining Balance: ₱{booking.remainingBalance.toLocaleString()}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {/* Landlord Actions */}
            {userRole === 'landlord' && booking.status === 'Pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(booking.id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Approve & Release
                </button>
                <button
                  onClick={() => onReject(booking.id)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject & Refund
                </button>
              </div>
            )}

            {/* Student Actions */}
            {userRole === 'student' && booking.status === 'Pending' && onCancel && (
              <button
                onClick={() => onCancel(booking.id)}
                className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel Booking
              </button>
            )}
            
            {/* Status Messages */}
            {booking.status !== 'Pending' && (
              <div className="text-sm text-gray-600">
                {booking.status === 'Approved' && (
                  <span className="text-green-600 font-medium">
                    ✓ {userRole === 'landlord' ? 'Approved' : 'Booking Confirmed'}
                    {booking.escrow?.status === 'Released' && ' • Payment Released'}
                  </span>
                )}
                {booking.status === 'Rejected' && (
                  <span className="text-red-600 font-medium">
                    ✗ {userRole === 'landlord' ? 'Rejected' : 'Booking Declined'}
                    {booking.escrow?.status === 'Refunded' && ' • Payment Refunded'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingCard
