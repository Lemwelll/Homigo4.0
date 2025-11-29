import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, Upload, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config/api'

const StudentRegister = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    university: '',
    studentIdNumber: ''
  })
  const [studentIdFile, setStudentIdFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)

    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: 'student',
      studentIdNumber: formData.studentIdNumber,
      university: formData.university
    })

    if (result.success) {
      // If student ID file is selected, save base64 to database
      if (studentIdFile && result.user.id) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
          const uploadResponse = await fetch(`${API_URL}/upload/student-id`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: result.user.id,
              base64Image: studentIdFile
            })
          })

          const uploadData = await uploadResponse.json()
          
          if (!uploadData.success) {
            console.error('File upload failed:', uploadData.message)
          }
        } catch (uploadError) {
          console.error('File upload error:', uploadError)
        }
      }

      navigate('/student/dashboard')
    } else {
      setError(result.error || 'Registration failed')
    }

    setLoading(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type)) {
        setError('Only JPEG, PNG, and GIF files are allowed')
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        setStudentIdFile(reader.result) // Store base64 string
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      {/* Back Button - Fixed Position */}
      <Link 
        to="/" 
        className="fixed top-4 left-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 group z-10"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" />
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <img 
              src="/assets/Homigo.png" 
              alt="Homigo Logo" 
              className="h-16 w-auto md:h-20 lg:h-24 object-contain drop-shadow-lg transition-transform duration-200 hover:scale-105" 
            />
          </Link>
          <h2 className="text-3xl font-bold text-gray-800">Student Registration</h2>
          <p className="text-gray-600 mt-2">Create your account and start finding your perfect home</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Juan Dela Cruz"
                    className="input-field pl-10"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    placeholder="student@university.edu"
                    className="input-field pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">University</label>
                <input
                  type="text"
                  placeholder="University of the Philippines"
                  className="input-field"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID Number</label>
              <input
                type="text"
                placeholder="2021-12345"
                className="input-field"
                value={formData.studentIdNumber}
                onChange={(e) => setFormData({ ...formData, studentIdNumber: e.target.value })}
                required
              />
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID Verification (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
                   onClick={() => document.getElementById('studentIdInput').click()}>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">
                  {studentIdFile ? '✓ Student ID Selected' : 'Upload your Student ID'}
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                <input 
                  id="studentIdInput"
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex items-start">
              <input type="checkbox" className="w-4 h-4 text-primary-500 rounded mt-1" required />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-primary-500 hover:text-primary-600">Terms of Service</a> and <a href="#" className="text-primary-500 hover:text-primary-600">Privacy Policy</a>
              </span>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/student/login" className="text-primary-500 hover:text-primary-600 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentRegister
