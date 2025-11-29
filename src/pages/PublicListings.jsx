import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000'

const PublicListings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch properties from backend
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/properties/verified`);
      const data = await response.json();

      if (data.success) {
        const transformedProperties = data.data.map(prop => ({
          id: prop.id,
          name: prop.title,
          city: prop.location.split(',')[0].trim(),
          location: prop.location,
          address: prop.address,
          price: parseFloat(prop.rent_price),
          type: `${prop.bedrooms} Bedroom, ${prop.bathrooms} Bathroom`,
          photos: prop.property_images?.map(img => img.image_url) || ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'],
          amenities: prop.property_amenities?.map(a => a.amenity_name) || [],
          description: prop.description,
          isRented: prop.isRented || false // Include isRented from backend
        }));
        
        setAllProperties(transformedProperties);
        setFilteredProperties(transformedProperties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search properties
  const searchPropertiesLocal = (query) => {
    if (!query.trim()) {
      return allProperties;
    }

    const lowerQuery = query.toLowerCase();
    return allProperties.filter(property => 
      property.name.toLowerCase().includes(lowerQuery) ||
      property.city.toLowerCase().includes(lowerQuery) ||
      property.location.toLowerCase().includes(lowerQuery) ||
      property.address.toLowerCase().includes(lowerQuery)
    );
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
    const results = searchPropertiesLocal(query);
    setFilteredProperties(results);
  }, [searchParams, allProperties]);

  const handleSearch = (e) => {
    e.preventDefault();
    const results = searchPropertiesLocal(searchQuery);
    setFilteredProperties(results);
    navigate(`/listings?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleViewAll = () => {
    setSearchQuery('');
    setFilteredProperties(allProperties);
    navigate('/listings');
  };

  const handlePropertyClick = (propertyId) => {
    if (!user) {
      setSelectedPropertyId(propertyId);
      setShowLoginModal(true);
    } else {
      navigate(`/property/${propertyId}`);
    }
  };

  const handleLoginRedirect = () => {
    localStorage.setItem('redirectAfterLogin', `/property/${selectedPropertyId}`);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img 
                src="/assets/log.jpeg" 
                alt="Homigo Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Homigo</h1>
            </div>
            
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, location, university, or landmark..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Properties'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
                </p>
              </div>
              
              {searchQuery && (
                <button
                  onClick={handleViewAll}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View All Properties
                </button>
              )}
            </div>

            {/* Property Grid */}
            {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.photos[0]}
                    alt={property.name}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${property.isRented ? 'opacity-50' : ''}`}
                  />
                  {property.isRented && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        NOT AVAILABLE
                      </div>
                    </div>
                  )}
                  {!property.isRented && (
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                      ₱{property.price.toLocaleString()}/mo
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                    {property.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="line-clamp-1">{property.location}, {property.city}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <Home className="w-4 h-4 mr-1" />
                    <span>{property.type}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or browse all properties
            </p>
            <button
              onClick={handleViewAll}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Properties
            </button>
          </div>
        )}
          </>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Login Required</h3>
            <p className="text-gray-600 mb-6">
              Please login to view property details and make reservations.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginRedirect}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicListings;
