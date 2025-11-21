import React, { createContext, useContext, useState, useEffect } from 'react'

const StudentContext = createContext()

const API_URL = 'http://localhost:5000'

export const useStudent = () => {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider')
  }
  return context
}

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  // Get JWT token
  const getToken = () => {
    return localStorage.getItem('homigo_token')
  }

  // Fetch student profile from backend
  const fetchStudentProfile = async () => {
    try {
      const token = getToken()
      console.log('🔑 Token:', token ? 'Found' : 'Not found')
      
      if (!token) {
        console.log('❌ No token, skipping profile fetch')
        setLoading(false)
        return
      }

      console.log('📡 Fetching profile from:', `${API_URL}/auth/profile`)
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('📊 Profile response status:', response.status)
      const data = await response.json()
      console.log('📦 Profile data:', data)

      if (data.success) {
        console.log('✅ Setting student profile:', data.data.full_name)
        setStudent({
          name: data.data.full_name,
          email: data.data.email,
          studentId: data.data.student_id_number || '',
          university: data.data.university || ''
        })
      } else {
        console.error('❌ Profile fetch failed:', data.message)
        // Set loading to false even if fetch fails
        setLoading(false)
      }
    } catch (error) {
      console.error('❌ Error fetching student profile:', error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  // Fetch verified properties from backend - OPTIMIZED
  const fetchVerifiedProperties = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${API_URL}/properties/verified`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.success) {
        // Transform backend data to match frontend format
        const transformedProperties = data.data.map(prop => {
          const price = parseFloat(prop.rent_price)
          
          // Determine price range
          let priceRange = 'all'
          if (price < 5000) priceRange = '0-5000'
          else if (price >= 5000 && price < 10000) priceRange = '5000-10000'
          else if (price >= 10000 && price < 15000) priceRange = '10000-15000'
          else priceRange = '15000+'

          // Extract city from location
          const city = prop.location.split(',')[0].trim()

          // Get all images sorted by display_order
          const allImages = prop.property_images
            ?.sort((a, b) => a.display_order - b.display_order)
            ?.map(img => img.image_url) || []

          return {
            id: prop.id,
            landlord_id: prop.landlord_id,
            title: prop.title,
            location: prop.location,
            city: city,
            price: price,
            priceRange: priceRange,
            bedrooms: prop.bedrooms,
            bathrooms: prop.bathrooms,
            verified: prop.verification_status === 'verified',
            image: allImages[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
            images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'],
            description: prop.description,
            landlordName: prop.users?.full_name || 'Landlord',
            landlordPhone: prop.users?.phone || '',
            landlordEmail: prop.users?.email || '',
            landlord: {
              name: prop.users?.full_name || 'Landlord',
              phone: prop.users?.phone || '',
              email: prop.users?.email || ''
            },
            amenities: prop.property_amenities?.map(a => a.amenity_name) || [],
            address: prop.address,
            paymentRules: {
              allowReservations: prop.allow_reservations,
              enableDownpayment: prop.enable_downpayment,
              downpaymentAmount: parseFloat(prop.downpayment_amount || 0)
            }
          }
        })
        
        setProperties(transformedProperties);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('❌ Request timeout');
      } else {
        console.error('❌ Error fetching properties:', error);
      }
      setProperties([]); // Set empty array on error
    }
  };

  // Fetch properties and profile on mount - OPTIMIZED (prevent multiple calls)
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      const user = JSON.parse(localStorage.getItem('homigo_user') || '{}');
      
      if (user.role === 'student') {
        // Use localStorage data as fallback
        if (user.name && isMounted) {
          setStudent({
            name: user.name,
            email: user.email || '',
            studentId: user.studentId || '',
            university: user.university || ''
          });
        }
        // Try to fetch from API (will update if successful)
        if (isMounted) {
          await fetchStudentProfile();
        }
      } else {
        if (isMounted) setLoading(false);
      }
      
      // Fetch properties only once
      if (isMounted) {
        await fetchVerifiedProperties();
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [])

  const [favorites, setFavorites] = useState([])

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(`${API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        // Extract just the property IDs
        const favoriteIds = data.data.map(fav => fav.property_id)
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  // Fetch favorites on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('homigo_user') || '{}')
    if (user.role === 'student') {
      fetchFavorites()
    }
  }, [])

  const [conversations, setConversations] = useState([
    {
      id: 1,
      landlordName: 'Maria Santos',
      landlordAvatar: 'https://i.pravatar.cc/150?img=1',
      propertyTitle: 'Modern Studio near UP Diliman',
      lastMessage: 'Yes, the property is still available!',
      timestamp: '2 hours ago',
      unread: true,
      messages: [
        { id: 1, sender: 'student', text: 'Hi! Is this property still available?', time: '10:30 AM' },
        { id: 2, sender: 'landlord', text: 'Yes, the property is still available!', time: '10:45 AM' },
        { id: 3, sender: 'landlord', text: 'Would you like to schedule a viewing?', time: '10:46 AM' }
      ]
    },
    {
      id: 2,
      landlordName: 'Juan Reyes',
      landlordAvatar: 'https://i.pravatar.cc/150?img=2',
      propertyTitle: 'Cozy Room with WiFi',
      lastMessage: 'You can move in next week',
      timestamp: '1 day ago',
      unread: false,
      messages: [
        { id: 1, sender: 'student', text: 'When can I move in?', time: 'Yesterday 3:20 PM' },
        { id: 2, sender: 'landlord', text: 'You can move in next week', time: 'Yesterday 3:45 PM' }
      ]
    }
  ])

  const toggleFavorite = async (propertyId) => {
    try {
      const token = getToken()
      if (!token) return

      const isFav = favorites.includes(propertyId)

      if (isFav) {
        // Remove from favorites
        const response = await fetch(`${API_URL}/favorites/${propertyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()

        if (data.success) {
          setFavorites(prev => prev.filter(id => id !== propertyId))
        }
      } else {
        // Add to favorites
        const response = await fetch(`${API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ property_id: propertyId })
        })

        const data = await response.json()

        if (data.success) {
          setFavorites(prev => [...prev, propertyId])
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId)
  }

  const getFavoriteProperties = () => {
    return properties.filter(prop => favorites.includes(prop.id))
  }

  const sendMessage = (conversationId, message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, {
            id: Date.now(),
            sender: 'student',
            text: message,
            time: 'Just now'
          }],
          lastMessage: message,
          timestamp: 'Just now'
        }
      }
      return conv
    }))
  }

  const updateProfile = (updates) => {
    setStudent(prev => ({ ...prev, ...updates }))
  }

  const stats = {
    savedListings: favorites.length,
    newMessages: conversations.filter(c => c.unread).length,
    totalProperties: properties.length
  }

  return (
    <StudentContext.Provider value={{
      student,
      properties,
      favorites,
      conversations,
      stats,
      loading,
      toggleFavorite,
      isFavorite,
      getFavoriteProperties,
      sendMessage,
      updateProfile,
      fetchVerifiedProperties,
      fetchFavorites
    }}>
      {children}
    </StudentContext.Provider>
  )
}
