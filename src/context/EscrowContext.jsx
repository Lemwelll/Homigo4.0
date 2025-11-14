import { createContext, useContext, useState, useEffect } from 'react'

const EscrowContext = createContext()

export const useEscrow = () => {
  const context = useContext(EscrowContext)
  if (!context) {
    throw new Error('useEscrow must be used within EscrowProvider')
  }
  return context
}

export const EscrowProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([])

  // Initialize with mock data
  useEffect(() => {
    const mockTransactions = [
      {
        id: 'ESC-2025-001',
        propertyId: 'PROP-001',
        propertyTitle: 'Modern Studio near UP Diliman',
        propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        studentName: 'Juan Dela Cruz',
        studentId: 'STU-001',
        landlordName: 'Maria Santos',
        landlordId: 'LL-001',
        amount: 15000,
        status: 'held',
        date: '2025-01-10',
        timeline: [
          { status: 'paid', date: '2025-01-10', label: 'Payment Initiated' },
          { status: 'held', date: '2025-01-10', label: 'Held in Escrow' }
        ]
      },
      {
        id: 'ESC-2025-002',
        propertyId: 'PROP-002',
        propertyTitle: 'Cozy Apartment in Taft Avenue',
        propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
        studentName: 'Maria Garcia',
        studentId: 'STU-002',
        landlordName: 'Pedro Reyes',
        landlordId: 'LL-002',
        amount: 12000,
        status: 'released',
        date: '2025-01-05',
        timeline: [
          { status: 'paid', date: '2025-01-05', label: 'Payment Initiated' },
          { status: 'held', date: '2025-01-05', label: 'Held in Escrow' },
          { status: 'released', date: '2025-01-08', label: 'Released to Landlord' }
        ]
      },
      {
        id: 'ESC-2025-003',
        propertyId: 'PROP-003',
        propertyTitle: 'Spacious Room in Katipunan',
        propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
        studentName: 'Carlos Mendoza',
        studentId: 'STU-003',
        landlordName: 'Ana Lopez',
        landlordId: 'LL-003',
        amount: 18000,
        status: 'pending',
        date: '2025-01-12',
        timeline: [
          { status: 'pending', date: '2025-01-12', label: 'Payment Pending' }
        ]
      },
      {
        id: 'ESC-2025-004',
        propertyId: 'PROP-004',
        propertyTitle: 'Budget-Friendly Dorm in España',
        propertyImage: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400',
        studentName: 'Sofia Ramos',
        studentId: 'STU-004',
        landlordName: 'Roberto Cruz',
        landlordId: 'LL-004',
        amount: 8000,
        status: 'refunded',
        date: '2025-01-03',
        timeline: [
          { status: 'paid', date: '2025-01-03', label: 'Payment Initiated' },
          { status: 'held', date: '2025-01-03', label: 'Held in Escrow' },
          { status: 'refunded', date: '2025-01-06', label: 'Refunded to Student' }
        ]
      }
    ]

    const stored = localStorage.getItem('escrowTransactions')
    if (stored) {
      setTransactions(JSON.parse(stored))
    } else {
      setTransactions(mockTransactions)
      localStorage.setItem('escrowTransactions', JSON.stringify(mockTransactions))
    }
  }, [])

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('escrowTransactions', JSON.stringify(transactions))
    }
  }, [transactions])

  const updateTransactionStatus = (transactionId, newStatus) => {
    setTransactions(prev => prev.map(transaction => {
      if (transaction.id === transactionId) {
        const updatedTimeline = [...transaction.timeline]
        const statusLabel = {
          pending: 'Payment Pending',
          held: 'Held in Escrow',
          released: 'Released to Landlord',
          refunded: 'Refunded to Student'
        }
        
        updatedTimeline.push({
          status: newStatus,
          date: new Date().toISOString().split('T')[0],
          label: statusLabel[newStatus]
        })

        return {
          ...transaction,
          status: newStatus,
          timeline: updatedTimeline
        }
      }
      return transaction
    }))
  }

  const getStudentTransactions = (studentId) => {
    return transactions.filter(t => t.studentId === studentId)
  }

  const getLandlordTransactions = (landlordId) => {
    return transactions.filter(t => t.landlordId === landlordId)
  }

  const getTransactionById = (id) => {
    return transactions.find(t => t.id === id)
  }

  const value = {
    transactions,
    updateTransactionStatus,
    getStudentTransactions,
    getLandlordTransactions,
    getTransactionById
  }

  return <EscrowContext.Provider value={value}>{children}</EscrowContext.Provider>
}
