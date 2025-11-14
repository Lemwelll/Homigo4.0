import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react'

const EscrowStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'Held in Escrow':
      case 'held':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          icon: Shield,
          label: 'Escrow Protected'
        }
      case 'Released':
      case 'released':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          icon: CheckCircle,
          label: 'Payment Released'
        }
      case 'Refunded':
      case 'refunded':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          icon: XCircle,
          label: 'Payment Refunded'
        }
      case 'Pending':
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          icon: Clock,
          label: 'Payment Pending'
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: Shield,
          label: status
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  )
}

export default EscrowStatusBadge
