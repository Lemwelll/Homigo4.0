import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import { useProperties } from '../context/PropertyContext'
import { Eye, Edit, Trash2, PlusCircle, Search } from 'lucide-react'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import EditPropertyModal from '../components/EditPropertyModal'

const LandlordProperties = () => {
  const navigate = useNavigate()
  const { properties, deleteProperty } = useProperties()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (property) => {
    setSelectedProperty(property)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedProperty) {
      deleteProperty(selectedProperty.id)
      setDeleteModalOpen(false)
      setSelectedProperty(null)
    }
  }

  const handleEdit = (property) => {
    setSelectedProperty(property)
    setEditModalOpen(true)
  }

  return (
    <DashboardLayout userType="landlord">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Properties</h1>
            <p className="text-gray-600">Manage all your rental listings</p>
          </div>
          <button
            onClick={() => navigate('/landlord/add-property')}
            className="btn-secondary flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Property</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search properties by title or location..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Properties List */}
        {filteredProperties.length > 0 ? (
          <div className="space-y-4">
            {filteredProperties.map((property) => (
              <div key={property.id} className="card hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{property.title}</h3>
                        <p className="text-gray-600">{property.location}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        property.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Price</p>
                        <p className="text-lg font-bold text-secondary-600">₱{property.price.toLocaleString()}/mo</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Views</p>
                        <p className="text-lg font-bold text-gray-800">{property.views}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Inquiries</p>
                        <p className="text-lg font-bold text-gray-800">{property.inquiries}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="flex items-center space-x-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => handleEdit(property)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(property)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Found</h3>
            <p className="text-gray-600">Try adjusting your search or add a new property</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteConfirmModal
          property={selectedProperty}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
        />
      )}

      {/* Edit Property Modal */}
      {editModalOpen && (
        <EditPropertyModal
          property={selectedProperty}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </DashboardLayout>
  )
}

export default LandlordProperties
