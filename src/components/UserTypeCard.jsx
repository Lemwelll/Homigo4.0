import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserTypeCard = ({ icon: Icon, title, description, link, gradient }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(link)}
      className={`card cursor-pointer transform hover:scale-105 transition-all duration-300 ${gradient} text-white overflow-hidden relative group`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-white bg-opacity-20 p-6 rounded-full">
            <Icon className="w-16 h-16" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-center mb-4">{title}</h3>
        <p className="text-center text-blue-100 mb-6">{description}</p>
        <div className="flex justify-center">
          <button className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserTypeCard
