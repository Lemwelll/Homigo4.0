# How the Property Availability System Works

## 📖 Complete System Flow Explanation

This document explains exactly how the property availability system works from start to finish, in simple terms.

---

## 🎯 The Goal

**When a landlord approves a booking, that property should become unavailable to other students.**

This means:
- ❌ Students can't favorite it
- ❌ Students can't reserve it
- ❌ Students can't book it
- ✅ Students can see it's unavailable with a clear badge

---

## 🔄 The Complete Flow

### Step 1: Student Creates a Booking

**What Happens:**
1. Student browses properties on the Browse page
2. Student clicks on a property to view details
3. Student clicks "Book Now" button
4. Student fills in booking details (move-in date, duration, etc.)
5. Student submits the booking

**In the Database:**
```sql
-- A new booking is created
INSERT INTO bookings (
  property_id,
  student_id,
  landlord_id,
  status,           -- Set to 'pending'
  amount_paid,
  ...
) VALUES (...);

-- An escrow transaction is created
INSERT INTO escrow_transactions (
  booking_id,
  property_id,
  student_id,
  landlord_id,
  amount,
  status            -- Set to 'held'
) VALUES (...);
```

**Result:**
- Booking status: `'pending'`
- Escrow status: `'held'`
- Property: **STILL AVAILABLE** ✅

---

### Step 2: Landlord Reviews the Booking

**What Happens:**
1. Landlord receives a notification about the new booking
2. Landlord logs into their dashboard
3. Landlord goes to "Bookings" page
4. Landlord sees the pending booking request
5. Landlord reviews student information and booking details

**In the System:**
- Booking is visible in landlord's bookings list
- Status shows as "Pending"
- Landlord can see student details
- Landlord has two options: Approve or Reject

**Result:**
- Property: **STILL AVAILABLE** ✅

---

### Step 3: Landlord Approves the Booking

**What Happens:**
1. Landlord clicks "Approve" button
2. System updates booking status
3. System releases escrow payment
4. System sends notification to student

**In the Code:**
```javascript
// backend/services/bookingService.js
export const updateBookingStatus = async (bookingId, userId, status, userRole) => {
  // Update booking status to 'approved'
  const { data: updated } = await supabase
    .from('bookings')
    .update({ status: 'approved' })
    .eq('id', bookingId);

  // If landlord approves, release escrow
  if (userRole === 'landlord' && status === 'approved') {
    await escrowService.releaseEscrow(bookingId, userId);
  }
};
```

**In the Database:**
```sql
-- Booking status changes
UPDATE bookings 
SET status = 'approved', updated_at = NOW()
WHERE id = 'booking-id';

-- Escrow status changes
UPDATE escrow_transactions
SET status = 'released', released_date = NOW()
WHERE booking_id = 'booking-id';
```

**Result:**
- Booking status: `'approved'` ✅
- Escrow status: `'released'` ✅
- Property: **NOW UNAVAILABLE** ❌

---

### Step 4: Backend Detects Unavailability

**What Happens:**
When any student requests the list of properties, the backend checks each property's availability.

**In the Code:**
```javascript
// backend/services/propertyService.js
export const getVerifiedProperties = async () => {
  // 1. Fetch all verified properties
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('verification_status', 'verified');

  // 2. Get property IDs
  const propertyIds = properties.map(p => p.id);

  // 3. Check for approved bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('property_id, status')
    .in('property_id', propertyIds)
    .in('status', ['approved', 'active', 'completed']);

  // 4. Check for released escrow
  const { data: escrowTransactions } = await supabase
    .from('escrow_transactions')
    .select('property_id, status')
    .in('property_id', propertyIds)
    .eq('status', 'released');

  const { data: escrowPayments } = await supabase
    .from('escrow_payments')
    .select('property_id, status')
    .in('property_id', propertyIds)
    .eq('status', 'released');

  // 5. For each property, determine if it's unavailable
  return properties.map(prop => {
    // Check if property has approved booking
    const hasApprovedBooking = bookings?.some(
      b => b.property_id === prop.id
    );

    // Check if property has released escrow
    const hasReleasedEscrow = 
      escrowTransactions?.some(e => e.property_id === prop.id) ||
      escrowPayments?.some(e => e.property_id === prop.id);

    // Property is unavailable if EITHER condition is true
    const isUnavailable = hasApprovedBooking || hasReleasedEscrow;

    return {
      ...prop,
      isRented: isUnavailable  // ← KEY FIELD
    };
  });
};
```

**The Logic:**
```
IF (property has approved booking) OR (property has released escrow)
THEN property.isRented = true
ELSE property.isRented = false
```

