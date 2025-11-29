# Missing Backend Integration - Complete Analysis

## 🔍 Analysis Date: November 28, 2025

This document lists ALL features that are currently frontend-only and need backend/database integration to be fully functional.

---

## ❌ MISSING BACKEND INTEGRATION

### 1. SUBSCRIPTION SYSTEM (CRITICAL)
**Status:** Frontend only - No backend persistence

**What's Missing:**
- Database table: `subscriptions` or add `subscription_tier` column to `users` table
- Backend API endpoints for subscription management
- Payment gateway integration (PayMongo, Stripe, etc.)
- Subscription status persistence across sessions

**Files Affected:**
- `src/context/AccountTierContext.jsx` - Only stores in React state
- `src/pages/UpgradePremium.jsx` - Payment is simulated
- `src/pages/StudentSettings.jsx` - Cancel subscription not persisted
- `src/pages/LandlordSettings.jsx` - Cancel subscription not persisted

**Backend Needed:**
```sql
-- Add to users table
ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'free';
ALTER TABLE users ADD COLUMN subscription_start_date TIMESTAMP;
ALTER TABLE users ADD COLUMN subscription_end_date TIMESTAMP;
```

**API Endpoints Needed:**
- `POST /api/subscriptions/upgrade` - Process payment and upgrade
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions/status` - Get current subscription status
- `POST /api/subscriptions/webhook` - Handle payment gateway webhooks

---

### 2. LANDMARKS MAP DATA (MEDIUM PRIORITY)
**Status:** Frontend only - Mock data

**What's Missing:**
- Database table for landmarks/services
- Backend API to fetch nearby services
- Integration with Google Places API or similar
- User-submitted landmarks

**Files Affected:**
- `src/pages/LandmarksMap.jsx` - Uses hardcoded mock data

**Backend Needed:**
```sql
CREATE TABLE landmarks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'laundry', 'printing', 'other'
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**API Endpoints Needed:**
- `GET /api/landmarks` - Get all landmarks
- `GET /api/landmarks/nearby?lat=X&lng=Y&type=laundry` - Get nearby landmarks
- `POST /api/landmarks` - Add new landmark (admin only)

---

### 3. STUDENT PROFILE UPDATE (PARTIALLY MISSING)
**Status:** Frontend updates local state only

**What's Missing:**
- Backend API to persist student profile changes
- Profile photo upload to Supabase storage
- University verification

**Files Affected:**
- `src/pages/StudentSettings.jsx` - updateProfile() only updates context
- `src/context/StudentContext.jsx` - No API call for profile update

**Backend Needed:**
**API Endpoints Needed:**
- `PUT /api/students/profile` - Update student profile
- `POST /api/students/profile/photo` - Upload profile photo
- Already exists: `GET /api/auth/profile` ✅

---

### 4. LANDLORD PROFILE UPDATE (PARTIALLY IMPLEMENTED)
**Status:** Has backend but may need completion

**What's Missing:**
- Document upload verification status tracking
- Bank account verification
- TIN number validation

**Files Affected:**
- `src/pages/LandlordSettings.jsx` - Has API calls but may need enhancement

**Backend Check Needed:**
- Verify `PUT /api/landlords/profile` is fully implemented
- Verify document upload endpoints work
- Check if verification workflow is complete

---

### 5. ACTIVITY TRACKING (PARTIALLY IMPLEMENTED)
**Status:** View tracking works, but analytics may be incomplete

**What's Missing:**
- Advanced analytics dashboard data
- Export analytics reports
- Date range filtering on backend

**Files Affected:**
- `src/context/ActivityContext.jsx` - May need more API endpoints
- `src/pages/LandlordDashboard.jsx` - Analytics data
- `src/pages/StudentDashboard.jsx` - Activity stats

**Backend Check Needed:**
- Verify analytics aggregation queries
- Check if all activity types are tracked
- Verify date range filtering works

---

### 6. ADMIN REPORTS (PARTIALLY IMPLEMENTED)
**Status:** Basic reports work, advanced reports may be missing

**What's Missing:**
- Revenue reports
- User growth analytics
- Property performance metrics
- Export to CSV/PDF

**Files Affected:**
- `src/pages/AdminReports.jsx` - May have mock data

**Backend Needed:**
**API Endpoints Needed:**
- `GET /api/admin/reports/revenue` - Revenue analytics
- `GET /api/admin/reports/users` - User growth stats
- `GET /api/admin/reports/properties` - Property metrics
- `GET /api/admin/reports/export` - Export reports

---

### 7. NOTIFICATION PREFERENCES (MISSING)
**Status:** Notifications work but preferences not saved

**What's Missing:**
- User notification preferences (email, push, in-app)
- Notification settings persistence
- Email notification templates

**Files Affected:**
- `src/pages/StudentSettings.jsx` - No notification preferences section
- `src/pages/LandlordSettings.jsx` - No notification preferences section

**Backend Needed:**
```sql
CREATE TABLE notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  reservation_updates BOOLEAN DEFAULT true,
  message_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**API Endpoints Needed:**
- `GET /api/notifications/preferences` - Get user preferences
- `PUT /api/notifications/preferences` - Update preferences

---

### 8. SEARCH HISTORY (MISSING)
**Status:** Search works but history not saved

**What's Missing:**
- Save user search queries
- Recent searches display
- Popular searches analytics

**Files Affected:**
- `src/pages/StudentBrowse.jsx` - Search not saved
- `src/pages/PublicListings.jsx` - Search not saved

**Backend Needed:**
```sql
CREATE TABLE search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  search_query TEXT,
  filters JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**API Endpoints Needed:**
