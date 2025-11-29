import preferencesService from '../services/preferencesService.js';

class PreferencesController {
  // Get user's notification preferences
  async getPreferences(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const preferences = await preferencesService.getPreferences(userId);

      res.json({
        success: true,
        data: preferences
      });
    } catch (error) {
      console.error('Error fetching preferences:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notification preferences',
        error: error.message
      });
    }
  }

  // Update user's notification preferences
  async updatePreferences(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const preferences = req.body;

      const updated = await preferencesService.updatePreferences(userId, preferences);

      res.json({
        success: true,
        message: 'Notification preferences updated successfully',
        data: updated
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update notification preferences',
        error: error.message
      });
    }
  }
}

export default new PreferencesController();
