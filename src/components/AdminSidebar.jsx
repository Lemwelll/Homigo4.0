import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, CheckCircle, Users, Flag, Settings } from 'lucide-react'

const AdminSidebar = ({ onNavigate, isExpanded = true }) => {
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
    <div className="h-full overflow-y-auto overflow-x-hidden">
      <div className="p-4">
        {/* Panel Title - Only show when expanded on desktop */}
        <h2 className={`font-bold text-gray-800 mb-6 transition-all duration-300 whitespace-nowrap ${
          isExpanded ? 'lg:opacity-100 lg:text-lg' : 'lg:opacity-0 lg:text-xs lg:h-0 lg:mb-2'
        } text-lg opacity-100`}>
          Admin Panel
        </h2>
        
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleClick}
                title={!isExpanded ? link.label : ''}
                className={`flex items-center rounded-lg transition-all duration-200 group relative ${
                  isExpanded ? 'lg:px-4 lg:py-3 lg:space-x-3' : 'lg:px-3 lg:py-3 lg:justify-center'
                } px-4 py-3 space-x-3 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? 'lg:opacity-100 lg:w-auto' : 'lg:opacity-0 lg:w-0 lg:hidden'
                } opacity-100 w-auto`}>
                  {link.label}
                </span>
                
                {/* Tooltip for collapsed state on desktop */}
                {!isExpanded && (
                  <span className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {link.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default AdminSidebar
