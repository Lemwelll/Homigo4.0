import React, { useState } from 'react'
import { X, Star } from 'lucide-react'

const WriteReviewModal = ({ property, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [cleanlinessRating, setCleanlinessRating] = useState(0)
  const [locationRating, setLocationRating] = useState(0)
  const [valueRating, setValueRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    if (!comment.trim()) {
      alert('Please write a review')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({
        rating,
        title,
        comment,
        cleanlinessRating: cleanlinessRating || null,
        locationRating: locationRating || null,
        valueRating: valueRating || null
      })
      onClose()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating = ({ value, onChange, label }) => {
    const [hover, setHover] = useState(0)

    return (
      <div>
        {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hover || value)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {value > 0 ? `${value} star${value > 1 ? 's' : ''}` : 'Select rating'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <p className="text-gray-600 mt-1">{property.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Overall Rating */}
          <div>
            <StarRating
              value={rating}
              onChange={setRating}
              label="Overall Rating *"
            />
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Review Title (Optional)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Summarize your experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              className="input-field min-h-[150px]"
              placeholder="Share your experience with this property..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Detailed Ratings */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Detailed Ratings (Optional)</h3>
            <div className="space-y-4">
              <StarRating
                value={cleanlinessRating}
                onChange={setCleanlinessRating}
                label="Cleanliness"
              />
              <StarRating
                value={locationRating}
                onChange={setLocationRating}
                label="Location"
              />
              <StarRating
                value={valueRating}
                onChange={setValueRating}
                label="Value for Money"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={submitting || rating === 0 || !comment.trim()}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteReviewModal
