import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

const CountdownTimer = ({ expiryDate, onExpire, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiryTime = new Date(expiryDate).getTime()
      const now = new Date().getTime()
      const difference = expiryTime - now

      if (difference <= 0) {
        if (onExpire) onExpire()
        return { expired: true }
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds, expired: false }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryDate, onExpire])

  if (!timeLeft) return null

  if (timeLeft.expired) {
    return (
      <div className="text-red-600 font-medium flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>Expired</span>
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-yellow-600" />
        <span className="font-medium text-gray-900">
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {timeLeft.days > 0 && (
        <>
          <div className="bg-white rounded-lg px-3 py-2 text-center shadow-sm">
            <div className="text-2xl font-bold text-yellow-700">{timeLeft.days}</div>
            <div className="text-xs text-gray-600">Days</div>
          </div>
          <span className="text-2xl font-bold text-yellow-700">:</span>
        </>
      )}
      <div className="bg-white rounded-lg px-3 py-2 text-center shadow-sm">
        <div className="text-2xl font-bold text-yellow-700">{timeLeft.hours}</div>
        <div className="text-xs text-gray-600">Hours</div>
      </div>
      <span className="text-2xl font-bold text-yellow-700">:</span>
      <div className="bg-white rounded-lg px-3 py-2 text-center shadow-sm">
        <div className="text-2xl font-bold text-yellow-700">{timeLeft.minutes}</div>
        <div className="text-xs text-gray-600">Minutes</div>
      </div>
      <span className="text-2xl font-bold text-yellow-700">:</span>
      <div className="bg-white rounded-lg px-3 py-2 text-center shadow-sm">
        <div className="text-2xl font-bold text-yellow-700">{timeLeft.seconds}</div>
        <div className="text-xs text-gray-600">Seconds</div>
      </div>
    </div>
  )
}

export default CountdownTimer
