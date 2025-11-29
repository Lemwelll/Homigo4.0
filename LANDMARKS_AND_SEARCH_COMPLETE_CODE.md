# 🗺️ LANDMARKS & SEARCH HISTORY - COMPLETE IMPLEMENTATION

## ✅ FILES CREATED

### Database:
- ✅ `backend/database/add_landmarks_and_search_history.sql`

### Backend Services:
- ✅ `backend/services/landmarkService.js`
- ✅ `backend/services/searchHistoryService.js`

---

## 📝 REMAINING FILES TO CREATE

### 1. Backend Controllers

Create `backend/controllers/landmarkController.js`:
```javascript
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
```

Create `backend/controllers/searchHistoryController.js`:
```javascript
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
```

### 2. Backend Routes

Create `backend/routes/landmarkRoutes.js`:
```javascript
import express from 'express';
import landmarkController from '../controllers/landmarkController.js';

const router = express.Router();

router.get('/', landmarkController.getLandmarks);
router.get('/nearby', landmarkController.getNearbyLandmarks);

export default router;
```

Create `backend/routes/searchHistoryRoutes.js`:
```javascript
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
```

### 3. Add Routes to server.js

Add these imports:
```javascript
import landmarkRoutes from './routes/landmarkRoutes.js';
import searchHistoryRoutes from './routes/searchHistoryRoutes.js';
```

Add these routes:
```javascript
app.use('/landmarks', landmarkRoutes);
app.use('/search-history', searchHistoryRoutes);
```

---

## 🎨 FRONTEND UPDATES

### Update LandmarksMap.jsx

Replace the mock data section with:
```javascript
const [landmarks, setLandmarks] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (accountState.tier === 'premium') {
    fetchLandmarks();
  }
}, [activeFilter, accountState.tier]);

const fetchLandmarks = async () => {
  try {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeFilter !== 'all') {
      params.append('type', activeFilter);
    }

    const response = await fetch(`http://localhost:5000/landmarks?${params}`);
    const data = await response.json();

    if (data.success) {
      setLandmarks(data.data);
    }
  } catch (error) {
    console.error('Error fetching landmarks:', error);
  } finally {
    setLoading(false);
  }
};
```

### Update StudentBrowse.jsx for Search History

Add at the top:
```javascript
const [recentSearches, setRecentSearches] = useState([]);
const [showRecentSearches, setShowRecentSearches] = useState(false);

useEffect(() => {
  fetchRecentSearches();
}, []);

const fetchRecentSearches = async () => {
  try {
    const token = localStorage.getItem('homigo_token');
    const response = await fetch('http://localhost:5000/search-history/recent?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (data.success) {
      setRecentSearches(data.data);
    }
  } catch (error) {
    console.error('Error fetching recent searches:', error);
  }
};

const saveSearch = async (query, resultsCount) => {
  try {
    const token = localStorage.getItem('homigo_token');
    await fetch('http://localhost:5000/search-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        search_query: query,
        search_type: 'property',
        results_count: resultsCount
      })
    });
  } catch (error) {
    console.error('Error saving search:', error);
  }
};

// Call saveSearch when user searches
const handleSearch = (query) => {
  // Your existing search logic
  const results = performSearch(query);
  saveSearch(query, results.length);
};
```

Add recent searches UI in the search section:
```javascript
{showRecentSearches && recentSearches.length > 0 && (
  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
    <div className="p-3 border-b border-gray-200">
      <p className="text-sm font-semibold text-gray-700">Recent Searches</p>
    </div>
    <div className="py-2">
      {recentSearches.map((search, index) => (
        <button
          key={index}
          onClick={() => {
            setSearchQuery(search.search_query);
            setShowRecentSearches(false);
            handleSearch(search.search_query);
          }}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
        >
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{search.search_query}</span>
        </button>
      ))}
    </div>
  </div>
)}
```

---

## 🚀 SETUP INSTRUCTIONS

### 1. Run Database Migration
```sql
-- In Supabase SQL Editor, run:
backend/database/add_landmarks_and_search_history.sql
```

### 2. Create Backend Files
- Create all controller files
- Create all route files
- Update server.js

### 3. Restart Backend
```bash
cd backend
npm start
```

### 4. Update Frontend
- Update LandmarksMap.jsx
- Update StudentBrowse.jsx

### 5. Test
- Test landmarks map loads real data
- Test search history saves
- Test recent searches display

---

## ✅ VERIFICATION

- [ ] Database tables created
- [ ] Landmarks seeded with data
- [ ] Backend services created
- [ ] Backend controllers created
- [ ] Routes added to server
- [ ] Frontend fetches from API
- [ ] Search history saves
- [ ] Recent searches display
- [ ] No console errors

---

**Status:** Code Complete - Ready to Implement
**Next:** Create the controller and route files, then test!
