import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import StatusBadge from '../components/StatusBadge'
import { useAdmin } from '../context/AdminContext'
import { CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react'

const AdminReports = () => {
  const { reports, resolveReport, dismissReport } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showSuccess, setShowSuccess] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleResolve = (reportId) => {
    resolveReport(reportId)
    setShowSuccess({ type: 'resolved' })
    setSelectedReport(null)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleDismiss = (reportId) => {
    dismissReport(reportId)
    setShowSuccess({ type: 'dismissed' })
    setSelectedReport(null)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const pendingCount = reports.filter(r => r.status === 'Pending Review').length
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length
  const dismissedCount = reports.filter(r => r.status === 'Dismissed').length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reported Listings</h1>
          <p className="text-gray-600">Review and manage reported properties</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className={`card ${
            showSuccess.type === 'resolved' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-500'
          }`}>
            <div className="flex items-center space-x-3">
              <CheckCircle className={`w-6 h-6 ${showSuccess.type === 'resolved' ? 'text-green-600' : 'text-gray-600'}`} />
              <p className={`font-bold ${showSuccess.type === 'resolved' ? 'text-green-700' : 'text-gray-700'}`}>
                Report {showSuccess.type === 'resolved' ? 'Resolved' : 'Dismissed'}!
              </p>
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
            <p className="text-sm text-green-700 mb-1">Resolved</p>
            <p className="text-3xl font-bold text-green-800">{resolvedCount}</p>
          </div>
          <div className="card bg-gray-50">
            <p className="text-sm text-gray-700 mb-1">Dismissed</p>
            <p className="text-3xl font-bold text-gray-800">{dismissedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
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
                <option value="Pending Review">Pending Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Dismissed">Dismissed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="card hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{report.propertyTitle}</h3>
                    <StatusBadge status={report.status} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><span className="font-semibold">Reported by:</span> {report.reportedBy}</p>
                      <p><span className="font-semibold">Reason:</span> {report.reason}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Report Date:</span> {report.reportDate}</p>
                      <p><span className="font-semibold">Property ID:</span> #{report.propertyId}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Description:</p>
                <p className="text-gray-600">{report.description}</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Property</span>
                </button>
                {report.status === 'Pending Review' && (
                  <>
                    <button
                      onClick={() => handleResolve(report.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Resolve</span>
                    </button>
                    <button
                      onClick={() => handleDismiss(report.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Dismiss</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="card text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reports found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminReports
