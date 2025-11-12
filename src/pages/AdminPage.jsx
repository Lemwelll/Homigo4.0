import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { CheckCircle, XCircle, Eye, User, Building2 } from 'lucide-react'

const AdminPage = () => {
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 1,
      type: 'landlord',
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '+63 912 345 6789',
      submittedDate: '2025-01-10',
      documentUrl: '#'
    },
    {
      id: 2,
      type: 'property',
      title: 'Modern Studio near UP',
      landlord: 'Juan Reyes',
      location: 'Quezon City',
      price: 8500,
      submittedDate: '2025-01-11',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'
    },
    {
      id: 3,
      type: 'landlord',
      name: 'Pedro Cruz',
      email: 'pedro@email.com',
      phone: '+63 923 456 7890',
      submittedDate: '2025-01-12',
      documentUrl: '#'
    }
  ])

  const handleApprove = (id) => {
    setPendingVerifications(prev => prev.filter(item => item.id !== id))
  }

  const handleReject = (id) => {
    setPendingVerifications(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary-600">Homigo Admin</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin User</span>
              <User className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Verification Dashboard</h2>
          <p className="text-gray-600">Review and approve pending landlords and properties</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Pending Verifications</h3>
            <p className="text-4xl font-bold">{pendingVerifications.length}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Approved Today</h3>
            <p className="text-4xl font-bold">12</p>
          </div>
          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Rejected Today</h3>
            <p className="text-4xl font-bold">3</p>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Pending Verifications</h3>
          
          {pendingVerifications.map((item) => (
            <div key={item.id} className="card hover:shadow-xl transition-all duration-300">
              {item.type === 'landlord' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-secondary-100 p-4 rounded-full">
                      <User className="w-8 h-8 text-secondary-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-bold text-gray-800">{item.name}</h4>
                        <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Landlord
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.email}</p>
                      <p className="text-gray-600 text-sm">{item.phone}</p>
                      <p className="text-gray-500 text-xs mt-1">Submitted: {item.submittedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Documents</span>
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-bold text-gray-800">{item.title}</h4>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Property
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">Landlord: {item.landlord}</p>
                      <p className="text-gray-600 text-sm">{item.location} • ₱{item.price.toLocaleString()}/mo</p>
                      <p className="text-gray-500 text-xs mt-1">Submitted: {item.submittedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
