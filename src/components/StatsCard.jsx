import React from 'react'

const StatsCard = ({ icon: Icon, label, value, color, trend }) => {
  return (
    <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value} {trend.label}
            </p>
          )}
        </div>
        <div className={`${color} p-4 rounded-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
