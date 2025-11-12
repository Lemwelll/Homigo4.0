import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, MessageSquare, Settings, PlusCircle, List } from 'lucide-react'

const Sidebar = ({ userType, onNavigate }) => {
  const location = useLocation()

  const studentLinks = [
    { to: '/student/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/student/browse', icon: Search, label: 'Browse Properties' },
    { to: '/student/favorites', icon: Heart, label: 'Saved Listings' },
    { to: '/student/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/student/settings', icon: Settings, label: 'Settings' },
  ]

  const landlordLinks = [
    { to: '/landlord/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/landlord/properties', icon: List, label: 'My Properties' },
    { to: '/landlord/add-property', icon: PlusCircle, label: 'Add Property' },
    { to: '/landlord/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/landlord/settings', icon: Settings, label: 'Settings' },
  ]

  const links = userType === 'student' ? studentLinks : landlordLinks
  const activeColor = userType === 'student' ? 'bg-primary-500' : 'bg-secondary-500'

  const handleClick = () => {
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          {userType === 'student' ? 'Student Portal' : 'Landlord Portal'}
        </h2>
        <nav className="space-y-1 sm:space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleClick}
                className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 transform hover:translate-x-1 ${
                  isActive
                    ? `${activeColor} text-white shadow-md`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
