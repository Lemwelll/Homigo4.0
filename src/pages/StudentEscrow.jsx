import { useState, useMemo } from 'react'
import { Wallet, Lock, CheckCircle, RefreshCw } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import EscrowSummaryCard from '../components/EscrowSummaryCard'
import FilterBar from '../components/FilterBar'
import EscrowTable from '../components/EscrowTable'
import PaymentDetailsModal from '../components/PaymentDetailsModal'
import { useEscrow } from '../context/EscrowContext'

const StudentEscrow = () => {
  const { getStudentTransactions } = useEscrow()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  // Mock student ID - in real app, get from auth context
  const studentId = 'STU-001'
  const allTransactions = getStudentTransactions(studentId)

  // Calculate summary stats
  const stats = useMemo(() => {
    const total = allTransactions.reduce((sum, t) => sum + t.amount, 0)
    const held = allTransactions
      .filter(t => t.status === 'held')
      .reduce((sum, t) => sum + t.amount, 0)
    const released = allTransactions
      .filter(t => t.status === 'released')
      .reduce((sum, t) => sum + t.amount, 0)
    const refunded = allTransactions
      .filter(t => t.status === 'refunded')
      .reduce((sum, t) => sum + t.amount, 0)

    return { total, held, released, refunded }
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
          t.propertyId.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [allTransactions, activeFilter, searchQuery])

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Held', value: 'held' },
    { label: 'Released', value: 'released' },
    { label: 'Refunded', value: 'refunded' }
  ]

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Escrow Payments</h1>
          <p className="text-gray-600">
            Track your secure payments and transaction history
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <EscrowSummaryCard
            title="Total Payments"
            value={`₱${stats.total.toLocaleString()}`}
            icon={Wallet}
            color="blue"
          />
          <EscrowSummaryCard
            title="Held in Escrow"
            value={`₱${stats.held.toLocaleString()}`}
            icon={Lock}
            color="yellow"
          />
          <EscrowSummaryCard
            title="Released"
            value={`₱${stats.released.toLocaleString()}`}
            icon={CheckCircle}
            color="green"
          />
          <EscrowSummaryCard
            title="Refunded"
            value={`₱${stats.refunded.toLocaleString()}`}
            icon={RefreshCw}
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
          userType="student"
        />

        {/* Payment Details Modal */}
        {selectedTransaction && (
          <PaymentDetailsModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            userType="student"
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentEscrow
