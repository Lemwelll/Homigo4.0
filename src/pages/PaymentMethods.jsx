import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { CreditCard, Plus, Trash2, Check, X } from 'lucide-react'
import Toast from '../components/Toast'


const PaymentMethods = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState(null)
  const [newMethod, setNewMethod] = useState({
    methodType: 'card',
    methodName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    gcashNumber: '',
    isDefault: false
  })

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/payments/methods`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      setToast({ message: 'Failed to load payment methods', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddMethod = async () => {
    try {
      const methodData = {
        methodType: newMethod.methodType,
        methodName: newMethod.methodName || (newMethod.methodType === 'card' ? 'Credit/Debit Card' : 'GCash'),
        encryptedDetails: newMethod.methodType === 'card' 
          ? { last4: newMethod.cardNumber.slice(-4) }
          : { number: newMethod.gcashNumber },
        isDefault: newMethod.isDefault,
        expiresAt: newMethod.methodType === 'card' 
          ? `${newMethod.expiryYear}-${newMethod.expiryMonth}-01`
          : null
      }

      const response = await fetch(`${API_URL}/payments/methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(methodData)
      })

      if (response.ok) {
        setToast({ message: 'Payment method added successfully', type: 'success' })
        setShowAddModal(false)
        setNewMethod({
          methodType: 'card',
          methodName: '',
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          gcashNumber: '',
          isDefault: false
        })
        fetchPaymentMethods()
      } else {
        setToast({ message: 'Failed to add payment method', type: 'error' })
      }
    } catch (error) {
      console.error('Error adding payment method:', error)
      setToast({ message: 'Failed to add payment method', type: 'error' })
    }
  }

  const handleDeleteMethod = async (methodId) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return

    try {
      const response = await fetch(`${API_URL}/payments/methods/${methodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        setToast({ message: 'Payment method deleted', type: 'success' })
        fetchPaymentMethods()
      } else {
        setToast({ message: 'Failed to delete payment method', type: 'error' })
      }
    } catch (error) {
      console.error('Error deleting payment method:', error)
      setToast({ message: 'Failed to delete payment method', type: 'error' })
    }
  }

  const getMethodIcon = (type) => {
    return <CreditCard className="w-6 h-6" />
  }

  const formatExpiryDate = (expiresAt) => {
    if (!expiresAt) return 'No expiry'
    const date = new Date(expiresAt)
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }

  const userType = user?.role || 'student'

  return (
    <DashboardLayout userType={userType}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Methods</h1>
            <p className="text-gray-600">Manage your saved payment methods</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Payment Method</span>
          </button>
        </div>

        {loading ? (
          <div className="card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment methods...</p>
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="card text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Payment Methods</h3>
            <p className="text-gray-600 mb-6">Add a payment method to make transactions faster</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Method</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="card relative">
                {method.is_default && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Default</span>
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    {getMethodIcon(method.method_type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{method.method_name}</h3>
                    <p className="text-sm text-gray-600 capitalize mb-2">{method.method_type}</p>
                    
                    {method.expires_at && (
                      <p className="text-xs text-gray-500">
                        Expires: {formatExpiryDate(method.expires_at)}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-2">
                      Added {new Date(method.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex gap-2">
                  <button
                    onClick={() => handleDeleteMethod(method.id)}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Payment Method Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Payment Method</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <select
                    value={newMethod.methodType}
                    onChange={(e) => setNewMethod({ ...newMethod, methodType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="gcash">GCash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Method Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., My Visa Card"
                    value={newMethod.methodName}
                    onChange={(e) => setNewMethod({ ...newMethod, methodName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </div>

                {newMethod.methodType === 'card' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                        value={newMethod.cardNumber}
                        onChange={(e) => setNewMethod({ ...newMethod, cardNumber: e.target.value.replace(/\s/g, '') })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Month
                        </label>
                        <input
                          type="text"
                          placeholder="MM"
                          maxLength="2"
                          value={newMethod.expiryMonth}
                          onChange={(e) => setNewMethod({ ...newMethod, expiryMonth: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Year
                        </label>
                        <input
                          type="text"
                          placeholder="YYYY"
                          maxLength="4"
                          value={newMethod.expiryYear}
                          onChange={(e) => setNewMethod({ ...newMethod, expiryYear: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GCash Number
                    </label>
                    <input
                      type="text"
                      placeholder="09XX XXX XXXX"
                      maxLength="11"
                      value={newMethod.gcashNumber}
                      onChange={(e) => setNewMethod({ ...newMethod, gcashNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newMethod.isDefault}
                    onChange={(e) => setNewMethod({ ...newMethod, isDefault: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-700">
                    Set as default payment method
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMethod}
                  disabled={
                    (newMethod.methodType === 'card' && (!newMethod.cardNumber || !newMethod.expiryMonth || !newMethod.expiryYear)) ||
                    (newMethod.methodType === 'gcash' && !newMethod.gcashNumber)
                  }
                  className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add Method
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

export default PaymentMethods
