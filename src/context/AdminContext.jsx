import React, { createContext, useContext, useState } from 'react'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [landlords, setLandlords] = useState([
    {
      id: 1,
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '+63 912 345 6789',
      totalProperties: 2,
      status: 'Verified',
      joinDate: '2025-01-05',
      documentUrl: '#'
    },
    {
      id: 2,
      name: 'Juan Reyes',
      email: 'juan@email.com',
      phone: '+63 923 456 7890',
      totalProperties: 1,
      status: 'Pending',
      joinDate: '2025-01-10',
      documentUrl: '#'
    },
    {
      id: 3,
      name: 'Pedro Cruz',
      email: 'pedro@email.com',
      phone: '+63 934 567 8901',
      totalProperties: 0,
      status: 'Pending',
      joinDate: '2025-01-12',
      documentUrl: '#'
    }
  ])

  const [properties, setProperties] = useState([
    {
      id: 1,
      title: 'Modern Studio near UP Diliman',
      landlordName: 'Maria Santos',
      landlordId: 1,
      location: 'Quezon City',
      price: 8500,
      status: 'Verified',
      submittedDate: '2025-01-06',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'
    },
    {
      id: 2,
      title: 'Cozy Room with WiFi',
      landlordName: 'Juan Reyes',
      landlordId: 2,
      location: 'Manila',
      price: 5000,
      status: 'Pending',
      submittedDate: '2025-01-11',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500'
    },
    {
      id: 3,
      title: 'Spacious 2BR Apartment',
      landlordName: 'Maria Santos',
      landlordId: 1,
      location: 'Makati',
      price: 15000,
      status: 'Pending',
      submittedDate: '2025-01-12',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'
    }
  ])

  const [reports, setReports] = useState([
    {
      id: 1,
      propertyId: 1,
      propertyTitle: 'Modern Studio near UP Diliman',
      reportedBy: 'Student User',
      reason: 'Misleading photos',
      status: 'Pending Review',
      reportDate: '2025-01-13',
      description: 'The actual property looks different from the photos'
    },
    {
      id: 2,
      propertyId: 2,
      propertyTitle: 'Cozy Room with WiFi',
      reportedBy: 'Another Student',
      reason: 'Unresponsive landlord',
      status: 'Resolved',
      reportDate: '2025-01-10',
      description: 'Landlord not responding to messages'
    }
  ])

  const [activities, setActivities] = useState([
    { id: 1, type: 'verification', message: 'New property submitted by Maria Santos', time: '2 hours ago' },
    { id: 2, type: 'landlord', message: 'New landlord registration: Juan Reyes', time: '5 hours ago' },
    { id: 3, type: 'report', message: 'Property reported by student', time: '1 day ago' }
  ])

  // Property verification actions
  const approveProperty = (propertyId) => {
    setProperties(properties.map(prop =>
      prop.id === propertyId ? { ...prop, status: 'Verified' } : prop
    ))
    addActivity('verification', `Property approved: ${properties.find(p => p.id === propertyId)?.title}`)
  }

  const rejectProperty = (propertyId) => {
    setProperties(properties.map(prop =>
      prop.id === propertyId ? { ...prop, status: 'Rejected' } : prop
    ))
    addActivity('verification', `Property rejected: ${properties.find(p => p.id === propertyId)?.title}`)
  }

  // Landlord management actions
  const verifyLandlord = (landlordId) => {
    setLandlords(landlords.map(landlord =>
      landlord.id === landlordId ? { ...landlord, status: 'Verified' } : landlord
    ))
    addActivity('landlord', `Landlord verified: ${landlords.find(l => l.id === landlordId)?.name}`)
  }

  const suspendLandlord = (landlordId) => {
    setLandlords(landlords.map(landlord =>
      landlord.id === landlordId ? { ...landlord, status: 'Suspended' } : landlord
    ))
    addActivity('landlord', `Landlord suspended: ${landlords.find(l => l.id === landlordId)?.name}`)
  }

  // Report management actions
  const resolveReport = (reportId) => {
    setReports(reports.map(report =>
      report.id === reportId ? { ...report, status: 'Resolved' } : report
    ))
    addActivity('report', 'Report resolved')
  }

  const dismissReport = (reportId) => {
    setReports(reports.map(report =>
      report.id === reportId ? { ...report, status: 'Dismissed' } : report
    ))
    addActivity('report', 'Report dismissed')
  }

  // Helper function to add activity
  const addActivity = (type, message) => {
    const newActivity = {
      id: Date.now(),
      type,
      message,
      time: 'Just now'
    }
    setActivities([newActivity, ...activities])
  }

  // Calculate statistics
  const stats = {
    totalLandlords: landlords.length,
    pendingVerifications: properties.filter(p => p.status === 'Pending').length,
    activeProperties: properties.filter(p => p.status === 'Verified').length,
    reportedListings: reports.filter(r => r.status === 'Pending Review').length,
    pendingLandlords: landlords.filter(l => l.status === 'Pending').length,
    verifiedLandlords: landlords.filter(l => l.status === 'Verified').length
  }

  return (
    <AdminContext.Provider value={{
      landlords,
      properties,
      reports,
      activities,
      stats,
      approveProperty,
      rejectProperty,
      verifyLandlord,
      suspendLandlord,
      resolveReport,
      dismissReport
    }}>
      {children}
    </AdminContext.Provider>
  )
}
