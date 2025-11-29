import { CheckCircle, XCircle, X } from 'lucide-react'

const NotificationToast = ({ type, message, onClose }) => {
  const isSuccess = type === 'success'
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`
        flex items-start gap-3 p-4 rounded-lg shadow-lg max-w-md
        ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
      `}>
        {isSuccess ? (
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        )}
        
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${isSuccess ? 'text-green-900' : 'text-red-900'}`}>
            {isSuccess ? 'Success' : 'Error'}
          </h3>
          <p className={`text-sm ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className={`
            p-1 rounded-lg transition-colors flex-shrink-0
            ${isSuccess 
              ? 'hover:bg-green-100 text-green-600' 
              : 'hover:bg-red-100 text-red-600'
            }
          `}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default NotificationToast
