import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, CheckCircle, Users, Flag, Settings } from 'lucide-react'

const AdminSidebar = ({ onNavigate }) => {
  const location = useLocation()

  const links = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/verifications', icon: CheckCircle, label: 'Verifications' },
    { to: '/admin/landlords', icon: Users, label: 'Landlords' },
    { to: '/admin/reports', icon: Flag, label: 'Reports' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
  ]

  const handleClick = () => {
    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Admin Panel</h2>
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
                    ? 'bg-primary-500 text-white shadow-md'
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

export default AdminSidebar
