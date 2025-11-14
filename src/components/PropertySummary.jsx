import { MapPin, User, Home } from 'lucide-react'

const PropertySummary = ({ property }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
      
      <div className="flex gap-4 mb-4">
        <img
          src={property.image}
          alt={property.title}
          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">{property.title}</h4>
          <p className="text-2xl font-bold text-primary-600 mb-2">
            ₱{property.price.toLocaleString()}/month
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span>{property.landlordName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Home className="w-4 h-4" />
          <span>{property.bedrooms} Bedroom • {property.bathrooms} Bathroom</span>
        </div>
      </div>

      {property.amenities && property.amenities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {property.amenities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertySummary
