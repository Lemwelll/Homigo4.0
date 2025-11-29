import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, MessageSquare, Settings, PlusCircle, List, Calendar, Wallet, Clock, MapPin, Crown, Receipt } from 'lucide-react'
import { useAccountTier } from '../context/AccountTierContext'

const Sidebar = ({ userType, onNavigate, isExpanded = true }) => {
  const location = useLocation()
  const { accountState } = useAccountTier()

  const studentLinks = [
    { to: '/student/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/student/browse', icon: Search, label: 'Browse Properties' },
    { to: '/student/reservations', icon: Clock, label: 'Reservations' },
    { to: '/student/bookings', icon: Calendar, label: 'My Bookings' },
    { to: '/student/escrow', icon: Wallet, label: 'Escrow Payments' },
    { to: '/student/favorites', icon: Heart, label: 'Saved Listings' },
    { to: '/student/landmarks', icon: MapPin, label: 'Landmarks Map', premium: true },
    { to: '/payment-history', icon: Receipt, label: 'Payment History' },
    { to: '/student/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/student/settings', icon: Settings, label: 'Settings' },
  ]

  const landlordLinks = [
    { to: '/landlord/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/landlord/properties', icon: List, label: 'My Properties' },
    { to: '/landlord/add-property', icon: PlusCircle, label: 'Add Property' },
    { to: '/landlord/reservations', icon: Clock, label: 'Reservations' },
    { to: '/landlord/bookings', icon: Calendar, label: 'Bookings' },
    { to: '/landlord/escrow', icon: Wallet, label: 'Escrow Payments' },
    { to: '/payment-history', icon: Receipt, label: 'Payment History' },
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
    <div className="h-full overflow-y-auto overflow-x-hidden">
      <div className="p-4">
        {/* Portal Title - Only show when expanded on desktop */}
        <h2 className={`font-bold text-gray-800 mb-6 transition-all duration-300 whitespace-nowrap ${
          isExpanded ? 'lg:opacity-100 lg:text-lg' : 'lg:opacity-0 lg:text-xs lg:h-0 lg:mb-2'
        } text-lg opacity-100`}>
          {userType === 'student' ? 'Student Portal' : 'Landlord Portal'}
        </h2>
        
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.to
            const isPremiumOnly = link.premium && accountState.tier !== 'premium'
            
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
                    ? `${activeColor} text-white shadow-md`
                    : isPremiumOnly
                    ? 'text-gray-400 hover:bg-gray-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? 'lg:opacity-100 lg:w-auto' : 'lg:opacity-0 lg:w-0 lg:hidden'
                } opacity-100 w-auto flex items-center gap-2`}>
                  {link.label}
                  {link.premium && accountState.tier === 'premium' && (
                    <Crown className="w-3 h-3 text-yellow-400" />
                  )}
                  {isPremiumOnly && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Premium</span>
                  )}
                </span>
                
                {/* Tooltip for collapsed state on desktop */}
                {!isExpanded && (
                  <span className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {link.label}
                    {isPremiumOnly && ' (Premium)'}
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

export default Sidebar
