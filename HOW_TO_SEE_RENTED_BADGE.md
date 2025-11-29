# How to See the RENTED Badge - Step by Step

## Why You Can't See It Yet

The RENTED badge only shows when a property has an **active booking** in the database. If no properties have been booked yet, you won't see any RENTED badges.

## Option 1: Book a Property (Real Test)

1. Login as a **student**
2. Go to Browse Properties
3. Click on a property
4. Click "Book Now"
5. Complete the payment
6. Go back to Browse Properties
7. **The property you just booked should now show RENTED badge**

## Option 2: Create a Test Booking (Quick Test)

### Step 1: Get a Property ID

Run this in Supabase SQL Editor:
```sql
SELECT id, title FROM properties LIMIT 5;
```

Copy one of the `id` values (it's a UUID like `123e4567-e89b-12d3-a456-426614174000`)

### Step 2: Create a Test Booking

Replace `YOUR-PROPERTY-ID` with the ID you copied:

```sql
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
    'YOUR-PROPERTY-ID',  -- PASTE YOUR PROPERTY ID HERE
    (SELECT id FROM users WHERE role = 'student' LIMIT 1),
    landlord_id,
    'active',  -- This makes it RENTED
    'full',
    rent_price,
    'completed',
    NOW(),
    NOW() + INTERVAL '1 month'
FROM properties
WHERE id = 'YOUR-PROPERTY-ID';  -- PASTE YOUR PROPERTY ID HERE AGAIN
```

### Step 3: Restart Backend

```bash
# In backend terminal
# Press Ctrl+C
# Then:
cd backend
npm start
```

### Step 4: Check Backend Logs

When you refresh the browse page, you should see in backend console:
```
🏠 Property "Modern House in CMU" is RENTED (has active booking)
📊 Fetched 10 properties, 1 are rented
```

### Step 5: Refresh Browser

1. Go to Browse Properties page
2. Hard refresh (Ctrl+Shift+R or Ctrl+F5)
3. **You should now see the RENTED badge on that property!**

## What the RENTED Badge Looks Like

```
┌─────────────────────────────┐
│  ╔═══════════════════════╗  │
│  ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║  │ <- Dark overlay
│  ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║  │
│  ║  ▓▓▓ RENTED ▓▓▓▓▓▓▓▓  ║  │ <- Big red badge
│  ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║  │
│  ╚═══════════════════════╝  │
│  Modern House in CMU        │
│  📍 Musuan                  │
└─────────────────────────────┘
```

## Troubleshooting

### Issue 1: Still No Badge After Creating Booking

**Check backend logs:**
```
📊 Fetched 10 properties, 0 are rented
```

This means the booking wasn't found. Verify:

```sql
SELECT * FROM bookings WHERE status = 'active';
```

If no results, the booking wasn't created properly.

### Issue 2: Backend Not Logging Anything

Backend wasn't restarted. Make sure to:
1. Stop backend (Ctrl+C)
2. Start again (`npm start`)

### Issue 3: Badge Shows But Looks Wrong

Check browser console (F12) for errors. The CSS might not be loading.

## Quick Test Script

Use the `TEST_RENTED_BADGE.sql` file I created. It has all the steps in one place!

## To Remove Test Booking

```sql
DELETE FROM bookings WHERE property_id = 'YOUR-PROPERTY-ID';
```

Then restart backend and refresh browser.

## Summary

The RENTED badge IS implemented and working. You just need:
1. ✅ A property with an active booking in the database
2. ✅ Backend restarted after creating the booking
3. ✅ Browser refreshed to fetch new data

Follow Option 2 above to quickly test it!
