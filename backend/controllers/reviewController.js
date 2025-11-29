import reviewService from '../services/reviewService.js';

class ReviewController {
  // Get all reviews for a property
  async getPropertyReviews(req, res) {
    try {
      const { propertyId } = req.params;
      console.log('🔍 GET /reviews/property/' + propertyId);
      
      const reviews = await reviewService.getPropertyReviews(propertyId);
      const stats = await reviewService.getPropertyReviewStats(propertyId);

      console.log('📊 Sending response:', { reviewCount: reviews.length, stats });

      res.json({
        success: true,
        data: {
          reviews,
          stats
        }
      });
    } catch (error) {
      console.error('❌ Error fetching property reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews',
        error: error.message
      });
    }
  }

  // Create a new review
  async createReview(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const { propertyId } = req.params;
      const {
        bookingId,
        rating,
        title,
        comment,
        cleanlinessRating,
        locationRating,
        valueRating
      } = req.body;

      // Validation
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const review = await reviewService.createReview({
        propertyId,
        userId,
        bookingId,
        rating,
        title,
        comment,
        cleanlinessRating,
        locationRating,
        valueRating
      });

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review
      });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create review'
      });
    }
  }

  // Update a review
  async updateReview(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const { reviewId } = req.params;
      const updateData = req.body;

      const review = await reviewService.updateReview(reviewId, userId, updateData);

      res.json({
        success: true,
        message: 'Review updated successfully',
        data: review
      });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update review'
      });
    }
  }

  // Delete a review
  async deleteReview(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const { reviewId } = req.params;

      await reviewService.deleteReview(reviewId, userId);

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete review'
      });
    }
  }

  // Add landlord response
  async addLandlordResponse(req, res) {
    try {
      const landlordId = req.user.userId || req.user.id;
      const { reviewId } = req.params;
      const { response } = req.body;

      if (!response || response.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Response cannot be empty'
        });
      }

      const review = await reviewService.addLandlordResponse(reviewId, landlordId, response);

      res.json({
        success: true,
        message: 'Response added successfully',
        data: review
      });
    } catch (error) {
      console.error('Error adding landlord response:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to add response'
      });
    }
  }

  // Mark review as helpful
  async markHelpful(req, res) {
    try {
      const { reviewId } = req.params;
      const review = await reviewService.markHelpful(reviewId);

      res.json({
        success: true,
        message: 'Review marked as helpful',
        data: review
      });
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark review as helpful'
      });
    }
  }

  // Get user's reviews
  async getUserReviews(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const reviews = await reviewService.getUserReviews(userId);

      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews'
      });
    }
  }
}

export default new ReviewController();
