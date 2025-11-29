import express from 'express';
import searchHistoryController from '../controllers/searchHistoryController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.post('/', authenticate, searchHistoryController.saveSearch);
router.get('/', authenticate, searchHistoryController.getSearchHistory);
router.get('/recent', authenticate, searchHistoryController.getRecentSearches);
router.delete('/', authenticate, searchHistoryController.clearHistory);

export default router;
