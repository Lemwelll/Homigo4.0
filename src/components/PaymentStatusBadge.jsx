const PaymentStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending'
    },
    held: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Held in Escrow'
    },
    released: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Released'
    },
    refunded: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      label: 'Refunded'
    }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

export default PaymentStatusBadge
