import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStudent } from '../context/StudentContext'
import { useReservation } from '../context/ReservationContext'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import { MapPin, Bed, Bath, CheckCircle, MessageSquare, Heart, ArrowLeft, Clock } from 'lucide-react'
import { dummyProperties } from '../data/dummyProperties'

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { properties, toggleFavorite, isFavorite } = useStudent()
  const { createReservation, isPropertyReserved } = useReservation()
  const { isPropertyBooked } = useBooking()
  const [toast, setToast] = useState(null)
  const [showReserveModal, setShowReserveModal] = useState(false)
  const [reservationMessage, setReservationMessage] = useState('')

  // Check if user is logged in, if not redirect to login
  useEffect(() => {
    if (!user) {
      localStorage.setItem('redirectAfterLogin', `/property/${id}`);
      navigate('/login');
    }
  }, [user, navigate, id]);

  // Try to find property in dummy data first, then in context
  const property = dummyProperties.find(p => p.id === parseInt(id)) || 
                   properties.find(p => p.id === parseInt(id))

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
    setShowReserveModal(true)
  }

  const handleConfirmReservation = () => {
    createReservation(property, reservationMessage)
    setShowReserveModal(false)
    setReservationMessage('')
    setToast({
      message: 'Property reserved! You have 48 hours to complete payment.',
      type: 'success'
    })

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
        <div className="relative mb-8">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-96 object-cover rounded-xl"
          />
          {property.verified && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Verified</span>
            </div>
          )}
          <button
            onClick={() => toggleFavorite(property.id)}
            className={`absolute top-4 left-4 p-3 rounded-full transition-all duration-300 shadow-lg ${isFavorite(property.id)
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite(property.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

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
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">📍 Map View</p>
              </div>
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
                disabled={alreadyReserved}
                className={`w-full mb-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${alreadyReserved
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  }`}
              >
                <Clock className="w-5 h-5" />
                {alreadyReserved ? 'Already Reserved' : 'Reserve Property (48h Hold)'}
              </button>
              <button
                onClick={handleBookNow}
                disabled={alreadyBooked}
                className={`w-full mb-3 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${alreadyBooked
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
                  }`}
              >
                {alreadyBooked ? 'Already Booked' : 'Book Now (Instant)'}
              </button>
              <button
                onClick={() => navigate('/student/messages')}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Message Landlord</span>
              </button>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Landlord Information</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {property.landlordName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-gray-800">{property.landlordName}</h4>
                    {property.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Verified Landlord</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📞 {property.landlordPhone}</p>
                <p>📧 {property.landlordEmail}</p>
              </div>
            </div>
          </div>
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
