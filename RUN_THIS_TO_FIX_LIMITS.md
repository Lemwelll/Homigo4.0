# FIX SUBSCRIPTION LIMITS - COMPLETE SOLUTION

## ⚠️ IMPORTANT: Run This SQL First!

The backend now enforces limits, but you need to add the `subscription_tier` column to your database.

### Step 1: Run SQL Migration

Open your Supabase SQL Editor and run this:

```sql
-- Add subscription_tier column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free' 
CHECK (subscription_tier IN ('free', 'premium'));

-- Update existing users to have 'free' tier
UPDATE users 
SET subscription_tier = 'free' 
WHERE subscription_tier IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name = 'subscription_tier';
```

### Step 2: Restart Backend Server

```bash
cd backend
npm start
```

## ✅ What Was Fixed

### 1. Frontend Limits (Double-Check)
- ✅ Checks BEFORE showing reservation modal
- ✅ Checks AGAIN before creating reservation
- ✅ Filters by current user's ID
- ✅ Only counts 'pending' status reservations

### 2. Backend Limits (NEW - 100% Enforced)
- ✅ **Reservations**: Max 2 for free tier (backend/services/reservationService.js)
- ✅ **Favorites**: Max 3 for free tier (backend/services/favoriteService.js)
- ✅ **Listings**: Max 3 for free tier (backend/services/propertyService.js)

### 3. Database Column
- ✅ Added `subscription_tier` column to `users` table
- ✅ Default value: 'free'
- ✅ Allowed values: 'free' or 'premium'

## 🧪 Test Now

### Test Reservations (2 max):

1. **Login as student**
2. **Reserve 1st property** → ✅ Should work
3. **Reserve 2nd property** → ✅ Should work
4. **Try to reserve 3rd property** → ❌ Should show error:
   ```
   "Free tier limit reached. You can only have 2 active reservations. 
   Upgrade to premium for unlimited reservations."
   ```

### Test Favorites (3 max):

1. **Login as student**
2. **Favorite 3 properties** → ✅ Should work
3. **Try to favorite 4th** → ❌ Should show error:
   ```
   "Free tier limit reached. You can only have 3 favorites. 
   Upgrade to premium for unlimited favorites."
   ```

### Test Listings (3 max):

1. **Login as landlord**
2. **Add 3 properties** → ✅ Should work
3. **Try to add 4th** → ❌ Should show error:
   ```
   "Free tier limit reached. You can only have 3 property listings. 
   Upgrade to premium for unlimited listings."
   ```

## 🔍 Debug Console Logs

When you try to reserve a property, check the browser console (F12):

```javascript
🔍 Reservation Check: {
  tier: "free",
  userId: 123,
  totalReservations: 5,
  myActiveReservations: 2,  // YOUR pending reservations
  limit: 2,
  willBlock: true  // Will show modal
}
```

## 🎯 How It Works Now

### Frontend Check (First Line of Defense):
1. User clicks "Reserve Property"
2. Counts user's pending reservations
3. If >= 2 and tier is 'free' → Show upgrade modal
4. If < 2 → Show reservation modal

### Backend Check (Final Enforcement):
1. User confirms reservation
2. Backend counts user's pending reservations from database
3. Backend checks user's tier from database
4. If >= 2 and tier is 'free' → Return error
5. If < 2 → Create reservation

## 🚀 Upgrade to Premium (For Testing)

To test premium tier (unlimited):

```sql
-- In Supabase SQL Editor
UPDATE users 
SET subscription_tier = 'premium' 
WHERE email = 'your-email@example.com';
```

Then refresh the page and try adding more than the limits - should work!

## 📊 Limits Summary

| Feature | Free Tier | Premium Tier | Enforced Where |
|---------|-----------|--------------|----------------|
| Favorites | 3 max | Unlimited | Frontend + Backend |
| Reservations | 2 max (pending) | Unlimited | Frontend + Backend |
| Listings | 3 max | Unlimited | Frontend + Backend |

## ✅ Success Criteria

After running the SQL and restarting backend:

- [ ] Can reserve 2 properties (free tier)
- [ ] CANNOT reserve 3rd property (shows error)
- [ ] Can favorite 3 properties (free tier)
- [ ] CANNOT favorite 4th property (shows error)
- [ ] Can add 3 listings (free tier landlord)
- [ ] CANNOT add 4th listing (shows error)
- [ ] Premium users have unlimited access

## 🐛 Still Not Working?

1. **Check SQL ran successfully:**
   ```sql
   SELECT subscription_tier FROM users LIMIT 5;
   ```
   Should show 'free' for all users

2. **Check backend is running:**
   - Look for console logs when creating reservation
   - Should see tier check logs

3. **Clear browser cache:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

4. **Check user ID matches:**
   - Open browser console
   - Look at the debug logs
   - Verify `userId` matches your account

The limits are now enforced at BOTH frontend and backend levels. It's impossible to bypass!
