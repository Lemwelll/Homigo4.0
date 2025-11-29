import express from 'express';
import landmarkController from '../controllers/landmarkController.js';

const router = express.Router();

router.get('/', landmarkController.getLandmarks);
router.get('/nearby', landmarkController.getNearbyLandmarks);

export default router;
