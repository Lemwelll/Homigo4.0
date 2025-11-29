# 🎯 REMAINING FEATURES - IMPLEMENTATION PLAN

## Overview

You have 6 remaining features to implement:

**MEDIUM Priority:**
7. Landmarks Map Data - Using mock data
8. Search History - Not saved
9. Admin Reports - May need enhancement

**LOW Priority:**
10. Real-time Chat - Works but not real-time
11. Payment Method Management - Missing
12. Document Expiry Tracking - Missing

---

## Current Status Summary

### ✅ COMPLETED (High Priority):
1. ✅ Landlord Verification Workflow
2. ✅ Notification Preferences  
3. ⚠️ Property Reviews (90% - display issue)
4. ✅ Message/Reservation Notifications (BONUS)

### 🔵 TO IMPLEMENT (Medium + Low Priority): 6 features

---

## 📋 IMPLEMENTATION ROADMAP

### Feature #7: Landmarks Map Data (MEDIUM)
**Current:** Using mock data in frontend
**Goal:** Store landmarks in database, fetch from backend

**Implementation Steps:**
1. Create `landmarks` table in database
2. Create backend API endpoints
3. Update frontend to fetch from API
4. Seed database with real landmark data

**Estimated Time:** 2-3 hours

---

### Feature #8: Search History (MEDIUM)
**Current:** Not saved
**Goal:** Save user searches, show recent searches

**Implementation Steps:**
1. Create `search_history` table
2. Create backend API to save/fetch searches
3. Update frontend to save searches
4. Display recent searches in browse page

**Estimated Time:** 1-2 hours

---

### Feature #9: Admin Reports (MEDIUM)
**Current:** Basic implementation
**Goal:** Enhanced reports with charts and exports

**Implementation Steps:**
1. Add more report types (revenue, bookings, etc.)
2. Create backend aggregation queries
3. Add chart components (Chart.js or Recharts)
4. Add export functionality (CSV/PDF)

**Estimated Time:** 3-4 hours

---

### Feature #10: Real-time Chat (LOW)
**Current:** Works but requires refresh
**Goal:** Real-time updates using WebSockets

**Implementation Steps:**
1. Install Socket.io
2. Setup WebSocket server
3. Update message components
4. Add real-time message delivery

**Estimated Time:** 2-3 hours

---

### Feature #11: Payment Method Management (LOW)
**Current:** Missing
**Goal:** Users can save/manage payment methods

**Implementation Steps:**
1. Create `payment_methods` table
2. Create backend CRUD APIs
3. Create frontend payment methods page
4. Add card/GCash management UI

**Estimated Time:** 2-3 hours

---

### Feature #12: Document Expiry Tracking (LOW)
**Current:** Missing
**Goal:** Track and notify about expiring documents

**Implementation Steps:**
1. Add expiry dates to verification documents
2. Create backend job to check expiries
3. Send notifications for expiring docs
4. Add admin dashboard for expiry tracking

**Estimated Time:** 2-3 hours

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Quick Wins (4-5 hours)
1. **Search History** (easiest, high value)
2. **Landmarks Map Data** (straightforward database integration)

### Phase 2: Medium Complexity (6-8 hours)
3. **Admin Reports Enhancement**
4. **Payment Method Management**

### Phase 3: Advanced (4-6 hours)
5. **Real-time Chat** (requires WebSockets)
6. **Document Expiry Tracking** (requires background jobs)

---

## 📊 TOTAL ESTIMATED TIME

- **All 6 Features:** 14-18 hours
- **Medium Priority Only (3 features):** 6-9 hours
- **Quick Wins Only (2 features):** 4-5 hours

---

## 🚀 QUICK START: Feature #7 (Landmarks Map)

Since you asked to implement one by one, here's the complete implementation for Landmarks Map:

### Step 1: Database (5 minutes)

```sql
-- Create landmarks table
CREATE TABLE IF NOT EXISTS landmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('laundry', 'printing', 'convenience_store', 'restaurant', 'pharmacy', 'other')),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    phone TEXT,
    hours TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for location queries
CREATE INDEX idx_landmarks_type ON landmarks(type);
CREATE INDEX idx_landmarks_city ON landmarks(city);
CREATE INDEX idx_landmarks_active ON landmarks(is_active);

-- Seed with sample data
INSERT INTO landmarks (name, type, latitude, longitude, address, city, phone, hours) VALUES
('QuickWash Laundry', 'laundry', 14.6507, 121.0494, 'Katipunan Ave, QC', 'Quezon City', '+63 912 345 6789', '7AM-10PM'),
('Clean & Fresh', 'laundry', 14.6520, 121.0510, 'Aurora Blvd, QC', 'Quezon City', '+63 912 345 6790', '8AM-9PM'),
('Print Hub', 'printing', 14.6512, 121.0502, 'Magsaysay Ave, QC', 'Quezon City', '+63 912 345 6791', '24/7'),
('7-Eleven', 'convenience_store', 14.6515, 121.0505, 'Tomas Morato, QC', 'Quezon City', '+63 912 345 6792', '24/7');
```

### Step 2: Backend Service (10 minutes)

Create `backend/services/landmarkService.js`:
```javascript
import { supabase } from '../config/database.js';

class LandmarkService {
  async getAllLandmarks(filters = {}) {
    let query = supabase
      .from('landmarks')
      .select('*')
      .eq('is_active', true);

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data;
  }

  async getNearbyLandmarks(latitude, longitude, radiusKm = 5) {
    // Simple distance calculation (for production, use PostGIS)
    const { data, error } = await supabase
      .from('landmarks')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    // Filter by distance (simplified)
    return data.filter(landmark => {
      const distance = this.calculateDistance(
        latitude, longitude,
        landmark.latitude, landmark.longitude
      );
      return distance <= radiusKm;
    });
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export default new LandmarkService();
```

### Step 3: Backend Controller (5 minutes)

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

### Step 4: Backend Routes (3 minutes)

Create `backend/routes/landmarkRoutes.js`:
```javascript
import express from 'express';
import landmarkController from '../controllers/landmarkController.js';

const router = express.Router();

router.get('/', landmarkController.getLandmarks);
router.get('/nearby', landmarkController.getNearbyLandmarks);

export default router;
```

### Step 5: Add to server.js (2 minutes)

```javascript
import landmarkRoutes from './routes/landmarkRoutes.js';

// Add this with other routes
app.use('/landmarks', landmarkRoutes);
```

### Step 6: Update Frontend (10 minutes)

Update `src/pages/LandmarksMap.jsx`:
```javascript
// Replace mock data with API call
const [landmarks, setLandmarks] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchLandmarks();
}, [activeFilter]);

const fetchLandmarks = async () => {
  try {
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

---

## ✅ VERIFICATION CHECKLIST

After implementing each feature, verify:

- [ ] Database table created
- [ ] Backend service implemented
- [ ] Backend controller implemented
- [ ] Routes added to server
- [ ] Frontend fetches from API
- [ ] Data displays correctly
- [ ] No console errors
- [ ] Works for all user roles

---

## 📞 NEXT STEPS

1. **Implement Feature #7 (Landmarks)** using the guide above
2. **Test thoroughly**
3. **Move to Feature #8 (Search History)**
4. **Repeat for remaining features**

---

**Ready to start?** Let me know which feature you want me to implement first, and I'll create the complete code for frontend, backend, and database!
