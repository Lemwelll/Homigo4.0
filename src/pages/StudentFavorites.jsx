import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useStudent } from '../context/StudentContext'
import { useAccountTier } from '../context/AccountTierContext'
import { useNavigate } from 'react-router-dom'
import { Heart, Search, CheckCircle } from 'lucide-react'

const StudentFavorites = () => {
  const navigate = useNavigate()
  const { getFavoriteProperties, toggleFavorite, isFavorite } = useStudent()
  const { accountState } = useAccountTier()
  const favoriteProperties = getFavoriteProperties()

  const handleFavoriteClick = async (e, propertyId) => {
    e.stopPropagation()
    // When removing from favorites, no need to check limits
    await toggleFavorite(propertyId, accountState)
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Listings</h1>
          <p className="text-gray-600">
            Your favorite properties ({favoriteProperties.length}
            {accountState.tier === 'free' && (
              <span>/3 - <button onClick={() => navigate('/student/settings')} className="text-primary-600 hover:underline">Upgrade for unlimited</button></span>
            )})
          </p>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <div
                key={property.id}
                className="card p-0 overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 relative group"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                    onClick={() => navigate(`/property/${property.id}`)}
                  />
                  {property.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => handleFavoriteClick(e, property.id)}
                    className="absolute top-3 left-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-300 animate-pulse"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-primary-500 text-white px-4 py-2 rounded-lg font-bold">
                    ₱{property.price.toLocaleString()}/mo
                  </div>
                </div>
                <div className="p-5" onClick={() => navigate(`/property/${property.id}`)}>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{property.location}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{property.bedrooms} Bed • {property.bathrooms} Bath</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 btn-primary text-sm py-2">
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/student/messages')
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Saved Listings Yet</h3>
            <p className="text-gray-600 mb-6">
              Start browsing properties and save your favorites by clicking the heart icon
            </p>
            <button
              onClick={() => navigate('/student/browse')}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Browse Properties</span>
            </button>
          </div>
        )}

        {favoriteProperties.length > 0 && (
          <div className="card bg-gradient-to-br from-blue-50 to-primary-50">
            <h3 className="text-lg font-bold text-gray-800 mb-2">💡 Tip</h3>
            <p className="text-gray-700">
              Compare your saved properties side by side to make the best decision. You can also message landlords directly to schedule viewings!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentFavorites
