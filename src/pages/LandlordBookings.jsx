import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useBooking } from '../context/BookingContext'
import BookingCard from '../components/BookingCard'
import Toast from '../components/Toast'
import ConfirmModal from '../components/ConfirmModal'
import { Calendar, Filter, Clock, CheckCircle, XCircle, Home } from 'lucide-react'

const LandlordBookings = () => {
  const { getLandlordBookings, releaseEscrowPayment, refundEscrowPayment } = useBooking()
  const [filter, setFilter] = useState('All')
  const [toast, setToast] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)

  const bookings = getLandlordBookings()

  const filteredBookings = filter === 'All'
    ? bookings
    : bookings.filter(b => b.status === filter)

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    approved: bookings.filter(b => b.status === 'Approved').length,
    rejected: bookings.filter(b => b.status === 'Rejected').length
  }

  const handleApprove = (bookingId) => {
    setConfirmModal({
      title: 'Approve Booking & Release Payment',
      message: 'This will approve the booking and release the escrow payment to you. Continue?',
      confirmText: 'Approve & Release',
      confirmColor: 'green',
      onConfirm: () => {
        releaseEscrowPayment(bookingId)
        setToast({ message: 'Booking approved! Payment released from escrow.', type: 'success' })
        setConfirmModal(null)
      }
    })
  }

  const handleReject = (bookingId) => {
    setConfirmModal({
      title: 'Reject Booking & Refund Payment',
      message: 'This will reject the booking and refund the escrow payment to the student. Continue?',
      confirmText: 'Reject & Refund',
      confirmColor: 'red',
      onConfirm: () => {
        refundEscrowPayment(bookingId)
        setToast({ message: 'Booking rejected. Payment refunded to student.', type: 'info' })
        setConfirmModal(null)
      }
    })
  }

  return (
    <DashboardLayout userType="landlord">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Booking Requests</h1>
          <p className="text-gray-600">Manage booking requests for your properties</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Requests</p>
              <Home className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending</p>
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Approved</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Rejected</p>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filter by Status</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'All' ? 'No booking requests yet' : `No ${filter.toLowerCase()} requests`}
              </h3>
              <p className="text-gray-600">
                {filter === 'All'
                  ? 'Booking requests will appear here when students book your properties.'
                  : `You don't have any ${filter.toLowerCase()} requests at the moment.`
                }
              </p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                userRole="landlord"
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
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

        {/* Confirm Modal */}
        {confirmModal && (
          <ConfirmModal
            isOpen={true}
            onClose={() => setConfirmModal(null)}
            {...confirmModal}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default LandlordBookings
