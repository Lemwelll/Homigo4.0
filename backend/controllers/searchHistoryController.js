import searchHistoryService from '../services/searchHistoryService.js';

class SearchHistoryController {
  async saveSearch(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const { search_query, search_type, filters, results_count } = req.body;

      if (!search_query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const search = await searchHistoryService.saveSearch(
        userId,
        search_query,
        search_type || 'property',
        filters || {},
        results_count || 0
      );

      res.status(201).json({
        success: true,
        data: search
      });
    } catch (error) {
      console.error('Error saving search:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save search'
      });
    }
  }

  async getSearchHistory(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const limit = parseInt(req.query.limit) || 10;

      const history = await searchHistoryService.getUserSearchHistory(userId, limit);

      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error fetching search history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch search history'
      });
    }
  }

  async getRecentSearches(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const limit = parseInt(req.query.limit) || 5;

      const searches = await searchHistoryService.getRecentUniqueSearches(userId, limit);

      res.json({
        success: true,
        data: searches
      });
    } catch (error) {
      console.error('Error fetching recent searches:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recent searches'
      });
    }
  }

  async clearHistory(req, res) {
    try {
      const userId = req.user.userId || req.user.id;

      await searchHistoryService.clearUserHistory(userId);

      res.json({
        success: true,
        message: 'Search history cleared'
      });
    } catch (error) {
      console.error('Error clearing search history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear search history'
      });
    }
  }
}

export default new SearchHistoryController();
