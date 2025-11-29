import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useStudent } from '../context/StudentContext'
import { useAccountTier } from '../context/AccountTierContext'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, MapPin, DollarSign, Heart, CheckCircle, Crown } from 'lucide-react'

const StudentBrowse = () => {
  const navigate = useNavigate()
  const { properties, toggleFavorite, isFavorite } = useStudent()
  const { accountState } = useAccountTier()
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const [city, setCity] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = priceRange === 'all' || property.priceRange === priceRange
    const matchesCity = city === 'all' || property.city === city
    const matchesVerified = !verifiedOnly || property.verified

    return matchesSearch && matchesPrice && matchesCity && matchesVerified
  })

  const handleFavoriteClick = async (e, propertyId) => {
    e.stopPropagation()
    const result = await toggleFavorite(propertyId, accountState)

    if (result && !result.success && result.error === 'limit_reached') {
      setShowUpgradeModal(true)
    }
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Properties</h1>
          <p className="text-gray-600">Find your perfect home from {properties.length} available listings</p>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by property name or location..."
                  className="input-field pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="input-field pl-10 appearance-none"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="0-1000">₱0 - ₱1,000</option>
                  <option value="1000-1500">₱1,000 - ₱1,500</option>
                  <option value="1500-2500">₱1,5000 - ₱2,500</option>
                  <option value="2500+">₱2,500+</option>
                </select>
              </div>
            </div>

            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="input-field pl-10 appearance-none"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="all">All Cities</option>
                  <option value="Quezon City">Valencia City</option>
                  <option value="Manila">Malaybalay City</option>
                  <option value="Makati">Musuan</option>
                  <option value="Pasig">Maramag</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-500 rounded"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Show verified properties only</span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-bold text-gray-800">{filteredProperties.length}</span> properties found
          </p>
          {(searchQuery || priceRange !== 'all' || city !== 'all' || verifiedOnly) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setPriceRange('all')
                setCity('all')
                setVerifiedOnly(false)
              }}
              className="text-primary-500 hover:text-primary-600 font-semibold text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
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
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg animate-pulse z-20">
                      <CheckCircle className="w-3 h-3 fill-current" />
                      <span>VERIFIED</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => handleFavoriteClick(e, property.id)}
                    className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-300 ${isFavorite(property.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(property.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-primary-500 text-white px-4 py-2 rounded-lg font-bold">
                    ₱{property.price.toLocaleString()}/mo
                  </div>
                </div>
                <div className="p-5" onClick={() => navigate(`/property/${property.id}`)}>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{property.location}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{property.bedrooms} Bed • {property.bathrooms} Bath</span>
                  </div>
                  <button className="mt-4 w-full btn-primary text-sm py-2">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setPriceRange('all')
                setCity('all')
                setVerifiedOnly(false)
              }}
              className="btn-primary inline-block"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
                <p className="text-gray-600">
                  You've reached the free tier limit of 3 favorites
                </p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-primary-900 mb-2">Premium Benefits:</h3>
                <ul className="space-y-2 text-sm text-primary-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Unlimited favorites</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Unlimited reservations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Early access to new features</span>
                  </li>
                </ul>
                <p className="text-2xl font-bold text-primary-900 mt-4">₱199/month</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false)
                    navigate('/upgrade')
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-colors font-semibold"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentBrowse
