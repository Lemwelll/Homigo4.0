import React, { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Save, CheckCircle, User, Mail, Lock, Bell } from 'lucide-react'

const AdminSettings = () => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [settings, setSettings] = useState({
    name: 'Admin User',
    email: 'admin@homigo.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    reportAlerts: true,
    weeklyReports: false,
    autoApprove: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Settings</h1>
          <p className="text-gray-600">Manage your admin account and preferences</p>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="input-field pl-10"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    className="input-field pl-10"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
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
                    value={settings.currentPassword}
                    onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
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
                    value={settings.newPassword}
                    onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
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
                    value={settings.confirmPassword}
                    onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Settings</h2>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-500 rounded"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                />
                <span className="text-gray-700">Email notifications for new reports</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-500 rounded"
                  checked={settings.reportAlerts}
                  onChange={(e) => setSettings({ ...settings, reportAlerts: e.target.checked })}
                />
                <span className="text-gray-700">Instant alerts for urgent reports</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-500 rounded"
                  checked={settings.weeklyReports}
                  onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                />
                <span className="text-gray-700">Weekly activity summary reports</span>
              </label>
            </div>
          </div>

          {/* Platform Settings */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Platform Settings</h2>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-500 rounded"
                  checked={settings.autoApprove}
                  onChange={(e) => setSettings({ ...settings, autoApprove: e.target.checked })}
                />
                <div>
                  <span className="text-gray-700 block">Auto-approve verified landlords</span>
                  <span className="text-sm text-gray-500">Automatically approve properties from verified landlords</span>
                </div>
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
    </AdminLayout>
  )
}

export default AdminSettings
