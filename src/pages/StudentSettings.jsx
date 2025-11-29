import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useStudent } from '../context/StudentContext'
import { useAccountTier } from '../context/AccountTierContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Save, CheckCircle, BookOpen, Crown, AlertTriangle, X } from 'lucide-react'

const API_URL = 'http://localhost:5000'

const StudentSettings = () => {
  const { student, updateProfile } = useStudent()
  const { accountState, downgradeToFree } = useAccountTier()
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [profileData, setProfileData] = useState({
    name: student.name,
    email: student.email,
    studentId: student.studentId,
    university: student.university,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNewProperties: true,
    emailMessages: true,
    smsMessages: true,
    weeklyReports: false,
    priceDropAlerts: true
  })
  const [prefsLoading, setPrefsLoading] = useState(false)

  // Fetch notification preferences on mount
  React.useEffect(() => {
    fetchNotificationPreferences()
  }, [])

  const fetchNotificationPreferences = async () => {
    try {
      const token = localStorage.getItem('homigo_token')
      const response = await fetch(`${API_URL}/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setNotificationPrefs({
          emailNewProperties: data.data.email_new_properties,
          emailMessages: data.data.email_messages,
          smsMessages: data.data.sms_messages,
          weeklyReports: data.data.weekly_reports,
          priceDropAlerts: data.data.price_drop_alerts
        })
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPrefsLoading(true)
    
    try {
      // Update profile
      const result = await updateProfile({
        name: profileData.name,
        email: profileData.email,
        studentId: profileData.studentId,
        university: profileData.university
      })
      
      // Update notification preferences
      const token = localStorage.getItem('homigo_token')
      const prefsResponse = await fetch(`${API_URL}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationPrefs)
      })
      const prefsData = await prefsResponse.json()
      
      if (result.success && prefsData.success) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        alert('Failed to update some settings')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Failed to update settings')
    } finally {
      setPrefsLoading(false)
    }
  }

  return (
    <DashboardLayout userType="student">
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {showSuccess && (
          <div className="card bg-green-50 border-2 border-green-500">
            <div className="flex items-center space-x-3 text-green-700">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-bold">Settings Saved!</p>
                <p className="text-sm">Your changes have been updated successfully.</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Information */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="input-field pl-10"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    className="input-field pl-10"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="input-field pl-10"
                    value={profileData.studentId}
                    onChange={(e) => setProfileData({ ...profileData, studentId: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">University</label>
                <input
                  type="text"
                  className="input-field"
                  value={profileData.university}
                  onChange={(e) => setProfileData({ ...profileData, university: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    className="input-field pl-10"
                    placeholder="Enter current password"
                    value={profileData.currentPassword}
                    onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    className="input-field pl-10"
                    placeholder="Enter new password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    className="input-field pl-10"
                    placeholder="Confirm new password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Preferences</h2>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-primary-500 rounded" 
                  checked={notificationPrefs.emailNewProperties}
                  onChange={(e) => setNotificationPrefs({...notificationPrefs, emailNewProperties: e.target.checked})}
                />
                <span className="text-gray-700">Email notifications for new properties</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-primary-500 rounded" 
                  checked={notificationPrefs.smsMessages}
                  onChange={(e) => setNotificationPrefs({...notificationPrefs, smsMessages: e.target.checked})}
                />
                <span className="text-gray-700">SMS notifications for messages</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-primary-500 rounded" 
                  checked={notificationPrefs.weeklyReports}
                  onChange={(e) => setNotificationPrefs({...notificationPrefs, weeklyReports: e.target.checked})}
                />
                <span className="text-gray-700">Weekly property recommendations</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-primary-500 rounded" 
                  checked={notificationPrefs.priceDropAlerts}
                  onChange={(e) => setNotificationPrefs({...notificationPrefs, priceDropAlerts: e.target.checked})}
                />
                <span className="text-gray-700">Price drop alerts for saved listings</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={prefsLoading}
              className="btn-primary flex items-center space-x-2 px-8 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{prefsLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>

        {/* Subscription Management */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-800">Subscription</h2>
          </div>

          {accountState.tier === 'premium' ? (
            <div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-yellow-900">Premium Student</h3>
                    <p className="text-yellow-700">Active subscription</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-yellow-900">₱149</p>
                    <p className="text-sm text-yellow-700">per month</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-yellow-800">
                  <p>✓ Unlimited favorites</p>
                  <p>✓ Unlimited reservations</p>
                  <p>✓ Priority support</p>
                </div>
              </div>

              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full px-4 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 transition font-semibold"
              >
                Cancel Subscription
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Free Plan</h3>
                <p className="text-gray-600 mb-4">Limited to 3 favorites and 2 active reservations</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Up to 3 favorites</p>
                  <p>• Up to 2 reservations</p>
                  <p>• Basic support</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/upgrade')}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition font-semibold"
              >
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>

        {/* Cancel Subscription Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Cancel Subscription?</h2>
                </div>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to cancel your Premium subscription?
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-semibold mb-2">You will lose access to:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Unlimited favorites</li>
                    <li>• Unlimited reservations</li>
                    <li>• Priority support</li>
                    <li>• Advanced features</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Keep Premium
                </button>
                <button
                  onClick={() => {
                    downgradeToFree()
                    setShowCancelModal(false)
                    setShowSuccess(true)
                    setTimeout(() => setShowSuccess(false), 3000)
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentSettings
