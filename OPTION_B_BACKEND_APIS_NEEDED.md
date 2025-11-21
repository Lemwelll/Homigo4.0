# Option B: Backend APIs That Need Implementation

## 🎯 Overview

This document lists all the backend APIs that need to be implemented to complete the system integration. These are organized by priority and feature area.

## ✅ Already Implemented

### Authentication APIs
- ✅ POST `/auth/register` - User registration
- ✅ POST `/auth/login` - User login
- ✅ GET `/auth/profile` - Get user profile
- ✅ PUT `/auth/profile` - Update user profile

### Property APIs
- ✅ GET `/properties/verified` - Get all verified properties (public)
- ✅ GET `/properties/my-properties` - Get landlord's properties
- ✅ GET `/properties/:id` - Get property by ID
- ✅ POST `/properties` - Create property (landlord)
- ✅ PUT `/properties/:id` - Update property (landlord)
- ✅ DELETE `/properties/:id` - Delete property (landlord)
- ✅ GET `/properties/admin/all` - Get all properties (admin)
- ✅ POST `/properties/admin/verify/:id` - Verify/reject property (admin)

### Upload APIs
- ✅ POST `/upload/base64` - Upload base64 image

## ❌ Need Implementation

### 1. Favorites APIs (Priority: HIGH)

#### GET `/favorites`
**Purpose:** Get student's favorite properties
**Auth:** Required (Student)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "property_id": "uuid",
      "property": { /* property details */ },
      "created_at": "timestamp"
    }
  ]
}
```

#### POST `/favorites`
**Purpose:** Add property to favorites
**Auth:** Required (Student)
**Body:**
```json
{
  "property_id": "uuid"
}
```

#### DELETE `/favorites/:propertyId`
**Purpose:** Remove property from favorites
**Auth:** Required (Student)

---

### 2. Reservations APIs (Priority: HIGH)

#### GET `/reservations/student`
**Purpose:** Get student's reservations
**Auth:** Required (Student)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "property_id": "uuid",
      "property": { /* property details */ },
      "status": "reserved|approved|rejected|expired",
      "message": "string",
      "reserved_date": "timestamp",
      "expiry_date": "timestamp",
      "landlord": { /* landlord details */ }
    }
  ]
}
```

#### GET `/reservations/landlord`
**Purpose:** Get landlord's reservation requests
**Auth:** Required (Landlord)

#### POST `/reservations`
**Purpose:** Create new reservation
**Auth:** Required (Student)
**Body:**
```json
{
  "property_id": "uuid",
  "message": "string"
}
```

#### PUT `/reservations/:id/approve`
**Purpose:** Approve reservation
**Auth:** Required (Landlord, owner only)

#### PUT `/reservations/:id/reject`
**Purpose:** Reject reservation
**Auth:** Required (Landlord, owner only)
**Body:**
```json
{
  "rejection_reason": "string"
}
```

#### DELETE `/reservations/:id`
**Purpose:** Cancel reservation
**Auth:** Required (Student, owner only)

---

### 3. Bookings APIs (Priority: HIGH)

#### GET `/bookings/student`
**Purpose:** Get student's bookings
**Auth:** Required (Student)

#### GET `/bookings/landlord`
**Purpose:** Get landlord's bookings
**Auth:** Required (Landlord)

#### POST `/bookings`
**Purpose:** Create new booking
**Auth:** Required (Student)
**Body:**
```json
{
  "property_id": "uuid",
  "move_in_date": "date",
  "duration_months": 12,
  "payment_type": "full|downpayment",
  "amount_paid": 8500,
  "message": "string"
}
```

#### PUT `/bookings/:id/approve`
**Purpose:** Approve booking
**Auth:** Required (Landlord, owner only)

#### PUT `/bookings/:id/reject`
**Purpose:** Reject booking
**Auth:** Required (Landlord, owner only)

#### PUT `/bookings/:id/cancel`
**Purpose:** Cancel booking
**Auth:** Required (Student or Landlord)

---

### 4. Escrow APIs (Priority: HIGH)

#### GET `/escrow/student`
**Purpose:** Get student's escrow transactions
**Auth:** Required (Student)

#### GET `/escrow/landlord`
**Purpose:** Get landlord's escrow transactions
**Auth:** Required (Landlord)

#### POST `/escrow`
**Purpose:** Create escrow transaction
**Auth:** Required (Student)
**Body:**
```json
{
  "booking_id": "uuid",
  "amount": 8500
}
```

#### PUT `/escrow/:id/release`
**Purpose:** Release funds to landlord
**Auth:** Required (Admin or System)

