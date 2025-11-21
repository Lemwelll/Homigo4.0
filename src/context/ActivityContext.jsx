import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ActivityContext = createContext()

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useActivity = () => {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used within ActivityProvider')
  }
  return context
}

export const ActivityProvider = ({ children }) => {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)

  const getToken = () => localStorage.getItem('homigo_token')

  const fetchActivities = async () => {
    if (!user || user.role !== 'landlord') {
      console.log('⏭️ Skipping activity fetch - not a landlord')
      return
    }

    try {
      setLoading(true)
      const token = getToken()

      console.log('📡 Fetching activities for landlord...')
      const response = await fetch(`${API_URL}/activities/landlord`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await response.json()
      console.log('📊 Activities response:', data)

      if (data.success) {
        console.log('✅ Activities loaded:', data.data.length)
        setActivities(data.data)
      } else {
        console.error('❌ Failed to load activities:', data.message)
      }
    } catch (error) {
      console.error('❌ Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && user.role === 'landlord') {
      console.log('🔄 User is landlord, fetching activities...')
      fetchActivities()
    }
  }, [user])

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = Math.floor((now - time) / 1000) // seconds

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`
    return time.toLocaleDateString()
  }

  const value = {
    activities,
    loading,
    fetchActivities,
    getTimeAgo
  }

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  )
}
