import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import { useProperties } from '../context/PropertyContext'

const EditPropertyModal = ({ property, onClose }) => {
  const { updateProperty } = useProperties()
  const [formData, setFormData] = useState({
    title: property.title,
    location: property.location,
    price: property.price,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    description: property.description,
    address: property.address
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProperty(property.id, formData)
    setShowSuccess(true)
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Edit Property</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span className="font-semibold">Property updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title</label>
            <input
              type="text"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                className="input-field"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₱/month)</label>
              <input
                type="number"
                className="input-field"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                className="input-field"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                className="input-field"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <input
              type="text"
              className="input-field"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              className="input-field"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPropertyModal
