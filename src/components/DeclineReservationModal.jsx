import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'

const DeclineReservationModal = ({ isOpen, onClose, onConfirm, reservation }) => {
  const [reason, setReason] = useState('')
  const [selectedReason, setSelectedReason] = useState('')

  const predefinedReasons = [
    'Property is no longer available',
    'Property is already reserved by another tenant',
    'Property requires maintenance',
    'Student does not meet requirements',
    'Other (please specify below)'
  ]

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Other (please specify below)' 
      ? reason 
      : selectedReason || reason || 'Property is no longer available'
    
    onConfirm(finalReason)
    handleClose()
  }

  const handleClose = () => {
    setReason('')
    setSelectedReason('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 transform transition-all">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Decline Reservation
              </h3>
              <p className="text-sm text-gray-600">
                Please provide a reason for declining this reservation request
              </p>
            </div>
          </div>

          {/* Property Info */}
          {reservation && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <img
                  src={reservation.propertyImage}
                  alt={reservation.propertyTitle}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {reservation.propertyTitle}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Student: {reservation.studentName}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₱{reservation.price?.toLocaleString()}/month
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Predefined Reasons */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select a reason:
            </label>
            <div className="space-y-2">
              {predefinedReasons.map((preReason) => (
                <label
                  key={preReason}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedReason === preReason
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={preReason}
                    checked={selectedReason === preReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{preReason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason Textarea */}
          {selectedReason === 'Other (please specify below)' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify your reason:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason for declining..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">This action cannot be undone</p>
                <p>The student will be notified about the declined reservation and the reason you provided.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedReason && !reason}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline Reservation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeclineReservationModal
