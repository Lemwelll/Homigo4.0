import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useAccountTier } from '../context/AccountTierContext'
import { MapPin, Droplet, Printer, Store, Crown, Lock } from 'lucide-react'
import API_URL from '../config/api'


const LandmarksMap = () => {
  const navigate = useNavigate()
  const { accountState } = useAccountTier()
  const [activeFilter, setActiveFilter] = useState('all')
  const [landmarks, setLandmarks] = useState([])
  const [filteredLandmarks, setFilteredLandmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [mapCenter, setMapCenter] = useState({ lat: 7.8647, lng: 125.0508 }) // Default: CMU Musuan, Bukidnon

  // Fetch landmarks from API
  useEffect(() => {
    if (accountState.tier === 'premium') {
      fetchLandmarks()
    }
  }, [accountState.tier])

  // Filter landmarks when filter or search changes
  useEffect(() => {
    filterLandmarks()
  }, [activeFilter, landmarks, searchQuery])

  const fetchLandmarks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/landmarks`)
      const data = await response.json()

      if (data.success) {
        setLandmarks(data.data)
        setFilteredLandmarks(data.data)
      }
    } catch (error) {
      console.error('Error fetching landmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterLandmarks = () => {
    let filtered = landmarks

    // Filter by type
    if (activeFilter !== 'all') {
      filtered = filtered.filter(l => l.type === activeFilter)
    }

    // Filter by search query (city or address)
    if (searchQuery) {
      filtered = filtered.filter(l => 
        l.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredLandmarks(filtered)
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredLandmarks(landmarks)
      setMapCenter({ lat: 7.8647, lng: 125.0508 })
      return
    }

    // Filter landmarks manually for immediate use
    let filtered = landmarks

    // Filter by type
    if (activeFilter !== 'all') {
      filtered = filtered.filter(l => l.type === activeFilter)
    }

    // Filter by search query
    filtered = filtered.filter(l => 
      l.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    setFilteredLandmarks(filtered)

    // Update map center based on first result
    if (filtered.length > 0) {
      const firstLandmark = filtered[0]
      setMapCenter({
        lat: parseFloat(firstLandmark.latitude),
        lng: parseFloat(firstLandmark.longitude)
      })
    }
  }

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getIcon = (type) => {
    switch(type) {
      case 'laundry': return <Droplet className="w-5 h-5" />
      case 'printing': return <Printer className="w-5 h-5" />
      default: return <Store className="w-5 h-5" />
    }
  }

  const getColor = (type) => {
    switch(type) {
      case 'laundry': return 'bg-blue-500'
      case 'printing': return 'bg-purple-500'
      default: return 'bg-green-500'
    }
  }

  // Check if user has premium access
  if (accountState.tier !== 'premium') {
    return (
      <DashboardLayout userType="student">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Premium Feature</h1>
            <p className="text-gray-600 mb-6">
              The Landmarks Map is only available for Premium members
            </p>
            <div className="bg-primary-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-bold text-primary-900 mb-3">With Premium, you get:</h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Interactive map with nearby services</span>
                </li>
                <li className="flex items-center gap-2">
                  <Droplet className="w-4 h-4" />
                  <span>Find laundry shops near your property</span>
                </li>
                <li className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  <span>Locate printing stations for school needs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  <span>Discover convenience stores and more</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/upgrade')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade to Premium</span>
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Landmarks Map</h1>
            <p className="text-gray-600">Find nearby services and amenities</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg">
            <Crown className="w-5 h-5" />
            <span className="font-semibold">Premium</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="card">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeFilter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({landmarks.length})
            </button>
            <button
              onClick={() => setActiveFilter('laundry')}
              className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                activeFilter === 'laundry'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Droplet className="w-4 h-4" />
              Laundry ({landmarks.filter(l => l.type === 'laundry').length})
            </button>
            <button
              onClick={() => setActiveFilter('printing')}
              className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                activeFilter === 'printing'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Printer className="w-4 h-4" />
              Printing ({landmarks.filter(l => l.type === 'printing').length})
            </button>
            <button
              onClick={() => setActiveFilter('other')}
              className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                activeFilter === 'other'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Store className="w-4 h-4" />
              Other ({landmarks.filter(l => l.type === 'other').length})
            </button>
          </div>
        </div>

        {/* Search Box */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Search Location</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search for a place (e.g., CMU, Maramag, Bukidnon)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-semibold"
            >
              Search
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Search to filter landmarks by location and update the map
          </p>
        </div>

        {/* Google Maps Embed */}
        <div className="card p-0 overflow-hidden">
          <iframe
            key={`map-${mapCenter.lat}-${mapCenter.lng}-${Date.now()}`}
            src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&hl=en&z=15&output=embed`}
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Landmarks Map"
            className="w-full"
          ></iframe>
        </div>

        {/* Landmarks List */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {searchQuery ? 'Search Results' : 'Nearby Landmarks'} ({filteredLandmarks.length})
            </h2>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setMapCenter({ lat: 7.8647, lng: 125.0508 })
                }}
                className="text-sm text-primary-500 hover:text-primary-600 font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading landmarks...</p>
            </div>
          ) : filteredLandmarks.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchQuery 
                  ? `No landmarks found for "${searchQuery}"`
                  : 'No landmarks available'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-primary-500 hover:text-primary-600 font-semibold"
                >
                  Show all landmarks
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLandmarks.map((landmark) => (
                <div
                  key={landmark.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => {
                    setMapCenter({
                      lat: parseFloat(landmark.latitude),
                      lng: parseFloat(landmark.longitude)
                    })
                  }}
                >
                  <div className={`${getColor(landmark.type)} text-white p-3 rounded-lg`}>
                    {getIcon(landmark.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{landmark.name}</h3>
                    <p className="text-sm text-gray-600">{landmark.address}</p>
                    {landmark.city && (
                      <p className="text-xs text-gray-500 mt-1">{landmark.city}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                      {landmark.type}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(`https://www.google.com/maps/search/?api=1&query=${landmark.latitude},${landmark.longitude}`, '_blank')
                      }}
                      className="text-xs text-primary-500 hover:text-primary-600"
                    >
                      Open in Maps
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="card bg-gray-50">
          <h3 className="font-bold text-gray-900 mb-3">Map Legend</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white p-2 rounded">
                <Droplet className="w-4 h-4" />
              </div>
              <span className="text-sm text-gray-700">Laundry</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-purple-500 text-white p-2 rounded">
                <Printer className="w-4 h-4" />
              </div>
              <span className="text-sm text-gray-700">Printing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-500 text-white p-2 rounded">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-sm text-gray-700">Other</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LandmarksMap