- `POST /api/search/history` - Save search
- `GET /api/search/history` - Get user's search history
- `GET /api/search/popular` - Get popular searches

---

### 9. PROPERTY REVIEWS/RATINGS (COMPLETELY MISSING)
**Status:** Not implemented

**What's Missing:**
- Property review system
- Star ratings
- Review moderation
- Average rating calculation

**Backend Needed:**
```sql
CREATE TABLE property_reviews (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  student_id INTEGER REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**API Endpoints Needed:**
- `POST /api/properties/:id/reviews` - Add review
- `GET /api/properties/:id/reviews` - Get property reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

---

### 10. LANDLORD VERIFICATION WORKFLOW (PARTIALLY IMPLEMENTED)
**Status:** Documents can be uploaded but workflow may be incomplete

**What's Missing:**
- Admin approval/rejection workflow
- Verification status notifications
- Document expiry tracking
- Re-verification reminders

**Backend Check Needed:**
- Verify admin can approve/reject documents
- Check if notifications are sent on status change
- Verify document storage is working

---

### 11. PAYMENT HISTORY (MISSING)
**Status:** Payments work but history not displayed

**What's Missing:**
- Payment transaction history
- Receipt generation
- Payment method management
- Refund tracking

**Backend Needed:**
```sql
CREATE TABLE payment_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10, 2),
  payment_type VARCHAR(50), -- 'subscription', 'booking', 'reservation'
  payment_method VARCHAR(50), -- 'card', 'gcash'
  status VARCHAR(50), -- 'pending', 'completed', 'failed', 'refunded'
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**API Endpoints Needed:**
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:id/receipt` - Get receipt
- `POST /api/payments/refund` - Request refund

---

### 12. CHAT/MESSAGING REAL-TIME (PARTIALLY IMPLEMENTED)
**Status:** Messages work but may not be real-time

**What's Missing:**
- WebSocket/Socket.io for real-time messaging
- Online/offline status
- Typing indicators
- Read receipts
- Message attachments

**Backend Check Needed:**
- Verify if real-time updates work
- Check if message delivery is reliable
- Test with multiple users

---

## ✅ ALREADY IMPLEMENTED (Working with Backend)

1. **Authentication** ✅
   - Login, Register, Logout
   - JWT tokens
   - Password hashing

2. **Properties** ✅
   - CRUD operations
   - Image upload
   - Verification status
   - Search and filters

3. **Reservations** ✅
   - Create, Read, Update, Delete
   - Status management
   - Expiry tracking

4. **Bookings** ✅
   - Create bookings
   - Status tracking
   - Landlord/Student views

5. **Favorites** ✅
   - Add/Remove favorites
   - List user favorites
   - Limit enforcement

6. **Messages** ✅
   - Send/Receive messages
   - Conversation threads
   - User-to-user messaging

7. **Notifications** ✅
   - Create notifications
   - Mark as read
   - Fetch user notifications

8. **Escrow** ✅
   - Escrow account management
   - Payment tracking
   - Release/Refund

9. **Admin Panel** ✅
   - User management
   - Property verification
   - Dashboard analytics

10. **Activity Tracking** ✅
    - Property views
    - User actions
    - Analytics data

---

## 📊 PRIORITY RANKING

### 🔴 CRITICAL (Must Have for Production):
1. **Subscription System Backend** - Users can't maintain premium status
2. **Payment History** - Required for financial tracking
3. **Student Profile Update API** - Users can't save profile changes

### 🟡 HIGH (Important for Full Functionality):
4. **Landlord Verification Workflow** - Complete the approval process
5. **Notification Preferences** - Users need control over notifications
6. **Property Reviews/Ratings** - Important for trust and quality

### 🟢 MEDIUM (Nice to Have):
7. **Landmarks Map Data** - Currently works with mock data
8. **Search History** - Improves user experience
9. **Admin Reports Enhancement** - Better analytics

### 🔵 LOW (Future Enhancement):
10. **Real-time Chat** - Current messaging works, real-time is bonus
11. **Payment Method Management** - Can be added later
12. **Document Expiry Tracking** - Administrative convenience

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Critical Backend (Week 1)
1. Add `subscription_tier` column to users table
2. Create subscription API endpoints
3. Implement student profile update API
4. Add payment transaction history table and APIs

### Phase 2: Complete Existing Features (Week 2)
5. Complete landlord verification workflow
6. Add notification preferences
7. Implement property reviews system

### Phase 3: Enhancements (Week 3)
8. Add landmarks database and API
9. Implement search history
10. Enhance admin reports

### Phase 4: Polish (Week 4)
11. Add real-time messaging
12. Payment method management
13. Advanced analytics

---

## 📝 SUMMARY

**Total Features Analyzed:** 22
**Fully Implemented:** 10 (45%)
**Partially Implemented:** 4 (18%)
**Missing Backend:** 8 (37%)

**Critical Missing:** 3 features
**High Priority Missing:** 3 features
**Medium Priority Missing:** 3 features
**Low Priority Missing:** 3 features

The system is **functional** but needs backend integration for:
- Subscription persistence
- Profile updates
- Payment history
- Reviews/ratings
- Preferences
- Advanced features

**Current State:** MVP is working, but production-ready requires Phase 1 & 2 completion.
