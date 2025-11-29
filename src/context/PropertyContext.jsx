import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const PropertyContext = createContext()


export const useProperties = () => {
  const context = useContext(PropertyContext)
  if (!context) {
    throw new Error('useProperties must be used within PropertyProvider')
  }
  return context
}

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [cache, setCache] = useState(new Map())
  const [lastFetch, setLastFetch] = useState(0)

  // Get JWT token from localStorage
  const getToken = () => {
    return localStorage.getItem('homigo_token')
  }

  // Fetch properties for logged-in landlord - OPTIMIZED with caching
  const fetchMyProperties = useCallback(async (forceRefresh = false) => {
    try {
      const now = Date.now()
      const cacheKey = 'my-properties'
      const CACHE_DURATION = 30000 // 30 seconds

      // Check cache first
      if (!forceRefresh && cache.has(cacheKey) && (now - lastFetch) < CACHE_DURATION) {
        setProperties(cache.get(cacheKey))
        return
      }

      setLoading(true)
      const token = getToken()
      
      if (!token) {
        console.log('No token found, skipping fetch')
        setProperties([])
        setLoading(false)
        return
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${API_URL}/properties/my-properties`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (data.success) {
        // Transform backend data to match frontend format
        const transformedProperties = data.data.map(prop => {
          // Get all images sorted by display_order
          const allImages = prop.property_images
            ?.sort((a, b) => a.display_order - b.display_order)
            ?.map(img => img.image_url) || []

          return {
            id: prop.id,
            title: prop.title,
            location: prop.location,
            price: parseFloat(prop.rent_price),
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            status: prop.verification_status === 'verified' ? 'Active' : 
                    prop.verification_status === 'pending_verification' ? 'Pending Verification' : 'Rejected',
            views: prop.views,
            inquiries: prop.inquiries,
            image: allImages[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
            images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'],
            description: prop.description,
            amenities: prop.property_amenities?.map(a => a.amenity_name) || [],
            address: prop.address,
            paymentRules: {
              allowReservations: prop.allow_reservations,
              enableDownpayment: prop.enable_downpayment,
              downpaymentAmount: parseFloat(prop.downpayment_amount || 0)
            }
          }
        })
        
        setProperties(transformedProperties)
        setCache(prev => new Map(prev).set(cacheKey, transformedProperties))
        setLastFetch(now)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout')
      } else {
        console.error('Error fetching properties:', error)
      }
    } finally {
      setLoading(false)
    }
  }, [cache, lastFetch])

  // Fetch properties on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('homigo_user') || '{}')
    if (user.role === 'landlord') {
      fetchMyProperties()
    }
  }, [])

  // Add property
  const addProperty = async (property) => {
    try {
      const token = getToken()
      
      const response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(property)
      })

      const data = await response.json()

      if (data.success) {
        // Refresh properties list
        await fetchMyProperties()
        return data.data
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error adding property:', error)
      throw error
    }
  }

  // Update property
  const updateProperty = async (id, updatedData) => {
    try {
      const token = getToken()
      
      const response = await fetch(`${API_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      const data = await response.json()

      if (data.success) {
        // Refresh properties list
        await fetchMyProperties()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error updating property:', error)
      throw error
    }
  }

  // Delete property
  const deleteProperty = async (id) => {
    try {
      const token = getToken()
      
      const response = await fetch(`${API_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        // Refresh properties list
        await fetchMyProperties()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      throw error
    }
  }

  // Get property by ID (from local state)
  const getPropertyById = (id) => {
    return properties.find(prop => prop.id === id)
  }

  // Fetch single property by ID from backend
  const fetchPropertyById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/properties/${id}`)
      const data = await response.json()

      if (data.success) {
        // Transform backend data to match frontend format
        const prop = data.data
        return {
          id: prop.id,
          title: prop.title,
          location: prop.location,
          price: parseFloat(prop.rent_price),
          bedrooms: prop.bedrooms,
          bathrooms: prop.bathrooms,
          status: prop.verification_status === 'verified' ? 'Active' : 
                  prop.verification_status === 'pending_verification' ? 'Pending Verification' : 'Rejected',
          views: prop.views,
          inquiries: prop.inquiries,
          image: prop.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
          images: prop.property_images?.map(img => img.image_url) || [],
          description: prop.description,
          amenities: prop.property_amenities?.map(a => a.amenity_name) || [],
          address: prop.address,
          landlord_id: prop.landlord_id,
          landlord: prop.users ? {
            id: prop.users.id,
            name: prop.users.full_name,
            email: prop.users.email,
            phone: prop.users.phone
          } : null,
          paymentRules: {
            allowReservations: prop.allow_reservations,
            enableDownpayment: prop.enable_downpayment,
            downpaymentAmount: parseFloat(prop.downpayment_amount || 0)
          }
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching property:', error)
      return null
    }
  }

  // Calculate stats - MEMOIZED
  const stats = useMemo(() => ({
    totalProperties: properties.length,
    totalViews: properties.reduce((sum, prop) => sum + (prop.views || 0), 0),
    totalInquiries: properties.reduce((sum, prop) => sum + (prop.inquiries || 0), 0),
    totalRevenue: properties.reduce((sum, prop) => sum + (prop.price || 0), 0)
  }), [properties])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    properties,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    fetchPropertyById,
    fetchMyProperties,
    stats
  }), [properties, loading, stats, fetchMyProperties])

  return (
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  )
}
