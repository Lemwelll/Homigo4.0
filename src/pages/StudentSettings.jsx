import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useStudent } from '../context/StudentContext'
import { User, Mail, Lock, Save, CheckCircle, BookOpen } from 'lucide-react'

const StudentSettings = () => {
  const { student, updateProfile } = useStudent()
  const [showSuccess, setShowSuccess] = useState(false)
  const [profileData, setProfileData] = useState({
    name: student.name,
    email: student.email,
    studentId: student.studentId,
    university: student.university,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile({
      name: profileData.name,
      email: profileData.email,
      studentId: profileData.studentId,
      university: profileData.university
    })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
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
                <input type="checkbox" className="w-5 h-5 text-primary-500 rounded" defaultChecked />
                <span className="text-gray-700">Email notifications for new properties</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-primary-500 rounded" defaultChecked />
                <span className="text-gray-700">SMS notifications for messages</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-primary-500 rounded" />
                <span className="text-gray-700">Weekly property recommendations</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-primary-500 rounded" defaultChecked />
                <span className="text-gray-700">Price drop alerts for saved listings</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2 px-8"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default StudentSettings
