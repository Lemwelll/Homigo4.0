import { Shield, Lock, CheckCircle } from 'lucide-react'

const EscrowInfoCard = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-blue-900">Escrow Protected Payment</h3>
          <p className="text-sm text-blue-700">Your money is safe with us</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
            <p className="text-xs text-blue-700">
              Your payment will be securely held until the landlord approves your booking
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Money-Back Guarantee</p>
            <p className="text-xs text-blue-700">
              Full refund if the landlord rejects your booking request
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Protected Transaction</p>
            <p className="text-xs text-blue-700">
              Payment released to landlord only after confirmation
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-blue-600 text-center">
          🔒 Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  )
}

export default EscrowInfoCard
