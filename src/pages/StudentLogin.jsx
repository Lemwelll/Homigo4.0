import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Home } from 'lucide-react'

const StudentLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/student/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <img 
              src="/assets/Homigo.png" 
              alt="Homigo Logo" 
              className="h-16 w-auto md:h-20 lg:h-24 object-contain drop-shadow-lg transition-transform duration-200 hover:scale-105" 
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Student Login</h2>
          <p className="text-gray-600 mt-2">Welcome back! Find your perfect home</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="student@university.edu"
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
                <input type="checkbox" className="w-4 h-4 text-primary-500 rounded" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-500 hover:text-primary-600">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/student/register" className="text-primary-500 hover:text-primary-600 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/landlord/login" className="text-gray-600 hover:text-gray-800">
            Are you a landlord? <span className="text-secondary-500 font-semibold">Login here</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin
