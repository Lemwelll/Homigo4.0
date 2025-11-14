import { Eye } from 'lucide-react'
import PaymentStatusBadge from './PaymentStatusBadge'

const EscrowTable = ({ transactions, onViewDetails, userType }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {userType === 'student' ? 'Landlord' : 'Student'}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={transaction.propertyImage}
                      alt={transaction.propertyTitle}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{transaction.propertyTitle}</p>
                      <p className="text-sm text-gray-500">{transaction.propertyId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900">
                    {userType === 'student' ? transaction.landlordName : transaction.studentName}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900 font-mono text-sm">{transaction.id}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900 font-semibold">₱{transaction.amount.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <PaymentStatusBadge status={transaction.status} />
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900">{transaction.date}</p>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails(transaction)}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex gap-3 mb-3">
              <img
                src={transaction.propertyImage}
                alt={transaction.propertyTitle}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{transaction.propertyTitle}</h3>
                <p className="text-sm text-gray-500 mb-2">{transaction.id}</p>
                <PaymentStatusBadge status={transaction.status} />
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{userType === 'student' ? 'Landlord' : 'Student'}:</span>
                <span className="font-medium text-gray-900">
                  {userType === 'student' ? transaction.landlordName : transaction.studentName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">₱{transaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900">{transaction.date}</span>
              </div>
            </div>
            <button
              onClick={() => onViewDetails(transaction)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-medium"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EscrowTable
