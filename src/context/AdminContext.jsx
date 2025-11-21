import React, { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

const API_URL = 'http://localhost:5000'

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [landlords, setLandlords] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)

  // Get JWT token from localStorage
  const getToken = () => {
    return localStorage.getItem('homigo_token')
  }

  // Fetch all landlords
  const fetchLandlords = async () => {
    try {
      setLoading(true)
      const token = getToken()
      
      if (!token) {
        console.log('❌ No token found - user not logged in')
        return
      }

      console.log('📡 Fetching landlords from:', `${API_URL}/admin/landlords`)

      const response = await fetch(`${API_URL}/admin/landlords`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('📥 Response status:', response.status)

      const data = await response.json()
      console.log('📦 Response data:', data)

      if (data.success) {
        console.log('✅ Landlords fetched successfully:', data.count, 'landlords')
        
        // Transform backend data to match frontend format
        const transformedLandlords = data.data.map(landlord => ({
          id: landlord.id,
          name: landlord.full_name || 'Unknown',
          email: landlord.email,
          phone: landlord.phone || 'N/A',
          businessName: landlord.business_name || 'N/A',
          tinNumber: 'N/A',
          address: 'N/A',
          businessAddress: 'N/A',
          emergencyContact: 'N/A',
          validId: 'N/A',
          bankAccount: 'N/A',
          documentUrl: '#',
          totalProperties: landlord.total_properties || 0,
          joinDate: new Date(landlord.created_at).toLocaleDateString(),
          status: landlord.is_verified ? 'Verified' : 'Pending',
          verifiedDate: landlord.verified_at ? new Date(landlord.verified_at).toLocaleDateString() : null,
          verifiedBy: landlord.verified_by || null
        }))
        
        console.log('🔄 Transformed landlords:', transformedLandlords)
        setLandlords(transformedLandlords)
      } else {
        console.error('❌ Failed to fetch landlords:', data.message)
      }
    } catch (error) {
      console.error('❌ Error fetching landlords:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all properties (for admin)
  const fetchAllProperties = async (statusFilter = null) => {
    try {
      setLoading(true)
      const token = getToken()
      
      if (!token) {
        console.log('No token found')
        return
      }

      const url = statusFilter 
        ? `${API_URL}/properties/admin/all?status=${statusFilter}`
        : `${API_URL}/properties/admin/all`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        // Transform backend data to match frontend format
        const transformedProperties = data.data.map(prop => ({
          id: prop.id,
          title: prop.title,
          landlordName: prop.users?.full_name || 'Unknown',
          landlordId: prop.landlord_id,
          location: prop.location,
          price: parseFloat(prop.rent_price),
          status: prop.verification_status === 'verified' ? 'Verified' : 
                  prop.verification_status === 'pending_verification' ? 'Pending' : 'Rejected',
          submittedDate: new Date(prop.created_at).toISOString().split('T')[0],
          image: prop.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
          description: prop.description,
          address: prop.address,
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          amenities: prop.property_amenities?.map(a => a.amenity_name) || []
        }))
        
        setProperties(transformedProperties)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('homigo_user') || '{}')
    if (user.role === 'admin') {
      fetchAllProperties()
      fetchLandlords()
    }
  }, [])

  // Property verification actions
  const approveProperty = async (propertyId, adminNote = '') => {
    try {
      const token = getToken()
      
      const response = await fetch(`${API_URL}/properties/admin/verify/${propertyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'verify',
          adminNote
        })
      })

      const data = await response.json()

      if (data.success) {
        // Refresh properties list
        await fetchAllProperties()
        return true
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error approving property:', error)
      throw error
    }
  }

  const rejectProperty = async (propertyId, adminNote = '') => {
    try {
      const token = getToken()
      
      const response = await fetch(`${API_URL}/properties/admin/verify/${propertyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'reject',
          adminNote
        })
      })

      const data = await response.json()

      if (data.success) {
        // Refresh properties list
        await fetchAllProperties()
        return true
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error rejecting property:', error)
      throw error
    }
  }

  // Landlord verification actions
  const verifyLandlord = async (landlordId) => {
    try {
      const token = getToken()
      
      const response = await fetch(`${API_URL}/admin/landlords/${landlordId}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        // Refresh landlords list
        await fetchLandlords()
        return true
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error verifying landlord:', error)
      throw error
    }
  }

  const suspendLandlord = async (landlordId, reason = '') => {
    try {
      const token = getToken()
      
      const response = await fetch(`${API_URL}/admin/landlords/${landlordId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      const data = await response.json()

      if (data.success) {
        // Refresh landlords list
        await fetchLandlords()
        return true
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error suspending landlord:', error)
      throw error
    }
  }

  // Calculate statistics from real data
  const stats = {
    totalLandlords: landlords.length,
    pendingVerifications: properties.filter(p => p.status === 'Pending').length,
    activeProperties: properties.filter(p => p.status === 'Verified').length,
    rejectedProperties: properties.filter(p => p.status === 'Rejected').length,
    totalProperties: properties.length,
    pendingLandlords: landlords.filter(l => l.status === 'Pending').length,
    verifiedLandlords: landlords.filter(l => l.status === 'Verified').length
  }

  return (
    <AdminContext.Provider value={{
      landlords,
      properties,
      loading,
      stats,
      approveProperty,
      rejectProperty,
      verifyLandlord,
      suspendLandlord,
      fetchAllProperties,
      fetchLandlords
    }}>
      {children}
    </AdminContext.Provider>
  )
}
