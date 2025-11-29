import React, { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useMessages } from '../context/MessageContext'
import { Search, Send, X, MessageSquare, Plus } from 'lucide-react'
import API_URL from '../config/api'

const StudentMessages = () => {
  const { 
    conversations, 
    currentConversation, 
    messages, 
    loading,
    sendMessage, 
    selectConversation,
    startConversation
  } = useMessages()
  
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [landlordSearch, setLandlordSearch] = useState('')
  const [landlords, setLandlords] = useState([])
  const [searchingLandlords, setSearchingLandlords] = useState(false)
  const messagesEndRef = useRef(null)

  const filteredConversations = conversations.filter(conv =>
    conv.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (messageText.trim() && currentConversation && currentConversation.id) {
      try {
        await sendMessage(currentConversation.id, messageText)
        setMessageText('')
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    } else {
      console.error('Cannot send message: missing conversation or receiver ID')
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  // Search for landlords
  const searchLandlords = async (query) => {
    if (!query.trim()) {
      setLandlords([])
      return
    }

    try {
      setSearchingLandlords(true)
      const token = localStorage.getItem('homigo_token')
      
      const response = await fetch(`${API_URL}/auth/users?role=landlord&search=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setLandlords(data.data || [])
      }
    } catch (error) {
      console.error('Error searching landlords:', error)
    } finally {
      setSearchingLandlords(false)
    }
  }

  // Handle landlord search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showNewMessageModal) {
        searchLandlords(landlordSearch)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [landlordSearch, showNewMessageModal])

  // Start conversation with selected landlord
  const handleSelectLandlord = async (landlord) => {
    await startConversation({
      id: landlord.id,
      name: landlord.full_name,
      email: landlord.email,
      role: 'landlord'
    })
    setShowNewMessageModal(false)
    setLandlordSearch('')
    setLandlords([])
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
            <p className="text-gray-600">Chat with landlords about properties</p>
          </div>
          <button
            onClick={() => setShowNewMessageModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Message</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 card p-0 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
              {loading && conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                  <p>Loading conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Start chatting with landlords about properties</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.partnerId}
                    onClick={() => selectConversation(conversation)}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      currentConversation?.id === conversation.partnerId
                        ? 'bg-primary-50 border-l-4 border-l-primary-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                        {conversation.partnerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-gray-800 truncate">{conversation.partnerName}</h4>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        {conversation.property && (
                          <p className="text-xs text-gray-500 mb-1 truncate">{conversation.property.title}</p>
                        )}
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTime(conversation.lastMessageTime)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col h-[700px]">
            {currentConversation ? (
              <>
                <div className="p-4 border-b bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                      {currentConversation.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{currentConversation.name}</h3>
                      <p className="text-sm text-gray-500">{currentConversation.role === 'landlord' ? 'Landlord' : 'Student'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => selectConversation(null)}
                    className="lg:hidden text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-sm mt-1">Start the conversation!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwnMessage = msg.sender_id === JSON.parse(localStorage.getItem('homigo_user') || '{}').id
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-primary-500 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                          >
                            <p className="break-words">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              isOwnMessage ? 'text-primary-100' : 'text-gray-400'
                            }`}>
                              {formatTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Message Modal */}
        {showNewMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">New Message</h2>
                <button
                  onClick={() => {
                    setShowNewMessageModal(false)
                    setLandlordSearch('')
                    setLandlords([])
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Landlord
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Type landlord name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    value={landlordSearch}
                    onChange={(e) => setLandlordSearch(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {searchingLandlords ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    <p>Searching...</p>
                  </div>
                ) : landlords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>{landlordSearch ? 'No landlords found' : 'Start typing to search'}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {landlords.map((landlord) => (
                      <button
                        key={landlord.id}
                        onClick={() => handleSelectLandlord(landlord)}
                        className="w-full p-3 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                            {landlord.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{landlord.full_name}</h4>
                            <p className="text-sm text-gray-500">{landlord.email}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentMessages
