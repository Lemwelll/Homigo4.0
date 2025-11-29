import { supabase } from '../config/database.js';

class SearchHistoryService {
  // Save search to history
  async saveSearch(userId, searchQuery, searchType = 'property', filters = {}, resultsCount = 0) {
    const { data, error } = await supabase
      .from('search_history')
      .insert({
        user_id: userId,
        search_query: searchQuery.trim(),
        search_type: searchType,
        filters: filters,
        results_count: resultsCount
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user's search history
  async getUserSearchHistory(userId, limit = 10) {
    const { data, error} = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Get recent unique searches
  async getRecentUniqueSearches(userId, limit = 5) {
    const { data, error } = await supabase
      .from('search_history')
      .select('search_query, search_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20); // Get more to filter duplicates

    if (error) throw error;

    // Remove duplicates
    const unique = [];
    const seen = new Set();

    for (const item of data || []) {
      const key = `${item.search_query}-${item.search_type}`;
      if (!seen.has(key) && unique.length < limit) {
        seen.add(key);
        unique.push(item);
      }
    }

    return unique;
  }

  // Get popular searches (across all users)
  async getPopularSearches(limit = 10) {
    const { data, error } = await supabase
      .from('search_history')
      .select('search_query, search_type')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Count occurrences
    const counts = {};
    (data || []).forEach(item => {
      const key = item.search_query.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    });

    // Sort by count and return top results
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([query, count]) => ({ search_query: query, count }));
  }

  // Clear user's search history
  async clearUserHistory(userId) {
    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return { success: true };
  }
}

export default new SearchHistoryService();
