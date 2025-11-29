import express from 'express';
import reviewController from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/property/:propertyId', reviewController.getPropertyReviews);

// Protected routes (require authentication)
router.post('/property/:propertyId', authenticate, reviewController.createReview);
router.put('/:reviewId', authenticate, reviewController.updateReview);
router.delete('/:reviewId', authenticate, reviewController.deleteReview);
router.post('/:reviewId/response', authenticate, reviewController.addLandlordResponse);
router.post('/:reviewId/helpful', reviewController.markHelpful);
router.get('/my-reviews', authenticate, reviewController.getUserReviews);

export default router;
