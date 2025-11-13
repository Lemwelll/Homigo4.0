import { useState, useRef, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import { useProperties } from '../context/PropertyContext'
import { Upload, CheckCircle, Home, X } from 'lucide-react'

const AddProperty = () => {
  const navigate = useNavigate()
  const { addProperty } = useProperties()
  const fileInputRef = useRef(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [imageError, setImageError] = useState('')
  const [base64Images, setBase64Images] = useState([])
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

  // Load saved draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('homigo_property_draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        setFormData(draft.formData)
        if (draft.images && draft.images.length > 0) {
          setBase64Images(draft.images)
          setPreviewUrls(draft.images)
        }
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [])

  // Auto-save draft to localStorage whenever form data or images change
  useEffect(() => {
    const draft = {
      formData,
      images: base64Images,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem('homigo_property_draft', JSON.stringify(draft))
  }, [formData, base64Images])

  const amenitiesList = ['WiFi', 'Air Conditioning', 'Parking', 'Security', 'Water', 'Electricity', 'Furnished', 'Kitchen']

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    setImageError('')

    // Validate files
    const validFiles = []
    const errors = []

    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image file`)
        return
      }

      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name} exceeds 10MB`)
        return
      }

      // Check file extension
      const validExtensions = ['png', 'jpg', 'jpeg']
      const extension = file.name.split('.').pop().toLowerCase()
      if (!validExtensions.includes(extension)) {
        errors.push(`${file.name} must be PNG, JPG, or JPEG`)
        return
      }

      validFiles.push(file)
    })

    if (errors.length > 0) {
      setImageError(errors.join('. '))
    }

    if (validFiles.length > 0) {
      // Add to existing files
      const newFiles = [...selectedFiles, ...validFiles]
      setSelectedFiles(newFiles)

      // Convert to base64 for localStorage
      const base64Promises = validFiles.map(file => fileToBase64(file))
      const newBase64Images = await Promise.all(base64Promises)
      const allBase64 = [...base64Images, ...newBase64Images]
      setBase64Images(allBase64)

      // Create preview URLs (use base64 for previews too)
      setPreviewUrls(allBase64)

      console.log('Selected images:', newFiles)
    }

    // Reset input
    e.target.value = ''
  }

  const handleRemoveImage = (index) => {
    // Remove from arrays
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
    setPreviewUrls(previewUrls.filter((_, i) => i !== index))
    setBase64Images(base64Images.filter((_, i) => i !== index))
  }

  const handleChooseFiles = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Save to localStorage with images
    const propertyData = {
      ...formData,
      images: base64Images,
      createdAt: new Date().toISOString(),
      id: Date.now()
    }

    // Get existing properties from localStorage
    const existingProperties = JSON.parse(localStorage.getItem('homigo_temp_properties') || '[]')
    existingProperties.push(propertyData)
    localStorage.setItem('homigo_temp_properties', JSON.stringify(existingProperties))

    // Also add to context (for immediate display)
    addProperty({
      ...formData,
      image: base64Images[0] || formData.image
    })

    // Clear the draft
    localStorage.removeItem('homigo_property_draft')

    console.log('Property saved with images:', propertyData)
    
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
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/png,image/jpg,image/jpeg" 
                multiple 
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={handleChooseFiles}
                className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Choose Files
              </button>
            </div>

            {/* Error Message */}
            {imageError && (
              <div className="mt-3 text-sm text-red-600">
                {imageError}
              </div>
            )}

            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Selected Images ({selectedFiles.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded truncate">
                        {selectedFiles[index]?.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
