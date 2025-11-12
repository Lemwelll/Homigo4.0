import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Home } from 'lucide-react'

const LandlordLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/landlord/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <Home className="w-10 h-10 text-secondary-500" />
            <span className="text-3xl font-bold text-secondary-600">Homigo</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Landlord Login</h2>
          <p className="text-gray-600 mt-2">Manage your properties with ease</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="landlord@email.com"
                  className="input-field pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input-field pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-secondary-500 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-secondary-500 hover:text-secondary-600">Forgot password?</a>
            </div>

            <button type="submit" className="btn-secondary w-full">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/landlord/register" className="text-secondary-500 hover:text-secondary-600 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/student/login" className="text-gray-600 hover:text-gray-800">
            Are you a student? <span className="text-primary-500 font-semibold">Login here</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandlordLogin
