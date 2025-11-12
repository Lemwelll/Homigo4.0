import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import { useProperties } from '../context/PropertyContext'
import { Upload, CheckCircle, Home } from 'lucide-react'

const AddProperty = () => {
  const navigate = useNavigate()
  const { addProperty } = useProperties()
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    description: '',
    address: '',
    amenities: [],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'
  })

  const amenitiesList = ['WiFi', 'Air Conditioning', 'Parking', 'Security', 'Water', 'Electricity', 'Furnished', 'Kitchen']

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newProperty = addProperty(formData)
    setShowSuccess(true)
    
    setTimeout(() => {
      navigate('/landlord/properties')
    }, 2000)
  }

  return (
    <DashboardLayout userType="landlord">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Property</h1>
          <p className="text-gray-600">Fill in the details to list your property</p>
        </div>

        {showSuccess && (
          <div className="card mb-6 bg-green-50 border-2 border-green-500">
            <div className="flex items-center space-x-3 text-green-700">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-bold">Property Added Successfully!</p>
                <p className="text-sm">Redirecting to your properties...</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Modern Studio near UP Diliman"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Quezon City"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Rent (₱) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="8500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="123 University Avenue, Quezon City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Property Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bedrooms <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-field"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                  required
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bathrooms <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-field"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                  required
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input-field"
                rows="5"
                placeholder="Describe your property, nearby amenities, and what makes it special..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Amenities</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.amenities.includes(amenity)
                      ? 'border-secondary-500 bg-secondary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-5 h-5 text-secondary-500 rounded"
                  />
                  <span className="font-medium text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Property Images</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-secondary-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-1 font-semibold">Upload Property Photos</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB (Multiple files allowed)</p>
              <input type="file" className="hidden" accept="image/*" multiple />
              <button
                type="button"
                className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Choose Files
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/landlord/properties')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-secondary flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Add Property</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default AddProperty