#### PUT `/escrow/:id/refund`
**Purpose:** Refund to student
**Auth:** Required (Admin or System)

---

### 5. Notifications APIs (Priority: MEDIUM)

#### GET `/notifications`
**Purpose:** Get user's notifications
**Auth:** Required
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "booking_created",
      "title": "string",
      "message": "string",
      "is_read": false,
      "action_url": "/path",
      "created_at": "timestamp"
    }
  ]
}
```

#### PUT `/notifications/:id/read`
**Purpose:** Mark notification as read
**Auth:** Required

#### PUT `/notifications/read-all`
**Purpose:** Mark all notifications as read
**Auth:** Required

#### DELETE `/notifications/:id`
**Purpose:** Delete notification
**Auth:** Required

---

### 6. Admin APIs (Priority: MEDIUM)

#### GET `/admin/landlords`
**Purpose:** Get all landlords
**Auth:** Required (Admin)
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "full_name": "string",
      "email": "string",
      "phone": "string",
      "business_name": "string",
      "is_verified": boolean,
      "total_properties": number,
      "created_at": "timestamp"
    }
  ]
}
```

#### GET `/admin/students`
**Purpose:** Get all students
**Auth:** Required (Admin)

#### GET `/admin/stats`
**Purpose:** Get platform statistics
**Auth:** Required (Admin)
**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": number,
    "total_students": number,
    "total_landlords": number,
    "total_properties": number,
    "verified_properties": number,
    "pending_properties": number,
    "total_bookings": number,
    "total_revenue": number
  }
}
```

#### PUT `/admin/users/:id/verify`
**Purpose:** Verify user account
**Auth:** Required (Admin)

#### PUT `/admin/users/:id/suspend`
**Purpose:** Suspend user account
**Auth:** Required (Admin)

---

### 7. Messages APIs (Priority: LOW)

#### GET `/messages/conversations`
**Purpose:** Get user's conversations
**Auth:** Required

#### GET `/messages/conversation/:id`
**Purpose:** Get messages in conversation
**Auth:** Required

#### POST `/messages`
**Purpose:** Send message
**Auth:** Required
**Body:**
```json
{
  "receiver_id": "uuid",
  "property_id": "uuid",
  "message": "string"
}
```

---

## 📊 Implementation Priority

### Phase 1: Critical (Do First)
1. ✅ Properties (Done)
2. ❌ Favorites
3. ❌ Reservations
4. ❌ Bookings
5. ❌ Escrow

### Phase 2: Important (Do Second)
6. ❌ Notifications
7. ❌ Admin Stats & Management

### Phase 3: Nice to Have (Do Last)
8. ❌ Messages/Chat

## 🔧 Implementation Steps for Each API

### Step 1: Create Service Layer
File: `backend/services/[feature]Service.js`
- Database queries using Supabase
- Business logic
- Data validation

### Step 2: Create Controller
File: `backend/controllers/[feature]Controller.js`
- Handle HTTP requests
- Call service functions
- Return responses

### Step 3: Create Routes
File: `backend/routes/[feature]Routes.js`
- Define endpoints
- Add authentication middleware
- Add role-based access control

### Step 4: Register Routes
File: `backend/server.js`
- Import and use routes
- Test endpoints

### Step 5: Update Frontend Context
File: `src/context/[Feature]Context.jsx`
- Replace localStorage with API calls
- Add loading states
- Handle errors

## 📝 Code Templates

### Service Template
```javascript
import { supabase } from '../config/database.js';

export const getItems = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Controller Template
```javascript
export const getItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = await itemService.getItems(userId);
    
    return res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Routes Template
```javascript
import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as controller from '../controllers/itemController.js';

const router = express.Router();

router.get('/', authenticate, controller.getItems);
router.post('/', authenticate, controller.createItem);

export default router;
```

## ✅ Completion Checklist

- [ ] Favorites APIs (3 endpoints)
- [ ] Reservations APIs (6 endpoints)
- [ ] Bookings APIs (5 endpoints)
- [ ] Escrow APIs (5 endpoints)
- [ ] Notifications APIs (4 endpoints)
- [ ] Admin APIs (5 endpoints)
- [ ] Messages APIs (3 endpoints)

**Total:** 31 endpoints to implement

## 🎯 Estimated Time

- Favorites: 2-3 hours
- Reservations: 4-5 hours
- Bookings: 4-5 hours
- Escrow: 3-4 hours
- Notifications: 3-4 hours
- Admin: 3-4 hours
- Messages: 4-5 hours

**Total:** 23-30 hours of development
