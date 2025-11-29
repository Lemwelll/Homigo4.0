import { useState, useMemo } from 'react'
import { DollarSign, Clock, TrendingUp, Calendar } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import EscrowSummaryCard from '../components/EscrowSummaryCard'
import FilterBar from '../components/FilterBar'
import EscrowTable from '../components/EscrowTable'
import PaymentDetailsModal from '../components/PaymentDetailsModal'
import NotificationToast from '../components/NotificationToast'
import { useEscrow } from '../context/EscrowContext'
import API_URL from '../config/api'

const LandlordEscrow = () => {
  const { getLandlordTransactions, refreshTransactions } = useEscrow()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [notification, setNotification] = useState(null)

  // Mock landlord ID - in real app, get from auth context
  const landlordId = 'LL-001'
  const allTransactions = getLandlordTransactions(landlordId)

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalEarnings = allTransactions
      .filter(t => t.status === 'released')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const pendingReleases = allTransactions
      .filter(t => t.status === 'held' || t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const lastPayment = allTransactions
      .filter(t => t.status === 'released')
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]

    return {
      totalEarnings,
      pendingReleases,
      lastPaymentDate: lastPayment ? lastPayment.date : 'N/A',
      transactionCount: allTransactions.length
    }
  }, [allTransactions])

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(t => t.status === activeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        t =>
          t.propertyTitle.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query) ||
          t.propertyId.toLowerCase().includes(query) ||
          t.studentName.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [allTransactions, activeFilter, searchQuery])

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Held', value: 'held' },
    { label: 'Released', value: 'released' }
  ]

  // Handle Accept Payment
  const handleAcceptPayment = async (escrowId) => {
    try {
      const token = localStorage.getItem('homigo_token')
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/escrow/${escrowId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Payment accepted successfully! The payment has been released to you.'
        })
        setTimeout(() => setNotification(null), 5000)
        setSelectedTransaction(null)
        // Refresh transactions if the context provides this method
        if (refreshTransactions) {
          refreshTransactions()
        }
      } else {
        throw new Error(data.message || 'Failed to accept payment')
      }
    } catch (error) {
      console.error('Error accepting payment:', error)
      setNotification({
        type: 'error',
        message: error.message
      })
      setTimeout(() => setNotification(null), 5000)
      // Close modal and refresh to show current status
      setSelectedTransaction(null)
      if (refreshTransactions) {
        refreshTransactions()
      }
    }
  }

  // Handle Decline Payment
  const handleDeclinePayment = async (escrowId) => {
    const reason = prompt('Please provide a reason for declining this payment:')
    if (!reason) {
      return // User cancelled
    }

    try {
      const token = localStorage.getItem('homigo_token')
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/escrow/${escrowId}/decline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      const data = await response.json()
      
      if (data.success) {
        setNotification({
          type: 'success',
          message: 'Payment declined successfully! The payment has been refunded to the student.'
        })
        setTimeout(() => setNotification(null), 5000)
        setSelectedTransaction(null)
        // Refresh transactions if the context provides this method
        if (refreshTransactions) {
          refreshTransactions()
        }
      } else {
        throw new Error(data.message || 'Failed to decline payment')
      }
    } catch (error) {
      console.error('Error declining payment:', error)
      setNotification({
        type: 'error',
        message: error.message
      })
      setTimeout(() => setNotification(null), 5000)
      // Close modal and refresh to show current status
      setSelectedTransaction(null)
      if (refreshTransactions) {
        refreshTransactions()
      }
    }
  }

  return (
    <DashboardLayout userType="landlord">
      {/* Notification Toast */}
      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escrow Payments</h1>
          <p className="text-gray-600">
            Monitor your earnings and payment releases
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <EscrowSummaryCard
            title="Total Earnings"
            value={`₱${stats.totalEarnings.toLocaleString()}`}
            icon={DollarSign}
            color="green"
            trend="up"
            trendValue="+12%"
          />
          <EscrowSummaryCard
            title="Pending Releases"
            value={`₱${stats.pendingReleases.toLocaleString()}`}
            icon={Clock}
            color="yellow"
          />
          <EscrowSummaryCard
            title="Total Transactions"
            value={stats.transactionCount}
            icon={TrendingUp}
            color="blue"
          />
          <EscrowSummaryCard
            title="Last Payment"
            value={stats.lastPaymentDate}
            icon={Calendar}
            color="purple"
          />
        </div>

        {/* Filter Bar */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
        />

        {/* Transactions Table */}
        <EscrowTable
          transactions={filteredTransactions}
          onViewDetails={setSelectedTransaction}
          userType="landlord"
        />

        {/* Payment Details Modal */}
        {selectedTransaction && (
          <PaymentDetailsModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            userType="landlord"
            onAccept={handleAcceptPayment}
            onDecline={handleDeclinePayment}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default LandlordEscrow
