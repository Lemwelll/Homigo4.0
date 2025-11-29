import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PropertyImageGallery from '../components/PropertyImageGallery'
import PropertyReviews from '../components/PropertyReviews'
import { useStudent } from '../context/StudentContext'
import { useReservation } from '../context/ReservationContext'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import { useProperties } from '../context/PropertyContext'
import { useMessages } from '../context/MessageContext'
import { useAccountTier } from '../context/AccountTierContext'
import Toast from '../components/Toast'
import { MapPin, Bed, Bath, CheckCircle, MessageSquare, Heart, ArrowLeft, Clock, Crown, Map, Lock } from 'lucide-react'
import API_URL from '../config/api'

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { properties, toggleFavorite, isFavorite } = useStudent()
  const { fetchPropertyById } = useProperties()
  const { createReservation, isPropertyReserved, reservations } = useReservation()
  const { isPropertyBooked } = useBooking()
  const { startConversation } = useMessages()
  const { accountState, incrementStudentReservations } = useAccountTier()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [showReserveModal, setShowReserveModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [reservationMessage, setReservationMessage] = useState('')
  const viewTracked = useRef(false)
  const [nearbyLandmarks, setNearbyLandmarks] = useState([])
  const [loadingLandmarks, setLoadingLandmarks] = useState(false)

  // Free tier limits
  const FREE_RESERVATION_LIMIT = 2

  // Fetch property from backend and track view
  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true)
      const fetchedProperty = await fetchPropertyById(id)
      setProperty(fetchedProperty)
      setLoading(false)

      // Track property view only once
      if (!viewTracked.current) {
        viewTracked.current = true
        try {
          await fetch(`http://localhost:5000/activities/track-view/${id}`, {
            method: 'POST'
          })
          console.log('✅ Property view tracked')
        } catch (error) {
          console.error('Failed to track view:', error)
        }
      }
    }
    loadProperty()
  }, [id])

  // Fetch nearby landmarks
  useEffect(() => {
    const loadNearbyLandmarks = async () => {
      if (!property) return
      
      setLoadingLandmarks(true)
      try {
        // Fetch landmarks filtered by city (Musuan, Bukidnon)
        const response = await fetch('http://localhost:5000/landmarks?city=Musuan', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          const landmarks = result.data || result
          
          // Map type to category and get top 5 landmarks
          const mappedLandmarks = landmarks.map(landmark => ({
            ...landmark,
            category: landmark.type ? landmark.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Other'
          })).slice(0, 5)
          
          setNearbyLandmarks(mappedLandmarks)
        }
      } catch (error) {
        console.error('Failed to load landmarks:', error)
      } finally {
        setLoadingLandmarks(false)
      }
    }
    
    loadNearbyLandmarks()
  }, [property])

  // Check if user is logged in, if not redirect to login
  useEffect(() => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', `/property/${id}`);
      navigate('/login');
    }
  }, [user, navigate, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <button onClick={() => navigate('/student/browse')} className="btn-primary">
            Browse Properties
          </button>
        </div>
      </div>
    )
  }

  const similarProperties = properties
    .filter(p => p.id !== property.id && p.city === property.city)
    .slice(0, 3)

  const alreadyReserved = isPropertyReserved(property.id)
  const alreadyBooked = isPropertyBooked(property.id)

  const handleReserveProperty = () => {
    if (alreadyReserved) {
      setToast({ message: 'You already have a reservation for this property!', type: 'info' })
      return
    }

    // Check tier limits - filter to only current user's active reservations (reserved or approved)
    const myActiveReservations = reservations.filter(r => 
      r.student_id === user?.id && (r.status === 'reserved' || r.status === 'approved' || r.status === 'pending')
    ).length
    
    console.log('🔍 Reservation Check:', {
      tier: accountState.tier,
      userId: user?.id,
      totalReservations: reservations.length,
      myActiveReservations,
      limit: FREE_RESERVATION_LIMIT,
      willBlock: accountState.tier === 'free' && myActiveReservations >= FREE_RESERVATION_LIMIT
    })
    
    if (accountState.tier === 'free' && myActiveReservations >= FREE_RESERVATION_LIMIT) {
      console.log('❌ BLOCKED: Showing upgrade modal')
      setShowUpgradeModal(true)
      return
    }

    console.log('✅ ALLOWED: Showing reservation modal')
    setShowReserveModal(true)
  }

  const handleConfirmReservation = async () => {
    // Double-check limit before creating reservation
    const myActiveReservations = reservations.filter(r => 
      r.student_id === user?.id && (r.status === 'reserved' || r.status === 'approved' || r.status === 'pending')
    ).length
    
    if (accountState.tier === 'free' && myActiveReservations >= FREE_RESERVATION_LIMIT) {
      setShowReserveModal(false)
      setShowUpgradeModal(true)
      return
    }
    
    const result = await createReservation(property, reservationMessage)
    setShowReserveModal(false)
    setReservationMessage('')
    
    if (result.success) {
      // Increment reservation count
      incrementStudentReservations()
      
      setToast({
        message: 'Property reserved! You have 48 hours to complete payment.',
        type: 'success'
      })
    } else {
      setToast({
        message: result.error || 'Failed to create reservation',
        type: 'error'
      })
    }

    setTimeout(() => {
      navigate('/student/reservations')
    }, 2000)
  }

  const handleBookNow = () => {
    if (alreadyBooked) {
      setToast({ message: 'You already have a booking for this property!', type: 'info' })
      return
    }
    // Navigate to secure payment page
    navigate('/student/secure-payment', { state: { property } })
  }

  const handleMessageLandlord = async () => {
    if (!property.landlord) {
      setToast({ message: 'Landlord information not available', type: 'error' })
      return
    }

    // Start conversation with landlord
    await startConversation({
      id: property.landlord_id,
      name: property.landlord.name || property.landlordName,
      email: property.landlord.email || property.landlordEmail,
      role: 'landlord'
    }, property.id)

    // Navigate to messages page
    navigate('/student/messages')
  }

  const handleMapViewClick = () => {
    if (accountState.tier === 'free') {
      setShowUpgradeModal(true)
    } else {
      navigate('/student/landmarks')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} userType="student" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to listings</span>
        </button>

        {/* Image Gallery */}
        <PropertyImageGallery 
          property={property}
          isFavorite={isFavorite(property.id)}
          onToggleFavorite={async () => {
            const result = await toggleFavorite(property.id, accountState)
            if (result && !result.success && result.error === 'limit_reached') {
              setShowUpgradeModal(true)
            }
          }}
        />

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>

              <div className="flex items-center space-x-6 mb-6 pb-6 border-b">
                <div className="flex items-center space-x-2">
                  <Bed className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bath className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{property.bathrooms} Bathroom{property.bathrooms > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Location</h2>
              <p className="text-gray-600 mb-4">{property.address}</p>
              <div className="rounded-lg overflow-hidden h-64">
                <iframe
                  src={`https://www.google.com/maps?q=${property.city || 'Musuan, Bukidnon'}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location Map"
                ></iframe>
              </div>
            </div>

            {/* Nearby Landmarks Section */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Nearby Landmarks</h2>
                <button
                  onClick={handleMapViewClick}
                  disabled={accountState.tier === 'free'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    accountState.tier === 'free'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                  }`}
                >
                  {accountState.tier === 'free' ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Map View</span>
                    </>
                  ) : (
                    <>
                      <Map className="w-4 h-4" />
                      <span>Map View</span>
                    </>
                  )}
                </button>
              </div>

              {loadingLandmarks ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading landmarks...</p>
                </div>
              ) : nearbyLandmarks.length > 0 ? (
                <div className="space-y-3">
                  {nearbyLandmarks.map((landmark) => (
                    <div
                      key={landmark.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{landmark.name}</h3>
                        <p className="text-sm text-gray-600">{landmark.category}</p>
                        {landmark.description && (
                          <p className="text-xs text-gray-500 mt-1">{landmark.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No landmarks available</p>
                </div>
              )}

              {accountState.tier === 'free' && nearbyLandmarks.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-900 mb-1">
                        Upgrade to Premium for Map View
                      </p>
                      <p className="text-xs text-yellow-700">
                        View all landmarks on an interactive map and get directions to nearby places.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card sticky top-24">
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-primary-600 mb-2">
                  ₱{property.price.toLocaleString()}
                </p>
                <p className="text-gray-600">per month</p>
              </div>

              <button
                onClick={handleReserveProperty}
                disabled={alreadyReserved || property.isRented}
                className={`w-full mb-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${(alreadyReserved || property.isRented)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
              >
                <Clock className="w-5 h-5" />
                {property.isRented ? 'Property Not Available' : alreadyReserved ? 'Already Reserved' : 'Reserve Property (48h Hold)'}
              </button>
              <button
                onClick={handleBookNow}
                disabled={alreadyBooked || property.isRented}
                className={`w-full mb-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${(alreadyBooked || property.isRented)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
                  }`}
              >
                {property.isRented ? 'Property Not Available' : alreadyBooked ? 'Already Booked' : 'Book Now (Instant)'}
              </button>
              <button
                onClick={handleMessageLandlord}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Message Landlord</span>
              </button>
            </div>

            {property.landlord && (
              <div className="card">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Landlord Information</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {property.landlord.name?.charAt(0) || 'L'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-gray-800">{property.landlord.name || 'Landlord'}</h4>
                      {property.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Verified Landlord</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {property.landlord.phone && <p>📞 {property.landlord.phone}</p>}
                  {property.landlord.email && <p>📧 {property.landlord.email}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Property Reviews Section */}
        <div className="mt-12">
          <PropertyReviews 
            propertyId={property.id}
            userRole={user?.role}
            canReview={user?.role === 'student'}
          />
        </div>

        {/* You Might Also Like */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {similarProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => navigate(`/property/${prop.id}`)}
                  className="card p-0 overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-48 object-cover"
                    />
                    {prop.verified && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ✓ Verified
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-primary-500 text-white px-4 py-2 rounded-lg font-bold">
                      ₱{prop.price.toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1">{prop.title}</h3>
                    <p className="text-sm text-gray-600">{prop.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reserve Property Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reserve Property</h2>
            <div className="mb-4">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="font-bold text-gray-900">{property.title}</h3>
              <p className="text-2xl font-bold text-primary-600">₱{property.price.toLocaleString()}/month</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">48-Hour Reservation</span>
              </div>
              <p className="text-sm text-yellow-700">
                This property will be held for you for 48 hours. Complete payment within this time to secure your booking.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Landlord (Optional)
              </label>
              <textarea
                value={reservationMessage}
                onChange={(e) => setReservationMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                rows="3"
                placeholder="Introduce yourself and share why you're interested in this property..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReserveModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReservation}
                className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
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
                You've reached the free tier limit of {FREE_RESERVATION_LIMIT} active reservations
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-primary-900 mb-2">Premium Benefits:</h3>
              <ul className="space-y-2 text-sm text-primary-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Unlimited reservations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Unlimited favorites</span>
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

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default PropertyDetails
