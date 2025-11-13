import { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu, X, Home, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const DashboardLayout = ({ children, userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Get user initials
  const getInitials = () => {
    if (!user?.name) return 'U'
    const names = user.name.split(' ')
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0)
    }
    return names[0].charAt(0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center justify-between h-full px-6 py-3">
          {/* Left Section: Hamburger + Logo */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Menu - Mobile Only */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Logo + App Name */}
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/Homigo.png" 
                alt="Homigo Logo" 
                className="h-12 md:h-16 lg:h-20 w-auto object-contain drop-shadow-md transition-transform duration-200 hover:scale-105" 
              />
            </div>
          </div>

          {/* Right Section: Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
            >
              {/* Profile Circle */}
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm">
                {getInitials()}
              </div>
              {/* User Name - Hidden on Mobile */}
              <span className="hidden md:block text-gray-700 font-medium">
                {user?.name || 'User'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileOpen(false)}
                ></div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || userType}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileOpen(false)
                      navigate(`/${user?.role || userType}/settings`)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 ${isSidebarExpanded ? 'lg:w-64' : 'lg:w-20'
          } w-64`}
      >
        <Sidebar
          userType={userType}
          onNavigate={closeSidebar}
          isExpanded={isSidebarExpanded}
        />
      </div>

      {/* Main Content */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'
        }`}>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
