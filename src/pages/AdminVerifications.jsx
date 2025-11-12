import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import StatusBadge from '../components/StatusBadge'
import { useAdmin } from '../context/AdminContext'
import { CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react'

const AdminVerifications = () => {
  const { properties, approveProperty, rejectProperty } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showSuccess, setShowSuccess] = useState(null)

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.landlordName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || property.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleApprove = (propertyId, propertyTitle) => {
    approveProperty(propertyId)
    setShowSuccess({ type: 'approved', title: propertyTitle })
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleReject = (propertyId, propertyTitle) => {
    rejectProperty(propertyId)
    setShowSuccess({ type: 'rejected', title: propertyTitle })
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const pendingCount = properties.filter(p => p.status === 'Pending').length
  const verifiedCount = properties.filter(p => p.status === 'Verified').length
  const rejectedCount = properties.filter(p => p.status === 'Rejected').length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Property Verifications</h1>
          <p className="text-gray-600">Review and verify property listings</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className={`card ${
            showSuccess.type === 'approved' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
          }`}>
            <div className="flex items-center space-x-3">
              {showSuccess.type === 'approved' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className={`font-bold ${showSuccess.type === 'approved' ? 'text-green-700' : 'text-red-700'}`}>
                  Property {showSuccess.type === 'approved' ? 'Approved' : 'Rejected'}!
                </p>
                <p className={`text-sm ${showSuccess.type === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                  {showSuccess.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-yellow-50">
            <p className="text-sm text-yellow-700 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-800">{pendingCount}</p>
          </div>
          <div className="card bg-green-50">
            <p className="text-sm text-green-700 mb-1">Verified</p>
            <p className="text-3xl font-bold text-green-800">{verifiedCount}</p>
          </div>
          <div className="card bg-red-50">
            <p className="text-sm text-red-700 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-800">{rejectedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by property or landlord..."
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="input-field pl-10 appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Property</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Landlord</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Submitted</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{property.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{property.landlordName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{property.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">₱{property.price.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{property.submittedDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={property.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {property.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(property.id, property.title)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(property.id, property.title)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No properties found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminVerifications
