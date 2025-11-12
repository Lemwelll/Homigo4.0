import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import StatusBadge from '../components/StatusBadge'
import { useAdmin } from '../context/AdminContext'
import { CheckCircle, Ban, Eye, Search, Mail, Phone } from 'lucide-react'

const AdminLandlords = () => {
  const { landlords, verifyLandlord, suspendLandlord } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuccess, setShowSuccess] = useState(null)

  const filteredLandlords = landlords.filter(landlord =>
    landlord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    landlord.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVerify = (landlordId, landlordName) => {
    verifyLandlord(landlordId)
    setShowSuccess({ type: 'verified', name: landlordName })
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleSuspend = (landlordId, landlordName) => {
    suspendLandlord(landlordId)
    setShowSuccess({ type: 'suspended', name: landlordName })
    setTimeout(() => setShowSuccess(null), 3000)
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
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Documents"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {landlord.status === 'Pending' && (
                          <button
                            onClick={() => handleVerify(landlord.id, landlord.name)}
                            className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Verify</span>
                          </button>
                        )}
                        {landlord.status === 'Verified' && (
                          <button
                            onClick={() => handleSuspend(landlord.id, landlord.name)}
                            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-1"
                          >
                            <Ban className="w-4 h-4" />
                            <span>Suspend</span>
                          </button>
                        )}
                      </div>
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
      </div>
    </AdminLayout>
  )
}

export default AdminLandlords
