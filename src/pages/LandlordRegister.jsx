import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, Upload, Home, Building2 } from 'lucide-react'

const LandlordRegister = () => {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/landlord/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <img 
              src="/assets/Homigo.png" 
              alt="Homigo Logo" 
              className="h-16 w-auto md:h-20 lg:h-24 object-contain drop-shadow-lg transition-transform duration-200 hover:scale-105" 
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Landlord Registration</h2>
          <p className="text-gray-600 mt-2">Join our platform and reach thousands of students</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Maria Santos"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="landlord@email.com"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="+63 912 345 6789"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name (Optional)</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Santos Properties"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Government ID Verification</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">Upload your Government ID</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 5MB (Driver's License, Passport, etc.)</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="w-4 h-4 text-secondary-500 rounded mt-1" required />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-secondary-500 hover:text-secondary-600">Terms of Service</a> and <a href="#" className="text-secondary-500 hover:text-secondary-600">Privacy Policy</a>
              </span>
            </div>

            <button type="submit" className="btn-secondary w-full">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/landlord/login" className="text-secondary-500 hover:text-secondary-600 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandlordRegister
