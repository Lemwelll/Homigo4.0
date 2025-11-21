import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Backend API URL
const API_URL = 'http://localhost:5000/auth'

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
    const storedToken = localStorage.getItem('homigo_token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const { email, password } = credentials

      // Call backend API
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        // Map backend user data to frontend format
        const authenticatedUser = {
          id: data.data.user.id,
          name: data.data.user.full_name,
          email: data.data.user.email,
          role: data.data.user.role,
          phone: data.data.user.phone,
          is_verified: data.data.user.is_verified || false
        }

        setUser(authenticatedUser)
        localStorage.setItem('homigo_user', JSON.stringify(authenticatedUser))
        localStorage.setItem('homigo_token', data.data.token)
        
        return { success: true, user: authenticatedUser }
      } else {
        return { success: false, error: data.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const register = async (userData) => {
    try {
      const { fullName, email, password, phone, role, studentIdNumber, university, businessName } = userData

      // Call backend API
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
          role: role || 'student',
          studentIdNumber,
          university,
          businessName
        })
      })

      const data = await response.json()

      if (data.success) {
        // Map backend user data to frontend format
        const newUser = {
          id: data.data.user.id,
          name: data.data.user.full_name,
          email: data.data.user.email,
          role: data.data.user.role,
          phone: data.data.user.phone
        }

        setUser(newUser)
        localStorage.setItem('homigo_user', JSON.stringify(newUser))
        localStorage.setItem('homigo_token', data.data.token)
        
        return { success: true, user: newUser }
      } else {
        return { success: false, error: data.message || 'Registration failed' }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('homigo_user')
    localStorage.removeItem('homigo_token')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('homigo_user', JSON.stringify(updatedUser))
  }

  const refreshProfile = async () => {
    try {
      const token = localStorage.getItem('homigo_token')
      if (!token) return

      const response = await fetch(`http://localhost:5000/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        const updatedUser = {
          id: data.data.id,
          name: data.data.full_name,
          email: data.data.email,
          role: data.data.role,
          phone: data.data.phone,
          is_verified: data.data.is_verified || false
        }

        setUser(updatedUser)
        localStorage.setItem('homigo_user', JSON.stringify(updatedUser))
        return { success: true, user: updatedUser }
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
      return { success: false, error: error.message }
    }
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
    refreshProfile,
    isAuthenticated,
    hasRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
