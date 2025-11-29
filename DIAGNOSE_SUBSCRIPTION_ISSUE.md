# Diagnose Subscription Issue - Step by Step

## The Problem
You're getting "Free tier limit reached" even though you should be premium.

## Step-by-Step Diagnosis

### Step 1: Check Backend Console Logs

When you try to add a property, look at your **backend terminal** (where you ran `npm start`).

You should see logs like:
```
🔍 PropertyService: Checking subscription for landlord: xxx
✅ PropertyService: Found subscription: premium
```

**If you see:**
```
⚠️ PropertyService: No active subscription found, defaulting to free
```

This means the subscription is NOT in the database!

### Step 2: Check Database

Open Supabase SQL Editor and run:

```sql
-- Check if subscriptions table exists
SELECT * FROM subscriptions LIMIT 1;
```

**If you get an error "relation subscriptions does not exist":**

The table doesn't exist! Create it:

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) UNIQUE,
    tier TEXT DEFAULT 'free',
    status TEXT DEFAULT 'active',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Step 3: Find Your User ID

```sql
SELECT id, email, full_name, role 
FROM users 
WHERE email = 'your-email@example.com';  -- YOUR EMAIL HERE
```

Copy the `id` value (it's a UUID like `123e4567-e89b-12d3-a456-426614174000`)

### Step 4: Create Your Premium Subscription

```sql
-- Replace 'YOUR-USER-ID-HERE' with the ID from Step 3
INSERT INTO subscriptions (user_id, tier, status, start_date, end_date)
VALUES (
    'YOUR-USER-ID-HERE',  -- PASTE YOUR USER ID HERE
    'premium',
    'active',
    NOW(),
    NOW() + INTERVAL '1 year'
)
ON CONFLICT (user_id) 
DO UPDATE SET 
    tier = 'premium',
    status = 'active',
    start_date = NOW(),
    end_date = NOW() + INTERVAL '1 year';
```

### Step 5: Verify Subscription Created

```sql
SELECT 
    s.*,
    u.email,
    u.full_name
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE u.email = 'your-email@example.com';  -- YOUR EMAIL HERE
```

**Expected result:**
```
tier: premium
status: active
user_id: (your user ID)
```

### Step 6: Restart Backend

**IMPORTANT:** You MUST restart the backend after changing the database!

```bash
# In your backend terminal, press Ctrl+C to stop
# Then restart:
cd backend
npm start
```

### Step 7: Clear Browser Cache

1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Click "Clear site data"
5. Reload page

OR just do:
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Step 8: Try Adding Property Again

1. Go to "Add Property" page
2. Fill out the form
3. Click "Add Property"

**Check backend console for:**
```
🔍 PropertyService: Checking subscription for landlord: xxx
✅ PropertyService: Found subscription: premium
🎯 PropertyService: User tier: premium
✅ PropertyService: Premium user, no limit check needed
```

## Common Issues

### Issue 1: Backend Not Showing Logs

**Problem:** You don't see any `🔍 PropertyService` logs

**Solution:** The backend code wasn't updated. Re-read the file:

```bash
cd backend
# Make sure you have the latest code
git pull  # if using git
# Or manually check backend/services/propertyService.js has the console.log statements
```

### Issue 2: Subscription Exists But Still Says Free

**Problem:** Database shows `tier: premium` but backend logs show `tier: free`

**Solution:** Backend is caching old data or not reading correctly.

1. Restart backend (Ctrl+C, then `npm start`)
2. Check backend logs show the subscription query
3. Verify the user_id matches

### Issue 3: "Cannot read property 'tier' of null"

**Problem:** Backend crashes when checking subscription

**Solution:** The subscription query is failing. Check:

```sql
-- Make sure user_id column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscriptions';
```

Should show:
- user_id (uuid)
- tier (text)
- status (text)

## Quick Fix Script

Run this in Supabase SQL Editor (replace email):

```sql
-- All-in-one fix
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id
    FROM users
    WHERE email = 'your-email@example.com';  -- CHANGE THIS
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found with that email';
    END IF;
    
    -- Create or update subscription
    INSERT INTO subscriptions (user_id, tier, status, start_date, end_date)
    VALUES (v_user_id, 'premium', 'active', NOW(), NOW() + INTERVAL '1 year')
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        tier = 'premium',
        status = 'active',
        start_date = NOW(),
        end_date = NOW() + INTERVAL '1 year';
    
    RAISE NOTICE 'Subscription created/updated for user %', v_user_id;
END $$;

-- Verify
SELECT 
    u.email,
    u.full_name,
    s.tier,
    s.status
FROM users u
JOIN subscriptions s ON u.id = s.user_id
WHERE u.email = 'your-email@example.com';  -- CHANGE THIS
```

## After Fix Checklist

- [ ] Subscription exists in database (tier='premium', status='active')
- [ ] Backend restarted
- [ ] Backend logs show "Found subscription: premium"
- [ ] Browser cache cleared
- [ ] Premium badge shows in UI (crown icon)
- [ ] Can add 4+ properties without error

## Still Not Working?

If you've done ALL the above and it's STILL not working:

1. **Check backend terminal** - What do the logs say?
2. **Check browser console** - Any errors?
3. **Check database** - Run the verification query
4. **Share the logs** - Copy the backend console output

The issue is 100% that either:
- Subscription doesn't exist in database
- Backend isn't reading it correctly
- Backend wasn't restarted after database change

Follow the steps above carefully and it WILL work!
