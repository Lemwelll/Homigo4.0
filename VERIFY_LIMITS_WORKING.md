# Verify Subscription Limits Are Working

## Quick Test Guide

### Test 1: Student Favorites Limit (3 max for free tier)

1. **Login as a student** (free tier by default)
2. **Go to Browse Properties** (`/student/browse`)
3. **Click the heart icon** on 3 different properties
   - ✅ Should work fine for first 3
4. **Try to favorite a 4th property**
   - ❌ Should show upgrade modal
   - Modal should say "You've reached the free tier limit of 3 favorites"
5. **Check Saved Listings page** (`/student/favorites`)
   - Should show: "Your favorite properties (3/3 - Upgrade for unlimited)"

### Test 2: Student Reservations Limit (2 max for free tier)

1. **Login as a student** (free tier by default)
2. **Go to Browse Properties** and click on a property
3. **Click "Reserve Property"** button
   - ✅ Should work for first reservation
4. **Go back and reserve another property**
   - ✅ Should work for second reservation
5. **Try to reserve a 3rd property**
   - ❌ Should show upgrade modal
   - Modal should say "You've reached the free tier limit of 2 active reservations"
6. **Check My Reservations page** (`/student/reservations`)
   - Should show: "(2/2 active - Upgrade for unlimited)"

### Test 3: Landlord Property Listings Limit (3 max for free tier)

1. **Login as a landlord** (free tier by default)
2. **Go to My Properties** (`/landlord/properties`)
   - Should show: "(X/3 used - Upgrade for unlimited)"
3. **Click "Add Property"** and submit 3 properties
   - ✅ Should work fine for first 3
4. **Try to add a 4th property**
   - ❌ Should show upgrade modal when clicking submit
   - Modal should say "You've reached the free tier limit of 3 property listings"

## Expected Behavior

### Free Tier Limits:
- ✅ Students: 3 favorites maximum
- ✅ Students: 2 active reservations maximum
- ✅ Landlords: 3 property listings maximum

### Premium Tier (Unlimited):
To test premium tier:
1. Open browser console (F12)
2. Run: `localStorage.setItem('homigo_tier', 'premium')`
3. Refresh the page
4. Try adding more than the limits
   - ✅ Should work without showing upgrade modal

## Where Limits Are Enforced

### 1. Favorites Limit
**Files:**
- `src/context/StudentContext.jsx` - toggleFavorite function checks limit
- `src/pages/StudentBrowse.jsx` - Handles limit error and shows modal
- `src/pages/PropertyDetails.jsx` - Handles limit error and shows modal
- `src/pages/StudentFavorites.jsx` - Shows usage indicator

**Check:**
```javascript
// In StudentContext.jsx line ~280
if (accountTier?.tier === 'free' && favorites.length >= FREE_FAVORITE_LIMIT) {
  return { success: false, error: 'limit_reached', limit: FREE_FAVORITE_LIMIT }
}
```

### 2. Reservations Limit
**Files:**
- `src/pages/PropertyDetails.jsx` - handleReserveProperty checks active reservations
- `src/pages/StudentReservations.jsx` - Shows usage indicator

**Check:**
```javascript
// In PropertyDetails.jsx line ~95
const activeReservations = reservations.filter(r => r.status === 'pending').length
if (accountState.tier === 'free' && activeReservations >= FREE_RESERVATION_LIMIT) {
  setShowUpgradeModal(true)
  return
}
```

### 3. Property Listings Limit
**Files:**
- `src/pages/AddProperty.jsx` - handleSubmit checks property count
- `src/pages/LandlordProperties.jsx` - Shows usage indicator

**Check:**
```javascript
// In AddProperty.jsx line ~150
if (accountState.tier === 'free' && properties.length >= FREE_LISTING_LIMIT) {
  setShowUpgradeModal(true)
  return
}
```

## Upgrade Modals

All upgrade modals include:
- 👑 Crown icon
- Clear explanation of limit reached
- List of premium benefits
- Pricing: ₱299/month
- Two buttons:
  - "Maybe Later" - Closes modal
  - "Upgrade Now" - Navigates to settings page

## Usage Indicators

### Student Pages:
- **Favorites Page**: "Your favorite properties (X/3 - Upgrade for unlimited)"
- **Reservations Page**: "(X/2 active - Upgrade for unlimited)"

### Landlord Pages:
- **Properties Page**: "(X/3 used - Upgrade for unlimited)"

## Troubleshooting

### If limits are not working:

1. **Check AccountTierContext is loaded:**
   ```javascript
   // In browser console
   console.log(localStorage.getItem('homigo_tier'))
   // Should show 'free' or 'premium'
   ```

2. **Verify context is in App.jsx:**
   - Check that `<AccountTierProvider>` wraps the app
   - Should be in `src/App.jsx`

3. **Check component imports:**
   - All pages should import: `import { useAccountTier } from '../context/AccountTierContext'`
   - All pages should use: `const { accountState } = useAccountTier()`

4. **Clear cache and reload:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

## Success Criteria

✅ **All limits enforced:**
- Cannot add 4th favorite (free tier)
- Cannot make 3rd reservation (free tier)
- Cannot add 4th property listing (free tier)

✅ **Upgrade modals appear:**
- Show when limit is reached
- Display correct information
- Navigate to settings on "Upgrade Now"

✅ **Usage indicators visible:**
- Show current usage vs limit
- Include upgrade link
- Only show for free tier users

✅ **Premium tier works:**
- No limits when tier is 'premium'
- No upgrade modals shown
- No usage indicators shown

## Test Results

Run through all tests above and mark results:

- [ ] Student Favorites Limit Working
- [ ] Student Reservations Limit Working
- [ ] Landlord Listings Limit Working
- [ ] Upgrade Modals Appearing
- [ ] Usage Indicators Showing
- [ ] Premium Tier Unlimited Access

If all checked, subscription limits are fully implemented! ✅
