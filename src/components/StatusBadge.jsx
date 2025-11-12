import React from 'react'

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Verified':
      case 'Resolved':
        return 'bg-green-100 text-green-700'
      case 'Pending':
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-700'
      case 'Rejected':
      case 'Suspended':
      case 'Dismissed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles()}`}>
      {status}
    </span>
  )
}

export default StatusBadge