**API Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "property-123",
      "title": "Modern Studio Apartment",
      "location": "Musuan, Bukidnon",
      "rent_price": 5000,
      "isRented": true,  // ← Property is unavailable
      "property_images": [...],
      "property_amenities": [...]
    }
  ]
}
```

---

### Step 5: Frontend Receives the Data

**What Happens:**
The frontend fetches properties from the API and stores them in context.

**In the Code:**
```javascript
// src/context/StudentContext.jsx
const fetchVerifiedProperties = async () => {
  const response = await fetch('http://localhost:5000/properties/verified');
  const data = await response.json();

  if (data.success) {
    const transformedProperties = data.data.map(prop => ({
      id: prop.id,
      title: prop.title,
      location: prop.location,
      price: parseFloat(prop.rent_price),
      isRented: prop.isRented || false,  // ← Store the flag
      // ... other fields
    }));
    
    setProperties(transformedProperties);
  }
};
```

**Result:**
- Properties are stored in React context
- Each property has an `isRented` flag
- Frontend components can access this data

---

### Step 6: Frontend Displays Unavailable State

**What Happens:**
The Browse page checks each property's `isRented` flag and displays it accordingly.

**In the Code:**
```jsx
// src/pages/StudentBrowse.jsx
{filteredProperties.map((property) => (
  <div key={property.id} className={`card ${property.isRented ? 'opacity-75' : ''}`}>
    <div className="relative">
      {/* Property Image */}
      <img
        src={property.image}
        className={property.isRented ? 'grayscale' : ''}
      />
      
      {/* Dark Overlay for Unavailable Properties */}
      {property.isRented && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60 z-20"></div>
      )}
      
      {/* NOT AVAILABLE Badge */}
      {property.isRented && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
            NOT AVAILABLE
          </div>
        </div>
      )}
      
      {/* Disabled Favorite Button */}
      <button
        onClick={(e) => handleFavoriteClick(e, property.id)}
        disabled={property.isRented}
        className={property.isRented ? 'bg-gray-400 cursor-not-allowed' : '...'}
      >
        <Heart />
      </button>
    </div>
    
    {/* Disabled View Details Button */}
    <button 
      disabled={property.isRented}
      className={property.isRented ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'}
    >
      {property.isRented ? 'Not Available' : 'View Details'}
    </button>
  </div>
))}
```

**Visual Result:**
```
┌─────────────────────────────────┐
│  [Grayed Out Image]             │
│  ♥ (disabled, gray)             │
│                                 │
│  ┌─────────────────────┐        │
│  │  NOT AVAILABLE      │        │
│  └─────────────────────┘        │
│  ₱5,000/mo                      │
├─────────────────────────────────┤
│  Modern Studio (grayed text)    │
│  Musuan, Bukidnon (grayed)      │
│  1 Bed • 1 Bath (grayed)        │
│  [Not Available] (disabled)     │
└─────────────────────────────────┘
```

---

### Step 7: Property Details Page Also Disabled

**What Happens:**
If a student navigates to the property details page, the action buttons are disabled.

**In the Code:**
```jsx
// src/pages/PropertyDetails.jsx
<button
  onClick={handleReserveProperty}
  disabled={alreadyReserved || property.isRented}
  className={property.isRented ? 'bg-gray-300 cursor-not-allowed' : '...'}
>
  {property.isRented ? 'Property Not Available' : 'Reserve Property (48h Hold)'}
</button>

<button
  onClick={handleBookNow}
  disabled={alreadyBooked || property.isRented}
  className={property.isRented ? 'bg-gray-300 cursor-not-allowed' : '...'}
>
  {property.isRented ? 'Property Not Available' : 'Book Now (Instant)'}
</button>
```

**Visual Result:**
```
┌─────────────────────────────────┐
│  Property Details               │
│                                 │
│  ┌─────────────────────┐        │
│  │ Property Not        │        │
│  │ Available           │        │
│  └─────────────────────┘        │
│  (disabled, gray)               │
│                                 │
│  ┌─────────────────────┐        │
│  │ Property Not        │        │
│  │ Available           │        │
│  └─────────────────────┘        │
│  (disabled, gray)               │
│                                 │
│  ┌─────────────────────┐        │
│  │ Message Landlord    │        │
│  └─────────────────────┘        │
│  (still works)                  │
└─────────────────────────────────┘
```

---

## 🔄 Alternative Flow: Landlord Rejects Booking

### What Happens:
1. Landlord clicks "Reject" instead of "Approve"
2. Booking status changes to `'rejected'`
3. Escrow status changes to `'refunded'`
4. Money is returned to student
5. Property remains **AVAILABLE** ✅

**In the Database:**
```sql
UPDATE bookings 
SET status = 'rejected'
WHERE id = 'booking-id';

