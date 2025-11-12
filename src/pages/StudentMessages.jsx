import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useStudent } from '../context/StudentContext'
import { Search, Send, X } from 'lucide-react'

const StudentMessages = () => {
  const { conversations, sendMessage } = useStudent()
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter(conv =>
    conv.landlordName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (messageText.trim() && selectedConversation) {
      sendMessage(selectedConversation.id, messageText)
      setMessageText('')
    }
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation?.id)

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
          <p className="text-gray-600">Chat with landlords about properties</p>
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
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-primary-50 border-l-4 border-l-primary-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={conversation.landlordAvatar}
                      alt={conversation.landlordName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-800 truncate">{conversation.landlordName}</h4>
                        {conversation.unread && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1 truncate">{conversation.propertyTitle}</p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">{conversation.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col h-[700px]">
            {selectedConv ? (
              <>
                <div className="p-4 border-b bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedConv.landlordAvatar}
                      alt={selectedConv.landlordName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">{selectedConv.landlordName}</h3>
                      <p className="text-sm text-gray-500">{selectedConv.propertyTitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {selectedConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'student'
                            ? 'bg-primary-500 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'student' ? 'text-primary-100' : 'text-gray-400'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
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
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
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
                  <Search className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentMessages
