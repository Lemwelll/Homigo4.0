import { useState, useMemo } from 'react'
import { DollarSign, Clock, TrendingUp, Calendar } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import EscrowSummaryCard from '../components/EscrowSummaryCard'
import FilterBar from '../components/FilterBar'
import EscrowTable from '../components/EscrowTable'
import PaymentDetailsModal from '../components/PaymentDetailsModal'
import { useEscrow } from '../context/EscrowContext'

const LandlordEscrow = () => {
  const { getLandlordTransactions } = useEscrow()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)

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

  return (
    <DashboardLayout userType="landlord">
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
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default LandlordEscrow
