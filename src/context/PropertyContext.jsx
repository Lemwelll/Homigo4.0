import React, { createContext, useContext, useState } from 'react'

const PropertyContext = createContext()

export const useProperties = () => {
  const context = useContext(PropertyContext)
  if (!context) {
    throw new Error('useProperties must be used within PropertyProvider')
  }
  return context
}

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: 'Modern Studio near UP Diliman',
      location: 'Quezon City',
      price: 8500,
      bedrooms: 1,
      bathrooms: 1,
      status: 'Active',
      views: 245,
      inquiries: 12,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
      description: 'A cozy and modern studio apartment perfect for students.',
      amenities: ['WiFi', 'Air Conditioning', 'Security'],
      address: '123 University Avenue, Quezon City'
    },
    {
      id: 2,
      title: 'Cozy Room with WiFi',
      location: 'Manila',
      price: 5000,
      bedrooms: 1,
      bathrooms: 1,
      status: 'Pending Verification',
      views: 89,
      inquiries: 5,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      description: 'Affordable room with high-speed internet.',
      amenities: ['WiFi', 'Water', 'Electricity'],
      address: '456 Taft Avenue, Manila'
    }
  ])

  const addProperty = (property) => {
    const newProperty = {
      ...property,
      id: Date.now(),
      status: 'Pending Verification',
      views: 0,
      inquiries: 0
    }
    setProperties([...properties, newProperty])
    return newProperty
  }

  const updateProperty = (id, updatedData) => {
    setProperties(properties.map(prop => 
      prop.id === id ? { ...prop, ...updatedData } : prop
    ))
  }

  const deleteProperty = (id) => {
    setProperties(properties.filter(prop => prop.id !== id))
  }

  const getPropertyById = (id) => {
    return properties.find(prop => prop.id === parseInt(id))
  }

  const stats = {
    totalProperties: properties.length,
    totalViews: properties.reduce((sum, prop) => sum + prop.views, 0),
    totalInquiries: properties.reduce((sum, prop) => sum + prop.inquiries, 0),
    totalRevenue: properties.reduce((sum, prop) => sum + prop.price, 0)
  }

  return (
    <PropertyContext.Provider value={{
      properties,
      addProperty,
      updateProperty,
      deleteProperty,
      getPropertyById,
      stats
    }}>
      {children}
    </PropertyContext.Provider>
  )
}