UPDATE escrow_transactions
SET status = 'refunded', refunded_date = NOW()
WHERE booking_id = 'booking-id';
```

**Result:**
- Property is still available for other students
- Student can book other properties

---

## 🔄 Alternative Flow: Booking is Cancelled

### What Happens:
1. Student or landlord cancels the booking
2. Booking status changes to `'cancelled'`
3. Escrow is refunded
4. Property becomes **AVAILABLE** again ✅

**In the Database:**
```sql
UPDATE bookings 
SET status = 'cancelled'
WHERE id = 'booking-id';

UPDATE escrow_transactions
SET status = 'refunded'
WHERE booking_id = 'booking-id';
```

**Result:**
- Property is available again
- Other students can book it

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   STUDENT   │
└──────┬──────┘
       │
       │ 1. Creates Booking
       ▼
┌─────────────────────────────────┐
│   DATABASE                      │
│                                 │
│   bookings                      │
│   ├─ status: 'pending'          │
│                                 │
│   escrow_transactions           │
│   ├─ status: 'held'             │
└──────┬──────────────────────────┘
       │
       │ 2. Landlord Reviews
       ▼
┌─────────────┐
│  LANDLORD   │
└──────┬──────┘
       │
       │ 3. Approves Booking
       ▼
┌─────────────────────────────────┐
│   DATABASE                      │
│                                 │
│   bookings                      │
│   ├─ status: 'approved' ✓       │
│                                 │
│   escrow_transactions           │
│   ├─ status: 'released' ✓       │
└──────┬──────────────────────────┘
       │
       │ 4. Backend Checks
       ▼
┌─────────────────────────────────┐
│   BACKEND                       │
│   (propertyService.js)          │
│                                 │
│   IF approved booking           │
│   OR released escrow            │
│   THEN isRented = true          │
└──────┬──────────────────────────┘
       │
       │ 5. API Response
       ▼
┌─────────────────────────────────┐
│   FRONTEND                      │
│   (StudentContext)              │
│                                 │
│   properties = [                │
│     {                           │
│       id: "...",                │
│       title: "...",             │
│       isRented: true ✓          │
│     }                           │
│   ]                             │
└──────┬──────────────────────────┘
       │
       │ 6. Display
       ▼
┌─────────────────────────────────┐
│   UI                            │
│   (StudentBrowse.jsx)           │
│                                 │
│   ┌─────────────────────┐       │
│   │  NOT AVAILABLE      │       │
│   └─────────────────────┘       │
│   [Disabled Buttons]            │
└─────────────────────────────────┘
```

---

## 🔍 Checking Availability: The Logic

### The Two Conditions

**Condition 1: Has Approved Booking?**
```sql
SELECT * FROM bookings 
WHERE property_id = 'property-123'
  AND status IN ('approved', 'active', 'completed');
```

If this returns any rows → Property is UNAVAILABLE

**Condition 2: Has Released Escrow?**
```sql
-- Check escrow_transactions table
SELECT * FROM escrow_transactions 
WHERE property_id = 'property-123'
  AND status = 'released';

-- Also check escrow_payments table (for backward compatibility)
SELECT * FROM escrow_payments 
WHERE property_id = 'property-123'
  AND status = 'released';
```

If either query returns any rows → Property is UNAVAILABLE

### The Final Decision

```javascript
const isUnavailable = hasApprovedBooking || hasReleasedEscrow;
```

**Truth Table:**
| Has Approved Booking | Has Released Escrow | Result |
|---------------------|---------------------|---------|
| ❌ No | ❌ No | ✅ AVAILABLE |
| ✅ Yes | ❌ No | ❌ UNAVAILABLE |
| ❌ No | ✅ Yes | ❌ UNAVAILABLE |
| ✅ Yes | ✅ Yes | ❌ UNAVAILABLE |

---

## 🎨 UI States Explained

### Available Property
```
Visual Appearance:
- ✅ Full color image
- ✅ Active favorite button (red when favorited)
- ✅ "View Details" button is clickable
- ✅ Normal opacity
- ✅ Verified badge (if verified)

User Can:
- ✅ Click favorite button
- ✅ Click to view details
- ✅ Reserve the property
- ✅ Book the property
```

### Unavailable Property
```
Visual Appearance:
- ❌ Grayed out image (grayscale filter)
- ❌ Dark overlay on image
- ❌ "NOT AVAILABLE" badge (red, centered)
- ❌ Favorite button is gray and disabled
- ❌ "Not Available" button text
- ❌ Reduced opacity (75%)
- ❌ Gray color scheme

User Cannot:
- ❌ Click favorite button (disabled)
- ❌ Reserve the property (button disabled)
- ❌ Book the property (button disabled)

User Can Still:
- ✅ View property details (read-only)
- ✅ Message landlord (to inquire about future availability)
```

---

## 🔄 Real-Time Updates

### How Updates Propagate

1. **Landlord approves booking** → Database updated immediately
2. **Backend cache expires** → After 30 seconds (or on restart)
3. **Student refreshes page** → Fetches new data from backend
4. **UI updates** → Property shows as unavailable

### Cache Behavior

```javascript
// backend/controllers/propertyController.js
const CACHE_DURATION = 30000; // 30 seconds

// Cache is checked on every request
if (cached && (now - cached.timestamp) < CACHE_DURATION) {
  return cached.data; // Return cached data
}

// Otherwise, fetch fresh data from database
const properties = await propertyService.getVerifiedProperties();
```

**What This Means:**
- Properties may take up to 30 seconds to show as unavailable
- Restarting the backend clears the cache immediately
- Students see the most recent data within 30 seconds

---

## 🛡️ Security & Validation

### Authorization Checks

**Only landlords can approve bookings:**
```javascript
// backend/controllers/bookingController.js
if (userRole !== 'landlord') {
  return res.status(403).json({
    success: false,
    message: 'Only landlords can approve bookings'
  });
}
```

**Landlords can only approve their own properties:**
```javascript
// backend/services/bookingService.js
if (booking.landlord_id !== userId) {
  throw new Error('Unauthorized: You do not own this booking');
}
```

### Preventing Double Bookings

**Database constraint (recommended):**
```sql
CREATE UNIQUE INDEX idx_one_active_booking_per_property 
ON bookings (property_id) 
WHERE status IN ('approved', 'active', 'completed');
```

This ensures only ONE approved booking per property at a time.

---

## 🧪 Testing the System

### Manual Test

1. **Login as Student A**
   - Browse properties
   - Book a property (e.g., "Modern Studio")
   - Logout

2. **Login as Landlord**
   - Go to Bookings page
   - Find Student A's booking
   - Click "Approve"
   - Logout

3. **Login as Student B**
   - Browse properties
   - Find "Modern Studio"
   - **Expected**: Shows "NOT AVAILABLE" badge
   - Try to click favorite → **Expected**: Button is disabled
   - Click on property to view details
   - **Expected**: Reserve and Book buttons are disabled

### Database Test

```sql
-- Check if property is unavailable
SELECT 
  p.title,
  b.status as booking_status,
  e.status as escrow_status,
  CASE 
    WHEN b.status IN ('approved', 'active', 'completed') 
      OR e.status = 'released' 
    THEN 'UNAVAILABLE'
    ELSE 'AVAILABLE'
  END as availability
FROM properties p
LEFT JOIN bookings b ON b.property_id = p.id
LEFT JOIN escrow_transactions e ON e.property_id = p.id
WHERE p.title = 'Modern Studio';
```

**Expected Output:**
```
title           | booking_status | escrow_status | availability
----------------|----------------|---------------|-------------
Modern Studio   | approved       | released      | UNAVAILABLE
```

---

## 🎯 Summary

### The Complete Flow in Simple Terms

1. **Student books property** → Status: Pending
2. **Landlord approves** → Status: Approved, Escrow: Released
3. **Backend checks** → Finds approved booking OR released escrow
4. **Backend sets flag** → `isRented: true`
5. **Frontend receives flag** → Property marked as unavailable
6. **UI displays** → "NOT AVAILABLE" badge, disabled buttons
7. **Other students** → Cannot interact with the property

### Key Points

✅ **Automatic**: No manual intervention needed  
✅ **Reliable**: Checks both bookings and escrow tables  
✅ **Clear**: Visual indicators show unavailability  
✅ **Secure**: Only landlords can approve bookings  
✅ **Fast**: Cached for performance (30s cache)  
✅ **Complete**: Works across entire stack  

### The Result

**Students only see properties they can actually book, and unavailable properties are clearly marked with disabled interactions.**

---

## 📚 Related Documentation

- **PROPERTY_AVAILABILITY_SUMMARY.md** - Quick overview
- **PROPERTY_AVAILABILITY_SYSTEM_COMPLETE.md** - Technical details
- **TEST_PROPERTY_AVAILABILITY_FLOW.md** - Testing guide
- **PROPERTY_AVAILABILITY_TROUBLESHOOTING.md** - Fix issues

---

**Last Updated**: 2025-11-29  
**Status**: ✅ FULLY IMPLEMENTED AND WORKING
