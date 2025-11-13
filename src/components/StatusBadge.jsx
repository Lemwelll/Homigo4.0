import { Clock, CheckCircle, XCircle } from 'lucide-react'

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          icon: Clock,
          label: 'Pending'
        }
      case 'Approved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: CheckCircle,
          label: 'Approved'
        }
      case 'Rejected':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          icon: XCircle,
          label: 'Rejected'
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: Clock,
          label: status
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
