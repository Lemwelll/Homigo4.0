# Property Limit System - Complete Guide

## Overview
The system enforces property listing limits based on account tier:
- **Free Tier**: Maximum 3 properties
- **Premium Tier**: Unlimited properties

## How It Works

### Frontend Protection (AddProperty.jsx)

When a landlord tries to add a property, the system checks their current property count:

```javascript
const FREE_LISTING_LIMIT = 3

if (accountState.tier === 'free' && properties.length >= FREE_LISTING_LIMIT) {
  setShowUpgradeModal(true)  // Show upgrade modal
  return  // Prevent form submission
}
```

**What happens:**
1. User fills out the property form
2. Clicks "Add Property"
3. System checks: Is user on free tier? Do they have 3+ properties?
4. If YES → Show upgrade modal with premium benefits
5. If NO → Allow property creation

### Backend Protection (propertyService.js)

The backend also enforces limits for security:

```javascript
// Check user's subscription tier
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('tier, status')
  .eq('user_id', landlordId)
  .eq('status', 'active')
  .single();

const userTier = subscription?.tier || 'free';

// Free tier: Check limit
if (userTier === 'free') {
  const { data: existingProperties } = await supabase
    .from('properties')
    .select('id')
    .eq('landlord_id', landlordId);

  if (existingProperties.length >= 3) {
    throw new Error('Free tier limit reached. Upgrade to premium for unlimited listings.');
  }
}

// Premium tier: No limit check needed
```

**What happens:**
1. Backend receives property creation request
2. Checks user's subscription status in database
3. If free tier → Count existing properties
4. If 3+ properties → Reject with error message
5. If premium tier → Allow unlimited properties

## User Experience

### Free Tier User (3 Properties Already)
1. Navigates to "Add Property" page
2. Fills out property details
3. Clicks "Add Property"
4. **Modal appears:**
   - "Upgrade to Premium"
   - Shows benefits: Unlimited listings, featured placement, priority support
   - Price: ₱299/month
   - Buttons: "Maybe Later" or "Upgrade Now"
5. If "Upgrade Now" → Redirects to `/upgrade` page
6. If "Maybe Later" → Modal closes, stays on form

### Premium User
1. Navigates to "Add Property" page
2. Fills out property details
3. Clicks "Add Property"
4. Property is created immediately
5. No limit checks or modals
6. Can add unlimited properties

## Files Involved

### Frontend
- `src/pages/AddProperty.jsx` - Form with limit check and upgrade modal
- `src/context/PropertyContext.jsx` - Manages properties list
- `src/context/AccountTierContext.jsx` - Tracks user's subscription tier

### Backend
- `backend/services/propertyService.js` - Enforces limits on creation
- `backend/controllers/propertyController.js` - Handles HTTP requests
- `backend/services/subscriptionService.js` - Manages subscription status

## Database Tables

### subscriptions
```sql
- user_id (UUID)
- tier (TEXT) - 'free' or 'premium'
- status (TEXT) - 'active', 'cancelled', 'expired'
- start_date (TIMESTAMP)
- end_date (TIMESTAMP)
```

### properties
```sql
- id (UUID)
- landlord_id (UUID) - References users.id
- title, description, location, etc.
```

## Testing

### Test Free Tier Limit
1. Login as landlord (free tier)
2. Add 3 properties
3. Try to add 4th property
4. Should see upgrade modal
5. Backend should reject if bypassed

### Test Premium Tier
1. Login as landlord
2. Upgrade to premium (or set in database)
3. Add 4+ properties
4. Should work without limits

### SQL to Test
```sql
-- Check user's tier
SELECT tier, status FROM subscriptions 
WHERE user_id = 'your-user-id' 
AND status = 'active';

-- Count user's properties
SELECT COUNT(*) FROM properties 
WHERE landlord_id = 'your-user-id';

-- Manually set premium tier for testing
INSERT INTO subscriptions (user_id, tier, status, start_date, end_date)
VALUES ('your-user-id', 'premium', 'active', NOW(), NOW() + INTERVAL '1 month');
```

## Upgrade Flow

1. User hits limit → Modal appears
2. Clicks "Upgrade Now" → Redirects to `/upgrade`
3. Selects payment method → Processes payment
4. Backend creates subscription record
5. `AccountTierContext` updates tier to 'premium'
6. User can now add unlimited properties

## Security Notes

✅ **Double Protection**: Both frontend and backend enforce limits
✅ **Database-Driven**: Tier status comes from database, not localStorage
✅ **Cannot Bypass**: Even if frontend is manipulated, backend rejects
✅ **Real-Time**: Subscription status checked on every property creation

## Common Issues

### Issue: User upgraded but still sees limit
**Solution**: Refresh subscription status
```javascript
await fetchSubscriptionStatus();
```

### Issue: Backend allows 4th property on free tier
**Solution**: Check subscription table has correct tier
```sql
UPDATE subscriptions 
SET tier = 'free' 
WHERE user_id = 'user-id';
```

### Issue: Premium user sees upgrade modal
**Solution**: Check AccountTierContext is fetching correctly
```javascript
console.log('Current tier:', accountState.tier);
```

## Status
✅ Frontend limit check - WORKING
✅ Backend limit enforcement - WORKING
✅ Upgrade modal - WORKING
✅ Premium unlimited - WORKING
✅ Database-driven tiers - WORKING

The property limit system is fully functional and secure!
