import { Clock, CheckCircle, XCircle } from 'lucide-react'

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    const normalizedStatus = status?.toLowerCase()
    
    switch (normalizedStatus) {
      case 'pending':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: Clock,
          label: 'Pending'
        }
      case 'approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: CheckCircle,
          label: 'Approved'
        }
      case 'rejected':
      case 'denied':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          icon: XCircle,
          label: 'Rejected'
        }
      case 'cancelled':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: XCircle,
          label: 'Cancelled'
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: Clock,
          label: status || 'Unknown'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </span>
  )
}

export default StatusBadge
