import { Calendar, User, Home } from 'lucide-react'
import StatusBadge from './StatusBadge'

const BookingCard = ({ booking, userRole, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
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
          <h3 className="font-semibold text-gray-900 mb-2 truncate">
            {booking.propertyTitle}
          </h3>
          
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <StatusBadge status={booking.status} />
            
            {/* Landlord Actions */}
            {userRole === 'landlord' && booking.status === 'Pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onApprove(booking.id)}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(booking.id)}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingCard
