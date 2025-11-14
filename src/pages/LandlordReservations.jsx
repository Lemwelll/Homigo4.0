import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import LandlordRequestCard from '../components/LandlordRequestCard'
import Toast from '../components/Toast'
import { useReservation } from '../context/ReservationContext'
import { Clock, CheckCircle } from 'lucide-react'

const LandlordReservations = () => {
  const { getLandlordReservations, approveReservation, rejectReservation } = useReservation()
  const [toast, setToast] = useState(null)

  const reservations = getLandlordReservations()
  const pendingReservations = reservations.filter(r => r.status === 'reserved')
  const processedReservations = reservations.filter(r => r.status !== 'reserved')

  const handleApprove = (reservationId) => {
    approveReservation(reservationId)
    setToast({ message: 'Reservation approved! Student can now proceed to payment.', type: 'success' })
  }

  const handleReject = (reservationId) => {
    const reason = window.prompt('Please provide a reason for declining (optional):')
    rejectReservation(reservationId, reason || 'Property is no longer available.')
    setToast({ message: 'Reservation declined', type: 'info' })
  }

  return (
    <DashboardLayout userType="landlord">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-secondary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Reservation Requests</h1>
          </div>
          <p className="text-gray-600">
            Review and respond to property reservation requests from students
          </p>
        </div>

        {/* Pending Requests */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Requests ({pendingReservations.length})
          </h2>
          {pendingReservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No pending reservation requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReservations.map(reservation => (
                <LandlordRequestCard
                  key={reservation.id}
                  reservation={reservation}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>

        {/* Processed Requests */}
        {processedReservations.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Processed Requests ({processedReservations.length})
            </h2>
            <div className="space-y-4">
              {processedReservations.map(reservation => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <img
                        src={reservation.propertyImage}
                        alt={reservation.propertyTitle}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{reservation.propertyTitle}</h3>
                        <p className="text-sm text-gray-600 mb-2">{reservation.studentName}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(reservation.reservedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      reservation.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : reservation.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {reservation.status === 'approved' && '✓ Approved'}
                      {reservation.status === 'rejected' && '✗ Declined'}
                      {reservation.status === 'expired' && 'Expired'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </DashboardLayout>
  )
}

export default LandlordReservations
