import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useAccountTier } from '../context/AccountTierContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Save, CheckCircle, Building2, MapPin, CreditCard, FileText, Upload, X, Eye, Crown, AlertTriangle } from 'lucide-react'
import API_URL from '../config/api'


const LandlordSettings = () => {
  const { accountState, downgradeToFree } = useAccountTier()
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    tinNumber: '',
    businessAddress: '',
    residentialAddress: '',
    emergencyContact: '',
    validIdType: '',
    validIdNumber: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [documents, setDocuments] = useState({
    validId: null,
    businessPermit: null,
    bankStatement: null
  })
  const [documentPreviews, setDocumentPreviews] = useState({
    validId: null,
    businessPermit: null,
    bankStatement: null
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('homigo_token')
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setProfileData({
          ...profileData,
          fullName: data.data.full_name || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          businessName: data.data.business_name || '',
          tinNumber: data.data.tin_number || '',
          businessAddress: data.data.business_address || '',
          residentialAddress: data.data.residential_address || '',
          emergencyContact: data.data.emergency_contact || '',
          validIdType: data.data.valid_id_type || '',
          validIdNumber: data.data.valid_id_number || '',
          bankName: data.data.bank_name || '',
          bankAccountNumber: data.data.bank_account_number || '',
          bankAccountName: data.data.bank_account_name || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0]
    if (file) {
      setDocuments({ ...documents, [docType]: file })
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setDocumentPreviews({ ...documentPreviews, [docType]: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeDocument = (docType) => {
    setDocuments({ ...documents, [docType]: null })
    setDocumentPreviews({ ...documentPreviews, [docType]: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('homigo_token')
      
      // Update profile
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: profileData.fullName,
          phone: profileData.phone,
          business_name: profileData.businessName,
          tin_number: profileData.tinNumber,
          business_address: profileData.businessAddress,
          residential_address: profileData.residentialAddress,
          emergency_contact: profileData.emergencyContact,
          valid_id_type: profileData.validIdType,
          valid_id_number: profileData.validIdNumber,
          bank_name: profileData.bankName,
          bank_account_number: profileData.bankAccountNumber,
          bank_account_name: profileData.bankAccountName
        })
      })

      const data = await response.json()

      if (data.success) {
        // Upload documents if any (optional - don't fail if this errors)
        if (documents.validId || documents.businessPermit || documents.bankStatement) {
          try {
            await uploadDocuments()
          } catch (docError) {
            console.warn('Document upload failed (non-critical):', docError)
            // Continue anyway - documents are optional
          }
        }

        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      } else {
        alert('Failed to update profile: ' + data.message)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const uploadDocuments = async () => {
    setUploadingDoc(true)
    try {
      const token = localStorage.getItem('homigo_token')
      
      for (const [docType, preview] of Object.entries(documentPreviews)) {
        if (preview) {
          await fetch(`${API_URL}/upload/verification-document`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              base64Image: preview,
              documentType: docType
            })
          })
        }
      }
    } catch (error) {
      console.error('Error uploading documents:', error)
    } finally {
      setUploadingDoc(false)
    }
  }

  return (
    <DashboardLayout userType="landlord">
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
                <p className="font-bold">Settings Saved Successfully!</p>
                <p className="text-sm">Your changes have been updated.</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Information */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Profile Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="input-field pl-10"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    className="input-field pl-10 bg-gray-100"
                    value={profileData.email}
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    className="input-field pl-10"
                    placeholder="+63 912 345 6789"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    className="input-field pl-10"
                    placeholder="+63 912 345 6789"
                    value={profileData.emergencyContact}
                    onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Residential Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    className="input-field pl-10 min-h-[80px]"
                    placeholder="Enter your residential address"
                    value={profileData.residentialAddress}
                    onChange={(e) => setProfileData({ ...profileData, residentialAddress: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary-600" />
              Business Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="e.g., Santos Properties"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  TIN Number
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="000-000-000-000"
                    value={profileData.tinNumber}
                    onChange={(e) => setProfileData({ ...profileData, tinNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    className="input-field pl-10 min-h-[80px]"
                    placeholder="Enter your business address"
                    value={profileData.businessAddress}
                    onChange={(e) => setProfileData({ ...profileData, businessAddress: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Valid ID Information */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary-600" />
              Valid ID Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Type
                </label>
                <select
                  className="input-field"
                  value={profileData.validIdType}
                  onChange={(e) => setProfileData({ ...profileData, validIdType: e.target.value })}
                >
                  <option value="">Select ID Type</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="voters_id">Voter's ID</option>
                  <option value="sss_id">SSS ID</option>
                  <option value="philhealth_id">PhilHealth ID</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter ID number"
                  value={profileData.validIdNumber}
                  onChange={(e) => setProfileData({ ...profileData, validIdNumber: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Bank Account Information */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary-600" />
              Bank Account Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., BDO, BPI, Metrobank"
                  value={profileData.bankName}
                  onChange={(e) => setProfileData({ ...profileData, bankName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter account number"
                  value={profileData.bankAccountNumber}
                  onChange={(e) => setProfileData({ ...profileData, bankAccountNumber: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Name as it appears on bank account"
                  value={profileData.bankAccountName}
                  onChange={(e) => setProfileData({ ...profileData, bankAccountName: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Verification Documents */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary-600" />
              Verification Documents
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload clear copies of your documents for verification purposes
            </p>
            
            <div className="space-y-4">
              {/* Valid ID Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valid ID (Front and Back)
                </label>
                {documentPreviews.validId ? (
                  <div className="relative">
                    <img src={documentPreviews.validId} alt="Valid ID" className="w-full h-48 object-cover rounded-lg border-2 border-gray-300" />
                    <button
                      type="button"
                      onClick={() => removeDocument('validId')}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload Valid ID</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'validId')}
                    />
                  </label>
                )}
              </div>

              {/* Business Permit Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Permit (Optional)
                </label>
                {documentPreviews.businessPermit ? (
                  <div className="relative">
                    <img src={documentPreviews.businessPermit} alt="Business Permit" className="w-full h-48 object-cover rounded-lg border-2 border-gray-300" />
                    <button
                      type="button"
                      onClick={() => removeDocument('businessPermit')}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload Business Permit</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'businessPermit')}
                    />
                  </label>
                )}
              </div>

              {/* Bank Statement Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bank Statement (Optional)
                </label>
                {documentPreviews.bankStatement ? (
                  <div className="relative">
                    <img src={documentPreviews.bankStatement} alt="Bank Statement" className="w-full h-48 object-cover rounded-lg border-2 border-gray-300" />
                    <button
                      type="button"
                      onClick={() => removeDocument('bankStatement')}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload Bank Statement</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, 'bankStatement')}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
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
                <input type="checkbox" className="w-5 h-5 text-secondary-500 rounded" defaultChecked />
                <span className="text-gray-700">Email notifications for new inquiries</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-secondary-500 rounded" defaultChecked />
                <span className="text-gray-700">SMS notifications for urgent messages</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-secondary-500 rounded" />
                <span className="text-gray-700">Weekly property performance reports</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 text-secondary-500 rounded" defaultChecked />
                <span className="text-gray-700">Marketing tips and updates</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || uploadingDoc}
              className="btn-secondary flex items-center space-x-2 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>
                {loading ? 'Saving...' : uploadingDoc ? 'Uploading Documents...' : 'Save Changes'}
              </span>
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
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-green-900">Premium Landlord</h3>
                    <p className="text-green-700">Active subscription</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-900">₱199</p>
                    <p className="text-sm text-green-700">per month</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-green-800">
                  <p>✓ Unlimited property listings</p>
                  <p>✓ Featured listings</p>
                  <p>✓ Priority support</p>
                  <p>✓ Advanced analytics</p>
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
                <p className="text-gray-600 mb-4">Limited to 3 property listings</p>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• Up to 3 property listings</p>
                  <p>• Basic support</p>
                  <p>• Standard features</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/upgrade')}
                className="w-full px-4 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-lg hover:from-secondary-600 hover:to-secondary-700 transition font-semibold"
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
                    <li>• Unlimited property listings</li>
                    <li>• Featured listings (top placement)</li>
                    <li>• Priority support</li>
                    <li>• Advanced analytics & insights</li>
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

export default LandlordSettings
