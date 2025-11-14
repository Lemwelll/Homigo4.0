import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const ReservationCard = ({ reservation, onCancel, onProceedToPayment }) => {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    if (reservation.status !== 'reserved') return

    const calculateTimeLeft = () => {
      const expiryTime = new Date(reservation.expiryDate).getTime()
      const now = new Date().getTime()
      const difference = expiryTime - now

      if (difference <= 0) {
        return { expired: true }
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { hours, minutes, seconds, expired: false }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [reservation.expiryDate, reservation.status])

  const getStatusBadge = () => {
    switch (reservation.status) {
      case 'reserved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-4 h-4 mr-1" />
            Reserved – Pending Approval
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-4 h-4 mr-1" />
            Reservation Approved
          </span>
        )
      case 'expired':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            <AlertCircle className="w-4 h-4 mr-1" />
            Reservation Expired
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <XCircle className="w-4 h-4 mr-1" />
            Reservation Declined
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-2">{reservation.propertyTitle}</h3>
          {getStatusBadge()}
        </div>
        <img
          src={reservation.propertyImage}
          alt={reservation.propertyTitle}
          className="w-20 h-20 object-cover rounded-lg ml-4"
        />
      </div>

      {/* Countdown Timer */}
      {reservation.status === 'reserved' && timeLeft && !timeLeft.expired && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-900">Time Remaining</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-white rounded-lg px-3 py-2 text-center">
              <div className="text-2xl font-bold text-yellow-700">{timeLeft.hours}</div>
              <div className="text-xs text-gray-600">Hours</div>
            </div>
            <span className="text-2xl font-bold text-yellow-700">:</span>
            <div className="bg-white rounded-lg px-3 py-2 text-center">
              <div className="text-2xl font-bold text-yellow-700">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-600">Minutes</div>
            </div>
            <span className="text-2xl font-bold text-yellow-700">:</span>
            <div className="bg-white rounded-lg px-3 py-2 text-center">
              <div className="text-2xl font-bold text-yellow-700">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-600">Seconds</div>
            </div>
          </div>
          <p className="text-xs text-yellow-700 mt-2">
            Complete payment before timer expires to secure this property
          </p>
        </div>
      )}

      {/* Expired Message */}
      {reservation.status === 'expired' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700">
            This reservation has expired. The property is now available for other students.
          </p>
        </div>
      )}

      {/* Rejected Message */}
      {reservation.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-red-900 mb-1">Reservation Declined by Landlord</p>
          <p className="text-sm text-red-700">
            {reservation.rejectionReason || 'The landlord has declined your reservation request.'}
          </p>
        </div>
      )}

      {/* Approved Message */}
      {reservation.status === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-green-900 mb-1">Reservation Approved!</p>
          <p className="text-sm text-green-700">
            The landlord has approved your reservation. Proceed to payment to secure your booking.
          </p>
        </div>
      )}

      {/* Property Details */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>Reserved on:</span>
          <span className="font-medium text-gray-900">
            {new Date(reservation.reservedDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Monthly rent:</span>
          <span className="font-medium text-primary-600">{reservation.price}</span>
        </div>
        <div className="flex justify-between">
          <span>Landlord:</span>
          <span className="font-medium text-gray-900">{reservation.landlordName}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {reservation.status === 'reserved' && (
          <>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel Reservation
            </button>
          </>
        )}
        {reservation.status === 'approved' && (
          <button
            onClick={onProceedToPayment}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Proceed to Payment
          </button>
        )}
      </div>
    </div>
  )
}

export default ReservationCard
