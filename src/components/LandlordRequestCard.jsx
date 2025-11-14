import { User, Calendar, Home, Phone, Mail, MessageSquare, Shield, DollarSign } from 'lucide-react'
import CountdownTimer from './CountdownTimer'

const LandlordRequestCard = ({ reservation, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Property Image */}
        <div className="w-full md:w-48 h-48 flex-shrink-0">
          <img
            src={reservation.propertyImage}
            alt={reservation.propertyTitle}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{reservation.propertyTitle}</h3>
              <p className="text-2xl font-bold text-primary-600">{reservation.price}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                Pending Approval
              </span>
              {reservation.paymentType && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  reservation.paymentType === 'full' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  <DollarSign className="w-3 h-3 mr-1" />
                  {reservation.paymentType === 'full' ? 'Full Payment' : 'Downpayment'}
                </span>
              )}
            </div>
          </div>

          {/* Payment Info */}
          {reservation.paymentType && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Escrow Protected Payment</span>
              </div>
              <div className="text-sm text-blue-700">
                {reservation.paymentType === 'full' ? (
                  <p>Student paid full amount: <strong>{reservation.price}</strong></p>
                ) : (
                  <>
                    <p>Downpayment: <strong>₱{reservation.amountPaid?.toLocaleString()}</strong></p>
                    <p className="text-xs mt-1">Remaining: ₱{reservation.remainingBalance?.toLocaleString()}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Student Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-3">Student Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-700">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">{reservation.studentName}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                <span>{reservation.studentEmail}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <span>{reservation.studentPhone}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>Reserved on {new Date(reservation.reservedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Message */}
          {reservation.message && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Student's Message</p>
                  <p className="text-sm text-blue-700">{reservation.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-yellow-900">Reservation Expires In</span>
            </div>
            <CountdownTimer expiryDate={reservation.expiryDate} />
            <p className="text-xs text-yellow-700 mt-2">
              Respond before the timer expires to secure this booking
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onApprove(reservation.id)}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Approve Reservation
            </button>
            <button
              onClick={() => onReject(reservation.id)}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Decline Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandlordRequestCard
