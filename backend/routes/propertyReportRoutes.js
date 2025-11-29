import express from 'express';
import propertyReportController from '../controllers/propertyReportController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User routes (students can report properties)
router.post('/', propertyReportController.createReport);
router.get('/my-reports', propertyReportController.getUserReports);

// Admin routes
router.get('/', isAdmin, propertyReportController.getAllReports);
router.get('/stats', isAdmin, propertyReportController.getReportStats);
router.get('/:id', isAdmin, propertyReportController.getReportById);
router.post('/:id/resolve', isAdmin, propertyReportController.resolveReport);
router.post('/:id/dismiss', isAdmin, propertyReportController.dismissReport);
router.delete('/:id', isAdmin, propertyReportController.deleteReport);

export default router;
