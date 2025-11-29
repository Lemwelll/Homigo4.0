import express from 'express';
import preferencesController from '../controllers/preferencesController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.get('/', authenticate, preferencesController.getPreferences);
router.put('/', authenticate, preferencesController.updatePreferences);

export default router;
