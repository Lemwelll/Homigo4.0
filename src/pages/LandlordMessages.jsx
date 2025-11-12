import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Search, Send, X } from 'lucide-react'

const LandlordMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const messages = [
    {
      id: 1,
      sender: 'Juan Dela Cruz',
      avatar: 'https://i.pravatar.cc/150?img=5',
      property: 'Modern Studio near UP Diliman',
      preview: 'Hi! Is this property still available?',
      timestamp: '2 hours ago',
      unread: true,
      conversation: [
        { sender: 'Juan Dela Cruz', text: 'Hi! Is this property still available?', time: '10:30 AM' },
        { sender: 'You', text: 'Yes, it is! Would you like to schedule a viewing?', time: '10:45 AM' }
      ]
    },
    {
      id: 2,
      sender: 'Maria Santos',
      avatar: 'https://i.pravatar.cc/150?img=6',
      property: 'Cozy Room with WiFi',
      preview: 'Can I move in next week?',
      timestamp: '5 hours ago',
      unread: true,
      conversation: [
        { sender: 'Maria Santos', text: 'Can I move in next week?', time: '8:15 AM' }
      ]
    },
    {
      id: 3,
      sender: 'Pedro Reyes',
      avatar: 'https://i.pravatar.cc/150?img=7',
      property: 'Modern Studio near UP Diliman',
      preview: 'Thank you for the information!',
      timestamp: '1 day ago',
      unread: false,
      conversation: [
        { sender: 'Pedro Reyes', text: 'What are the payment terms?', time: 'Yesterday 3:20 PM' },
        { sender: 'You', text: 'First month + 2 months deposit', time: 'Yesterday 3:45 PM' },
        { sender: 'Pedro Reyes', text: 'Thank you for the information!', time: 'Yesterday 4:00 PM' }
      ]
    }
  ]

  const filteredMessages = messages.filter(msg =>
    msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.property.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (messageText.trim()) {
      console.log('Sending:', messageText)
      setMessageText('')
    }
  }

  return (
    <DashboardLayout userType="landlord">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with potential tenants</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="md:col-span-1 card p-0 overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto max-h-[600px]">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id
                      ? 'bg-secondary-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={message.avatar}
                      alt={message.sender}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-800 truncate">{message.sender}</h4>
                        {message.unread && (
                          <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{message.property}</p>
                      <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                      <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Panel */}
          <div className="md:col-span-2 card p-0 overflow-hidden flex flex-col h-[700px]">
            {selectedMessage ? (
              <>
                <div className="p-4 border-b bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedMessage.avatar}
                      alt={selectedMessage.sender}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">{selectedMessage.sender}</h3>
                      <p className="text-sm text-gray-500">{selectedMessage.property}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="md:hidden text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {selectedMessage.conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'You'
                            ? 'bg-secondary-500 text-white'
                            : 'bg-white text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'You' ? 'text-secondary-100' : 'text-gray-400'
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
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors flex items-center space-x-2"
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
                  <p className="text-lg">Select a message to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LandlordMessages
