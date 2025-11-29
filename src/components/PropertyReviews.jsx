import React, { useState, useEffect } from 'react'
import { Star, TrendingUp } from 'lucide-react'
import ReviewCard from './ReviewCard'
import WriteReviewModal from './WriteReviewModal'

const API_URL = 'http://localhost:5000'

const PropertyReviews = ({ propertyId, userRole, canReview = false }) => {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showWriteReview, setShowWriteReview] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [propertyId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/property/${propertyId}`)
      const data = await response.json()
      
      if (data.success) {
        setReviews(data.data.reviews)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (reviewData) => {
    try {
      const token = localStorage.getItem('homigo_token')
      const response = await fetch(`${API_URL}/reviews/property/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchReviews()
        return true
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      throw error
    }
  }

  const handleAddResponse = async (reviewId, response) => {
    try {
      const token = localStorage.getItem('homigo_token')
      const res = await fetch(`${API_URL}/reviews/${reviewId}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ response })
      })

      const data = await res.json()
      
      if (data.success) {
        await fetchReviews()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error adding response:', error)
      throw error
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const totalReviews = parseInt(stats?.total_reviews || 0)
  const avgRating = parseFloat(stats?.average_rating || 0)

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reviews & Ratings</h2>
            <p className="text-gray-600">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
          {canReview && (
            <button
              onClick={() => setShowWriteReview(true)}
              className="btn-primary"
            >
              Write a Review
            </button>
          )}
        </div>

        {totalReviews > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900">
                  {avgRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center mt-2">
                  {renderStars(avgRating)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = parseInt(stats?.[`${['five', 'four', 'three', 'two', 'one'][5 - star]}_star`] || 0)
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                return (
                  <div key={star} className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 w-12">{star} star</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Detailed Ratings */}
        {totalReviews > 0 && stats?.avg_cleanliness && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Detailed Ratings</h3>
            <div className="grid grid-cols-3 gap-4">
              {stats.avg_cleanliness && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Cleanliness</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {parseFloat(stats.avg_cleanliness).toFixed(1)}
                  </p>
                  <div className="flex items-center justify-center mt-1">
                    {renderStars(stats.avg_cleanliness)}
                  </div>
                </div>
              )}
              {stats.avg_location && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {parseFloat(stats.avg_location).toFixed(1)}
                  </p>
                  <div className="flex items-center justify-center mt-1">
                    {renderStars(stats.avg_location)}
                  </div>
                </div>
              )}
              {stats.avg_value && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {parseFloat(stats.avg_value).toFixed(1)}
                  </p>
                  <div className="flex items-center justify-center mt-1">
                    {renderStars(stats.avg_value)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {totalReviews === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600">Be the first to review this property!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onAddResponse={handleAddResponse}
              isLandlord={userRole === 'landlord'}
            />
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {showWriteReview && (
        <WriteReviewModal
          property={{ id: propertyId, title: 'Property' }}
          onClose={() => setShowWriteReview(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  )
}

export default PropertyReviews
