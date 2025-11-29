import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import StatusBadge from '../components/StatusBadge'
import { useAdmin } from '../context/AdminContext'
import { CheckCircle, Ban, Eye, Search, Mail, Phone, X, User, FileText, Download } from 'lucide-react'


const AdminLandlords = () => {
  const { landlords, verifyLandlord, suspendLandlord } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuccess, setShowSuccess] = useState(null)
  const [selectedLandlord, setSelectedLandlord] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)
  const [documents, setDocuments] = useState([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)

  const filteredLandlords = landlords.filter(landlord =>
    landlord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    landlord.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewDetails = (landlord) => {
    setSelectedLandlord(landlord)
    setShowModal(true)
  }

  const handleVerify = (landlordId, landlordName) => {
    verifyLandlord(landlordId)
    setShowSuccess({ type: 'verified', name: landlordName })
    setShowModal(false)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleSuspend = (landlordId, landlordName) => {
    suspendLandlord(landlordId)
    setShowSuccess({ type: 'suspended', name: landlordName })
    setShowModal(false)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleViewDocuments = async (landlordId) => {
    setLoadingDocuments(true)
    setShowDocumentsModal(true)
    
    try {
      const token = localStorage.getItem('homigo_token')
      const response = await fetch(`${API_URL}/admin/landlords/${landlordId}/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setDocuments(data.data || [])
      } else {
        setDocuments([])
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
      setDocuments([])
    } finally {
      setLoadingDocuments(false)
    }
  }

  const verifiedCount = landlords.filter(l => l.status === 'Verified').length
  const pendingCount = landlords.filter(l => l.status === 'Pending').length
  const suspendedCount = landlords.filter(l => l.status === 'Suspended').length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Landlord Management</h1>
          <p className="text-gray-600">Manage and verify landlord accounts</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className={`card ${
            showSuccess.type === 'verified' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
          }`}>
            <div className="flex items-center space-x-3">
              {showSuccess.type === 'verified' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Ban className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className={`font-bold ${showSuccess.type === 'verified' ? 'text-green-700' : 'text-red-700'}`}>
                  Landlord {showSuccess.type === 'verified' ? 'Verified' : 'Suspended'}!
                </p>
                <p className={`text-sm ${showSuccess.type === 'verified' ? 'text-green-600' : 'text-red-600'}`}>
                  {showSuccess.name}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-green-50">
            <p className="text-sm text-green-700 mb-1">Verified Landlords</p>
            <p className="text-3xl font-bold text-green-800">{verifiedCount}</p>
          </div>
          <div className="card bg-yellow-50">
            <p className="text-sm text-yellow-700 mb-1">Pending Verification</p>
            <p className="text-3xl font-bold text-yellow-800">{pendingCount}</p>
          </div>
          <div className="card bg-red-50">
            <p className="text-sm text-red-700 mb-1">Suspended</p>
            <p className="text-3xl font-bold text-red-800">{suspendedCount}</p>
          </div>
        </div>

        {/* Search */}
        <div className="card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input-field pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Landlords Table */}
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Properties</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Join Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLandlords.map((landlord) => (
                  <tr key={landlord.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-bold">
                            {landlord.name.charAt(0)}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800">{landlord.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{landlord.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{landlord.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{landlord.totalProperties}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{landlord.joinDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={landlord.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(landlord)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLandlords.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No landlords found</p>
            </div>
          )}
        </div>

        {/* Landlord Details Modal */}
        {showModal && selectedLandlord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Landlord Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Landlord Profile */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-600">
                      {selectedLandlord.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedLandlord.name}</h3>
                    <StatusBadge status={selectedLandlord.status} />
                    <p className="text-sm text-gray-500 mt-1">ID: {selectedLandlord.id}</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Full Name</p>
                      <p className="font-semibold text-gray-900">{selectedLandlord.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email Address</p>
                      <p className="font-semibold text-gray-900">{selectedLandlord.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone Number</p>
                      <p className="font-semibold text-gray-900">{selectedLandlord.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Join Date</p>
                      <p className="font-semibold text-gray-900">{selectedLandlord.joinDate}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Residential Address</p>
                      <p className="font-semibold text-gray-900">{selectedLandlord.address}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Emergency Contact</p>
                      <p className="font-semibold text-gray-900">{selectedLandlord.emergencyContact}</p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-blue-900 mb-3">Business Information</h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-blue-700">Business Name</p>
                      <p className="font-semibold text-blue-900">{selectedLandlord.businessName}</p>
                    </div>
                    <div>
                      <p className="text-blue-700">TIN Number</p>
                      <p className="font-semibold text-blue-900">{selectedLandlord.tinNumber}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-blue-700">Business Address</p>
                      <p className="font-semibold text-blue-900">{selectedLandlord.businessAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Verification Documents */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-bold text-green-900 mb-3">Verification Documents</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-green-700">Valid ID</p>
                      <p className="font-semibold text-green-900">{selectedLandlord.validId}</p>
                    </div>
                    <div>
                      <p className="text-green-700">Bank Account</p>
                      <p className="font-semibold text-green-900">{selectedLandlord.bankAccount}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleViewDocuments(selectedLandlord.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Uploaded Documents
                      </button>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-purple-700 mb-1">Total Properties</p>
                    <p className="text-3xl font-bold text-purple-900">{selectedLandlord.totalProperties}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-sm text-orange-700 mb-1">Account Status</p>
                    <p className="text-lg font-bold text-orange-900">{selectedLandlord.status}</p>
                  </div>
                </div>

                {/* Verification History */}
                {selectedLandlord.verifiedDate && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Verification History</h4>
                    <div className="text-sm text-gray-700">
                      <p><strong>Verified on:</strong> {selectedLandlord.verifiedDate}</p>
                      <p><strong>Verified by:</strong> {selectedLandlord.verifiedBy}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200">
                  {selectedLandlord.status === 'Pending' && (
                    <button
                      onClick={() => handleVerify(selectedLandlord.id, selectedLandlord.name)}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Verify Landlord
                    </button>
                  )}
                  {selectedLandlord.status === 'Verified' && (
                    <button
                      onClick={() => handleSuspend(selectedLandlord.id, selectedLandlord.name)}
                      className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Ban className="w-5 h-5" />
                      Suspend Landlord
                    </button>
                  )}
                  {selectedLandlord.status === 'Suspended' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-700">
                        This landlord account is currently suspended.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Viewer Modal */}
        {showDocumentsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary-600" />
                  Verification Documents
                </h2>
                <button
                  onClick={() => setShowDocumentsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {loadingDocuments ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading documents...</p>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No documents uploaded yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      The landlord hasn't uploaded any verification documents
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900 capitalize">
                              {doc.document_type === 'validId' && 'Valid ID'}
                              {doc.document_type === 'businessPermit' && 'Business Permit'}
                              {doc.document_type === 'bankStatement' && 'Bank Statement'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                            </p>
                            {doc.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <a
                            href={doc.document_url}
                            download
                            className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </div>
                        
                        {/* Document Preview */}
                        <div className="bg-gray-50 rounded-lg p-2">
                          {doc.document_url.startsWith('data:image') ? (
                            <img
                              src={doc.document_url}
                              alt={doc.document_type}
                              className="w-full h-auto max-h-96 object-contain rounded"
                            />
                          ) : (
                            <div className="text-center py-8">
                              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-600 text-sm">
                                Click download to view this document
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminLandlords
