import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, Menu, X, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ isLoggedIn = false, userType = null }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const currentUser = user || { role: userType }
  const isAuthenticated = isLoggedIn || !!user

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold text-primary-600">Homigo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-500 transition-colors">
                  Login
                </Link>
                <Link to="/student/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span>{user?.name || 'User'}</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                    <Link
                      to={`/${currentUser.role}/settings`}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-primary-500">
                  Login
                </Link>
                <Link to="/student/register" className="block btn-primary text-center">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/${currentUser.role}/settings`}
                  className="flex items-center text-gray-700 hover:text-primary-500"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-primary-500 w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
