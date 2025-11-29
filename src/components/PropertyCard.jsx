import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Bed, Bath, CheckCircle } from 'lucide-react'
import ImageCarousel from './ImageCarousel'

const PropertyCard = ({ property }) => {
  const navigate = useNavigate()

  // Get all images or fallback to single image
  const images = property.images && property.images.length > 0 
    ? property.images 
    : property.image 
    ? [property.image] 
    : []

  return (
    <div
      onClick={() => navigate(`/property/${property.id}`)}
      className={`card cursor-pointer transform hover:scale-105 transition-all duration-300 p-0 overflow-hidden ${property.isRented ? 'opacity-75' : ''}`}
    >
      <div className="relative">
        <div className={property.isRented ? 'grayscale' : ''}>
          <ImageCarousel 
            images={images}
            alt={property.title}
            height="h-48"
          />
        </div>
        
        {/* Darken overlay if property is rented */}
        {property.isRented && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 z-20"></div>
        )}
        
        {/* NOT AVAILABLE badge for rented properties */}
        {property.isRented && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-2xl border-2 border-white">
              NOT AVAILABLE
            </div>
          </div>
        )}
        
        {property.verified && !property.isRented && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full flex items-center space-x-1 text-sm font-bold shadow-lg z-20 animate-pulse">
            <CheckCircle className="w-4 h-4 fill-current" />
            <span>VERIFIED</span>
          </div>
        )}
        
        <div className={`absolute bottom-3 left-3 px-4 py-2 rounded-lg font-bold text-lg z-20 ${property.isRented ? 'bg-gray-500' : 'bg-primary-500'} text-white`}>
          ₱{property.price.toLocaleString()}/mo
        </div>
      </div>
      
      <div className={`p-5 ${property.isRented ? 'bg-gray-100' : ''}`}>
        <h3 className={`text-xl font-bold mb-2 ${property.isRented ? 'text-gray-500' : 'text-gray-800'}`}>{property.title}</h3>
        <div className={`flex items-center mb-3 ${property.isRented ? 'text-gray-400' : 'text-gray-600'}`}>
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className={`flex items-center space-x-4 mb-4 ${property.isRented ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.bathrooms} Baths</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center">
            <img
              src={property.landlordAvatar}
              alt={property.landlordName}
              className={`w-8 h-8 rounded-full mr-2 ${property.isRented ? 'grayscale' : ''}`}
            />
            <span className={`text-sm font-medium ${property.isRented ? 'text-gray-500' : 'text-gray-700'}`}>{property.landlordName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
