/**
 * Admin Routes
 * Handles admin-specific operations
 */

import express from 'express';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';
import {
  getAllLandlords,
  getAllStudents,
  getPlatformStats,
  getDashboardAnalytics,
  verifyLandlord,
  suspendLandlord,
  getLandlordDocuments
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Get all landlords
router.get('/landlords', getAllLandlords);

// Get all students
router.get('/students', getAllStudents);

// Get platform statistics
router.get('/stats', getPlatformStats);

// Get dashboard analytics (comprehensive)
router.get('/dashboard', getDashboardAnalytics);

// Get landlord documents
router.get('/landlords/:landlordId/documents', getLandlordDocuments);

// Verify a landlord
router.post('/landlords/:landlordId/verify', verifyLandlord);

// Suspend a landlord
router.post('/landlords/:landlordId/suspend', suspendLandlord);

export default router;
