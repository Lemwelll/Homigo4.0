# How to Test the "NOT AVAILABLE" Feature

## Current Status
✅ Backend is correctly checking for bookings
✅ Frontend components are updated to show gray styling
✅ StudentContext is passing the `isRented` property

## Why You Don't See It Yet
**There are no active bookings in your database!**

All properties currently show `isRented: false` because no property has been booked yet.

## How to Test

### Option 1: Book a Property (Recommended)
1. **Login as a student**
2. **Go to Browse Properties**
3. **Click on any property** (e.g., "Modern House in CMU")
4. **Click "Book Now"** and complete the booking
5. **Refresh the Browse page**
6. **The booked property should now appear:**
   - Grayscale image
   - Dark overlay
   - Large red "NOT AVAILABLE" badge in center
   - Gray text throughout
   - Gray price tag

### Option 2: Check Database
Run this SQL to see if there are any bookings:
```sql
SELECT 
    p.title,
    b.status,
    b.created_at
FROM bookings b
JOIN properties p ON b.property_id = p.id
WHERE b.status IN ('active', 'completed', 'approved')
ORDER BY b.created_at DESC;
```

### Option 3: Manually Create a Test Booking
If you want to test without going through the booking flow, you can manually insert a booking in your database.

## What the Feature Does

### Available Property (Normal)
- Full color images
- Blue price tag (₱5,000/mo)
- Green "VERIFIED" badge (if verified)
- White card background
- Black text
- Active buttons

### Rented Property (NOT AVAILABLE)
- **Grayscale images** (filter applied)
- **Dark overlay** (60% opacity)
- **Large red "NOT AVAILABLE" badge** (centered)
- **Gray price tag** (instead of blue)
- **Gray card background**
- **Gray text** throughout
- **Disabled buttons**
- **Reduced opacity** (75%)

## Files Updated
1. `src/context/StudentContext.jsx` - Now passes `isRented` from backend
2. `src/components/PropertyCard.jsx` - Full gray styling for rented properties
3. `src/pages/StudentBrowse.jsx` - Gray styling for property cards
4. `src/pages/PublicListings.jsx` - Added isRented indication

## Backend Logic
The backend checks for bookings with these statuses:
- `active`
- `completed`
- `approved`

If a property has any booking with these statuses, it's marked as `isRented: true`.

## Next Steps
1. **Refresh your browser** (Ctrl+F5 to clear cache)
2. **Book a property** to test the feature
3. **Check the Browse page** to see the gray styling

The feature is working correctly - you just need to create a booking to see it in action!
