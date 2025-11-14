import { useState } from 'react'
import ReservationCard from './ReservationCard'
import { Filter } from 'lucide-react'

const ReservationList = ({ reservations, onCancel, onProceedToPayment }) => {
  const [filter, setFilter] = useState('all')

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true
    if (filter === 'active') return reservation.status === 'reserved' || reservation.status === 'approved'
    if (filter === 'pending') return reservation.status === 'reserved'
    if (filter === 'approved') return reservation.status === 'approved'
    if (filter === 'expired') return reservation.status === 'expired'
    if (filter === 'rejected') return reservation.status === 'rejected'
    return true
  })

  return (
    <div>
      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filter Reservations</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'expired', label: 'Expired' },
            { value: 'rejected', label: 'Rejected' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No reservations found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map(reservation => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={() => onCancel(reservation.id)}
              onProceedToPayment={() => onProceedToPayment(reservation)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ReservationList
