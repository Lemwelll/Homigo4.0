import React, { useState } from 'react'
import { Star, ThumbsUp, MessageSquare, Calendar } from 'lucide-react'

const ReviewCard = ({ review, onAddResponse, isLandlord = false }) => {
  const [showResponseForm, setShowResponseForm] = useState(false)
  const [response, setResponse] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const handleSubmitResponse = async () => {
    if (!response.trim()) return
    
    setSubmitting(true)
    try {
      await onAddResponse(review.id, response)
      setResponse('')
      setShowResponseForm(false)
    } catch (error) {
      console.error('Error submitting response:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-bold text-lg">
              {review.reviewer_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{review.reviewer_name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(review.created_at)}</span>
              {review.is_verified && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  Verified Stay
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h5 className="font-semibold text-gray-800 mb-2">{review.title}</h5>
      )}

      {/* Comment */}
      <p className="text-gray-700 mb-4">{review.comment}</p>

      {/* Detailed Ratings */}
      {(review.cleanliness_rating || review.location_rating || review.value_rating) && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          {review.cleanliness_rating && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Cleanliness</p>
              <div className="flex items-center space-x-1">
                {renderStars(review.cleanliness_rating)}
              </div>
            </div>
          )}
          {review.location_rating && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Location</p>
              <div className="flex items-center space-x-1">
                {renderStars(review.location_rating)}
              </div>
            </div>
          )}
          {review.value_rating && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Value</p>
              <div className="flex items-center space-x-1">
                {renderStars(review.value_rating)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Landlord Response */}
      {review.landlord_response && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-900">Landlord Response</span>
            <span className="text-xs text-blue-600">
              {formatDate(review.landlord_response_at)}
            </span>
          </div>
          <p className="text-blue-900">{review.landlord_response}</p>
        </div>
      )}

      {/* Landlord Response Form */}
      {isLandlord && !review.landlord_response && (
        <div className="mt-4">
          {!showResponseForm ? (
            <button
              onClick={() => setShowResponseForm(true)}
              className="text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Respond to this review</span>
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                className="input-field min-h-[100px]"
                placeholder="Write your response..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmitResponse}
                  disabled={submitting || !response.trim()}
                  className="btn-primary text-sm disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Response'}
                </button>
                <button
                  onClick={() => {
                    setShowResponseForm(false)
                    setResponse('')
                  }}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">Helpful ({review.helpful_count || 0})</span>
        </button>
      </div>
    </div>
  )
}

export default ReviewCard
