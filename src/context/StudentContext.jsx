import React, { createContext, useContext, useState } from 'react'

const StudentContext = createContext()

export const useStudent = () => {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error('useStudent must be used within StudentProvider')
  }
  return context
}

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState({
    name: 'Lemuel',
    email: 'lemuel@university.edu',
    studentId: '2021-12345',
    university: 'University of the Philippines'
  })

  const [properties] = useState([
    {
      id: 1,
      title: 'Modern Studio near UP Diliman',
      location: 'Quezon City',
      city: 'Quezon City',
      price: 8500,
      priceRange: '5000-10000',
      bedrooms: 1,
      bathrooms: 1,
      verified: true,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
      description: 'A cozy and modern studio apartment perfect for students. Located just 5 minutes from UP Diliman campus.',
      landlordName: 'Maria Santos',
      landlordPhone: '+63 912 345 6789',
      landlordEmail: 'maria@email.com',
      amenities: ['WiFi', 'Air Conditioning', 'Security', 'Water', 'Electricity'],
      address: '123 University Avenue, Quezon City'
    },
    {
      id: 2,
      title: 'Cozy Room with WiFi',
      location: 'Manila',
      city: 'Manila',
      price: 5000,
      priceRange: '0-5000',
      bedrooms: 1,
      bathrooms: 1,
      verified: true,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      description: 'Affordable room with high-speed internet, perfect for students on a budget.',
      landlordName: 'Juan Reyes',
      landlordPhone: '+63 923 456 7890',
      landlordEmail: 'juan@email.com',
      amenities: ['WiFi', 'Water', 'Electricity'],
      address: '456 Taft Avenue, Manila'
    },
    {
      id: 3,
      title: 'Spacious 2BR Apartment',
      location: 'Makati',
      city: 'Makati',
      price: 15000,
      priceRange: '15000+',
      bedrooms: 2,
      bathrooms: 2,
      verified: true,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
      description: 'Spacious apartment ideal for sharing with roommates. Near business district.',
      landlordName: 'Ana Garcia',
      landlordPhone: '+63 934 567 8901',
      landlordEmail: 'ana@email.com',
      amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Security', 'Water', 'Electricity'],
      address: '789 Ayala Avenue, Makati'
    },
    {
      id: 4,
      title: 'Affordable Bedspace',
      location: 'Taft Avenue, Manila',
      city: 'Manila',
      price: 3500,
      priceRange: '0-5000',
      bedrooms: 1,
      bathrooms: 1,
      verified: false,
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=500',
      description: 'Budget-friendly bedspace near universities and public transport.',
      landlordName: 'Pedro Cruz',
      landlordPhone: '+63 945 678 9012',
      landlordEmail: 'pedro@email.com',
      amenities: ['WiFi', 'Water', 'Electricity'],
      address: '321 Taft Avenue, Manila'
    },
    {
      id: 5,
      title: 'Fully Furnished Condo',
      location: 'Pasig',
      city: 'Pasig',
      price: 12000,
      priceRange: '10000-15000',
      bedrooms: 1,
      bathrooms: 1,
      verified: true,
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500',
      description: 'Modern condo with all amenities included. Perfect for professionals and students.',
      landlordName: 'Lisa Tan',
      landlordPhone: '+63 956 789 0123',
      landlordEmail: 'lisa@email.com',
      amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Security', 'Gym', 'Pool'],
      address: '555 Ortigas Avenue, Pasig'
    },
    {
      id: 6,
      title: 'Student Dormitory Room',
      location: 'Quezon City',
      city: 'Quezon City',
      price: 4500,
      priceRange: '0-5000',
      bedrooms: 1,
      bathrooms: 1,
      verified: true,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500',
      description: 'Clean and safe dormitory room near UP campus with 24/7 security.',
      landlordName: 'Robert Lee',
      landlordPhone: '+63 967 890 1234',
      landlordEmail: 'robert@email.com',
      amenities: ['WiFi', 'Security', 'Water', 'Electricity', 'Laundry'],
      address: '888 Commonwealth Avenue, Quezon City'
    }
  ])

  const [favorites, setFavorites] = useState([1, 3])

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

  const toggleFavorite = (propertyId) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
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
      toggleFavorite,
      isFavorite,
      getFavoriteProperties,
      sendMessage,
      updateProfile
    }}>
      {children}
    </StudentContext.Provider>
  )
}
