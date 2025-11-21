import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, ArrowLeft, User, Building2, Shield } from 'lucide-react'

const UnifiedLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState('student')
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const roles = [
    {
      id: 'student',
      name: 'Student',
      icon: User,
      color: 'bg-primary-500',
      description: 'Find your perfect home'
    },
    {
      id: 'landlord',
      name: 'Landlord',
      icon: Building2,
      color: 'bg-secondary-500',
      description: 'Manage your properties'
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: Shield,
      color: 'bg-gray-700',
      description: 'Platform management'
    }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login({ ...formData, role: selectedRole })

    if (result.success) {
      // Check if there's a redirect URL stored
      const redirectUrl = localStorage.getItem('redirectAfterLogin')
      
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin')
        navigate(redirectUrl)
      } else {
        // Navigate to appropriate dashboard based on user role from backend
        const dashboardRoutes = {
          student: '/student/dashboard',
          landlord: '/landlord/dashboard',
          admin: '/admin/dashboard'
        }
        navigate(dashboardRoutes[result.user.role])
      }
    } else {
      setError(result.error || 'Login failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
      {/* Back Button - Fixed Position */}
      <Link 
        to="/" 
        className="fixed top-4 left-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 group z-10"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
      </Link>

      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <img 
              src="/assets/Homigo.png" 
              alt="Homigo Logo" 
              className="h-20 w-auto md:h-24 lg:h-28 object-contain drop-shadow-lg transition-transform duration-200 hover:scale-105" 
            />
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3 text-center">I am a:</p>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedRole === role.id
                      ? `${role.color} text-white border-transparent shadow-lg scale-105`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-semibold">{role.name}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Login Form */}
        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-primary-500 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-500 hover:text-primary-600">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                selectedRole === 'student'
                  ? 'bg-primary-500 hover:bg-primary-600'
                  : selectedRole === 'landlord'
                  ? 'bg-secondary-500 hover:bg-secondary-600'
                  : 'bg-gray-700 hover:bg-gray-800'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to={`/${selectedRole}/register`}
                className={`font-semibold ${
                  selectedRole === 'student'
                    ? 'text-primary-500 hover:text-primary-600'
                    : selectedRole === 'landlord'
                    ? 'text-secondary-500 hover:text-secondary-600'
                    : 'text-gray-700 hover:text-gray-800'
                }`}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 card bg-blue-50 border border-blue-200">
          <p className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Student: Any email + password</p>
            <p>• Landlord: Any email + password</p>
            <p>• Admin: Any email + password</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnifiedLogin
