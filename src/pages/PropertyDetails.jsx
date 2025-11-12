import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useStudent } from '../context/StudentContext'
import { MapPin, Bed, Bath, CheckCircle, MessageSquare, Heart, ArrowLeft } from 'lucide-react'

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { properties, toggleFavorite, isFavorite } = useStudent()
  
  const property = properties.find(p => p.id === parseInt(id))
  
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
            className={`absolute top-4 left-4 p-3 rounded-full transition-all duration-300 shadow-lg ${
              isFavorite(property.id)
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

              <button className="btn-primary w-full mb-3">
                Book Now
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
    </div>
  )
}

export default PropertyDetails
