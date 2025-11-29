import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import API_URL from '../config/api'

const MessageContext = createContext()


export const useMessages = () => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessages must be used within MessageProvider')
  }
  return context
}

export const MessageProvider = ({ children }) => {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Get JWT token
  const getToken = () => {
    return localStorage.getItem('homigo_token')
  }

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setLoading(true)
      const token = getToken()
      
      if (!token) return

      const response = await fetch(`${API_URL}/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setConversations(data.data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages with a specific user
  const fetchMessages = async (partnerId) => {
    try {
      setLoading(true)
      const token = getToken()
      
      if (!token || !partnerId) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/messages/${partnerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setMessages(data.data)
        // Refresh conversations to update unread count
        await fetchConversations()
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Send a message
  const sendMessage = async (receiverId, message, propertyId = null) => {
    try {
      const token = getToken()
      
      if (!token) {
        throw new Error('Not authenticated')
      }

      if (!receiverId || !message) {
        throw new Error('Receiver ID and message are required')
      }

      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          message: message.trim(),
          property_id: propertyId
        })
      })

      const data = await response.json()

      if (data.success) {
        // Add message to current messages
        setMessages(prev => [...prev, data.data])
        // Refresh conversations
        await fetchConversations()
        return data.data
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Mark messages as read
  const markAsRead = async (partnerId) => {
    try {
      const token = getToken()
      
      if (!token) return

      await fetch(`${API_URL}/messages/read/${partnerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Refresh conversations to update unread count
      await fetchConversations()
      await fetchUnreadCount()
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const token = getToken()
      
      if (!token) return

      const response = await fetch(`${API_URL}/messages/unread/count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setUnreadCount(data.data.count)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  // Start a new conversation
  const startConversation = async (partner, propertyId = null) => {
    setCurrentConversation({
      id: partner.id,
      name: partner.name,
      email: partner.email,
      role: partner.role,
      propertyId: propertyId
    })
    
    // Try to fetch existing messages
    await fetchMessages(partner.id)
  }

  // Select a conversation
  const selectConversation = async (conversation) => {
    if (!conversation) {
      setCurrentConversation(null)
      setMessages([])
      return
    }
    
    setCurrentConversation({
      id: conversation.partnerId,
      name: conversation.partnerName,
      email: conversation.partnerEmail,
      role: conversation.partnerRole
    })
    await fetchMessages(conversation.partnerId)
    await markAsRead(conversation.partnerId)
  }

  // Fetch conversations and unread count on mount
  useEffect(() => {
    if (user) {
      fetchConversations()
      fetchUnreadCount()

      // Poll for new messages every 10 seconds
      const interval = setInterval(() => {
        fetchConversations()
        fetchUnreadCount()
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [user])

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    unreadCount,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
    startConversation,
    selectConversation,
    fetchUnreadCount
  }

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  )
}
