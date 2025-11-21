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
      className="card cursor-pointer transform hover:scale-105 transition-all duration-300 p-0 overflow-hidden"
    >
      <div className="relative">
        <ImageCarousel 
          images={images}
          alt={property.title}
          height="h-48"
        />
        {property.verified && (
          <div className="absolute top-3 right-3 bg-secondary-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-sm font-semibold z-20">
            <CheckCircle className="w-4 h-4" />
            <span>Verified</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-primary-500 text-white px-4 py-2 rounded-lg font-bold text-lg z-20">
          ₱{property.price.toLocaleString()}/mo
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-gray-600 mb-4">
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
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700 font-medium">{property.landlordName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
