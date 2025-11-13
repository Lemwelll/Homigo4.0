import { useEffect } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react'

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const config = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-500'
    }
  }

  const style = config[type]
  const Icon = style.icon

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 flex items-center space-x-3 min-w-[300px]`}>
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0`} />
        <p className={`${style.text} font-medium flex-1`}>{message}</p>
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70`}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast
