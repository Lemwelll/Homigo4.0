# Verify Unavailable Properties Feature is Working

## Current Implementation

### Backend (`backend/services/propertyService.js`)
✅ Queries bookings table for active/completed bookings
✅ Marks properties as `isRented: true` if they have active bookings
✅ Logs to console when properties are rented

### Frontend PropertyCard (`src/components/PropertyCard.jsx`)
✅ Darkens image (50% black overlay)
✅ Shows "NOT AVAILABLE" badge (red, top-right)
✅ Still clickable to view details

### Frontend PropertyDetails (`src/pages/PropertyDetails.jsx`)
✅ Disables "Reserve Property" button
✅ Disables "Book Now" button
✅ Shows "Property Not Available" text on buttons

## Step-by-Step Verification

### Step 1: Check Database for Bookings

Run this SQL in Supabase:

```sql
SELECT 
    b.property_id,
    p.title,
    b.status,
    b.payment_status,
    u.full_name as student_name
FROM bookings b
JOIN properties p ON b.property_id = p.id
JOIN users u ON b.student_id = u.id
WHERE b.status IN ('active', 'completed')
ORDER BY b.created_at DESC;
```

**Expected:** You should see 2 properties that have been booked and paid for.

**Copy the `property_id` values** - these properties should show as unavailable.

### Step 2: Restart Backend

```bash
cd backend
# Press Ctrl+C to stop
npm start
```

### Step 3: Check Backend Logs

When backend starts and you visit the browse page, look for:

```
🏠 Property "Modern House in CMU" is RENTED (has active booking)
🏠 Property "Another Property" is RENTED (has active booking)
📊 Fetched 10 properties, 2 are rented
```

**If you DON'T see these logs:**
- Backend isn't finding the bookings
- Check the SQL query in Step 1 again

### Step 4: Check Frontend (Browse Page)

1. Open browser
2. Go to Browse Properties page
3. Hard refresh (Ctrl+Shift+R)

**Expected for rented properties:**
- ✅ Image is darker (50% overlay)
- ✅ Red "NOT AVAILABLE" badge in top-right corner
- ✅ No green "VERIFIED" badge (replaced by NOT AVAILABLE)

**Expected for available properties:**
- ✅ Normal bright image
- ✅ Green "VERIFIED" badge (if verified)
- ✅ No "NOT AVAILABLE" badge

### Step 5: Check Property Details Page

1. Click on a rented property
2. Scroll to the booking section

**Expected:**
- ✅ "Reserve Property" button is GRAY and says "Property Not Available"
- ✅ "Book Now" button is GRAY and says "Property Not Available"
- ✅ Both buttons are disabled (cursor: not-allowed)
- ✅ "Message Landlord" button still works (green)

### Step 6: Try to Book (Should Fail)

1. Try clicking "Book Now" on a rented property
2. **Expected:** Nothing happens (button is disabled)

## Troubleshooting

### Issue 1: No Properties Show as Unavailable

**Check backend logs:**
```
📊 Fetched 10 properties, 0 are rented
```

**Solution:**
1. Verify bookings exist in database (Step 1)
2. Check booking status is 'active' or 'completed'
3. Restart backend

### Issue 2: Backend Logs Show Rented But Frontend Doesn't

**Check browser console (F12):**
Look for the property data:

```javascript
console.log(properties)
// Should show: isRented: true
```

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear cache
3. Check API response in Network tab

### Issue 3: "NOT AVAILABLE" Badge Not Showing

**Check:**
1. Is `property.isRented` true in the data?
2. Open browser console and type:
   ```javascript
   // In React DevTools or console
   properties.filter(p => p.isRented)
   ```

**Solution:**
- Frontend code is correct
- Issue is with backend not returning `isRented: true`
- Check backend logs

## Quick Test SQL

If you want to manually test, create a booking:

```sql
-- Get a property ID
SELECT id, title FROM properties LIMIT 1;

-- Create a test booking (replace YOUR-PROPERTY-ID)
INSERT INTO bookings (
    property_id,
    student_id,
    landlord_id,
    status,
    payment_type,
    total_amount,
    payment_status,
    start_date,
    end_date
)
SELECT 
    'YOUR-PROPERTY-ID',
    (SELECT id FROM users WHERE role = 'student' LIMIT 1),
    landlord_id,
    'active',
    'full',
    rent_price,
    'completed',
    NOW(),
    NOW() + INTERVAL '1 month'
FROM properties
WHERE id = 'YOUR-PROPERTY-ID';
```

Then:
1. Restart backend
2. Refresh browser
3. Property should show "NOT AVAILABLE"

## Expected Visual Result

### Browse Page - Unavailable Property
```
┌─────────────────────────────┐
│  ╔═══════════════════════╗  │
│  ║  [Darkened Image]     ║  │
│  ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║  │ <- 50% darker
│  ║                       ║  │
│  ║  [NOT AVAILABLE] ←────║  │ <- Red badge
│  ║                       ║  │
│  ║  ₱5,000/mo           ║  │
│  ╚═══════════════════════╝  │
│  Modern House in CMU        │
└─────────────────────────────┘
```

### Property Details - Unavailable
```
┌─────────────────────────────────────┐
│  [Darkened Images]                  │
│  Modern House in CMU                │
│  ₱5,000/mo                          │
│                                     │
│  [Property Not Available]           │ <- Gray, disabled
│  [Property Not Available]           │ <- Gray, disabled
│  [Message Landlord]                 │ <- Green, works
└─────────────────────────────────────┘
```

## Checklist

- [ ] Ran SQL to check bookings exist
- [ ] Backend restarted
- [ ] Backend logs show "X properties are rented"
- [ ] Browser hard refreshed
- [ ] Rented properties show "NOT AVAILABLE" badge
- [ ] Rented properties have darker images
- [ ] Clicking rented property shows disabled buttons
- [ ] Buttons say "Property Not Available"
- [ ] Message Landlord still works

## Status

If ALL checkboxes above are checked, the feature is working correctly!

The code IS implemented and functional. You just need to:
1. ✅ Have bookings in the database
2. ✅ Restart backend
3. ✅ Refresh browser

Then you'll see the "NOT AVAILABLE" badge and disabled buttons!
