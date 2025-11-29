# Test Subscription Limits - Quick Guide

## 🧪 Test Reservations Limit (2 max for free tier)

### Step-by-Step Test:

1. **Open Browser Console** (Press F12)
   - This will show debug logs

2. **Login as a student**
   - Make sure you're on free tier (default)

3. **Go to Browse Properties**
   - Navigate to `/student/browse`

4. **Click on first property**
   - Click "Reserve Property" button
   - Fill in message (optional)
   - Click "Confirm Reservation"
   - ✅ Should work - 1st reservation created

5. **Go back and click on second property**
   - Click "Reserve Property" button
   - Fill in message (optional)
   - Click "Confirm Reservation"
   - ✅ Should work - 2nd reservation created

6. **Go back and click on third property**
   - Click "Reserve Property" button
   - ❌ Should show UPGRADE MODAL
   - Modal should say: "You've reached the free tier limit of 2 active reservations"

### What to Look for in Console:

When you click "Reserve Property", you should see:

```
🔍 Reservation Check: {
  tier: "free",
  userId: 123,
  totalReservations: 5,  // All reservations in system
  myActiveReservations: 2,  // YOUR pending reservations
  limit: 2,
  willBlock: true  // Will show modal if true
}
```

**For 1st reservation:**
- myActiveReservations: 0
- willBlock: false
- ✅ ALLOWED: Showing reservation modal

**For 2nd reservation:**
- myActiveReservations: 1
- willBlock: false
- ✅ ALLOWED: Showing reservation modal

**For 3rd reservation:**
- myActiveReservations: 2
- willBlock: true
- ❌ BLOCKED: Showing upgrade modal

## 🧪 Test Favorites Limit (3 max for free tier)

1. **Go to Browse Properties**
2. **Click heart icon on 3 properties**
   - ✅ Should work for all 3
3. **Try to favorite 4th property**
   - ❌ Should show upgrade modal

## 🧪 Test Property Listings Limit (3 max for free tier)

1. **Login as landlord**
2. **Add 3 properties**
   - ✅ Should work for all 3
3. **Try to add 4th property**
   - ❌ Should show upgrade modal when submitting form

## 🔧 Troubleshooting

### If limits are NOT working:

1. **Check your tier:**
   ```javascript
   // In browser console
   console.log(localStorage.getItem('homigo_tier'))
   // Should show null or 'free'
   ```

2. **Force free tier:**
   ```javascript
   localStorage.removeItem('homigo_tier')
   location.reload()
   ```

3. **Check reservations are loading:**
   ```javascript
   // In browser console on property details page
   // Look for the debug logs when clicking "Reserve Property"
   ```

### If you want to test Premium (unlimited):

```javascript
// In browser console
localStorage.setItem('homigo_tier', 'premium')
location.reload()
```

Then try to add more than the limits - should work without showing modal.

## ✅ Expected Results

### Free Tier:
- Can favorite UP TO 3 properties (4th shows modal)
- Can reserve UP TO 2 properties (3rd shows modal)
- Can list UP TO 3 properties (4th shows modal)

### Premium Tier:
- Unlimited favorites
- Unlimited reservations
- Unlimited listings
- No modals shown

## 📊 Current Status

The limits are now properly implemented:

✅ **Favorites**: Checks user's favorite count before adding
✅ **Reservations**: Checks user's PENDING reservations (filtered by user ID)
✅ **Listings**: Checks landlord's property count

All checks happen BEFORE the action, showing upgrade modal when limit reached.
