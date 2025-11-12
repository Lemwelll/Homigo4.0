import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('homigo_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (credentials) => {
    // Mock authentication - in real app, this would call an API
    const { email, password, role } = credentials

    // Mock user data based on role
    const userData = {
      student: {
        id: 1,
        name: 'Lemuel',
        email: 'lemuel@university.edu',
        role: 'student',
        studentId: '2021-12345',
        university: 'University of the Philippines'
      },
      landlord: {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@email.com',
        role: 'landlord',
        phone: '+63 912 345 6789',
        businessName: 'Santos Properties'
      },
      admin: {
        id: 3,
        name: 'Admin User',
        email: 'admin@homigo.com',
        role: 'admin'
      }
    }

    const authenticatedUser = userData[role]
    
    if (authenticatedUser) {
      setUser(authenticatedUser)
      localStorage.setItem('homigo_user', JSON.stringify(authenticatedUser))
      return { success: true, user: authenticatedUser }
    }

    return { success: false, error: 'Invalid credentials' }
  }

  const register = (userData) => {
    // Mock registration - in real app, this would call an API
    const newUser = {
      id: Date.now(),
      ...userData,
      role: userData.role || 'student'
    }

    setUser(newUser)
    localStorage.setItem('homigo_user', JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('homigo_user')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('homigo_user', JSON.stringify(updatedUser))
  }

  const isAuthenticated = () => {
    return !!user
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    hasRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
