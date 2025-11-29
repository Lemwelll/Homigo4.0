import landmarkService from '../services/landmarkService.js';

class LandmarkController {
  async getLandmarks(req, res) {
    try {
      const { type, city } = req.query;
      const landmarks = await landmarkService.getAllLandmarks({ type, city });

      res.json({
        success: true,
        data: landmarks
      });
    } catch (error) {
      console.error('Error fetching landmarks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch landmarks'
      });
    }
  }

  async getNearbyLandmarks(req, res) {
    try {
      const { latitude, longitude, radius } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude are required'
        });
      }

      const landmarks = await landmarkService.getNearbyLandmarks(
        parseFloat(latitude),
        parseFloat(longitude),
        radius ? parseFloat(radius) : 5
      );

      res.json({
        success: true,
        data: landmarks
      });
    } catch (error) {
      console.error('Error fetching nearby landmarks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch nearby landmarks'
      });
    }
  }
}

export default new LandmarkController();
