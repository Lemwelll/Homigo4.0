# ⚡ FIX SUBSCRIPTION NOW - 3 STEPS

## The Problem
✅ Subscription works in frontend  
❌ **NOT saved to database** (tables don't exist yet!)

---

## The Fix (3 Steps - 5 Minutes)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project
2. Click "SQL Editor" in left sidebar
3. Click "New Query"

### Step 2: Run These 2 SQL Files

**First SQL:**
```
File: backend/database/add_subscription_system_UUID.sql
Action: Copy entire file → Paste in SQL Editor → Click "Run"
```

**Second SQL:**
```
File: backend/database/add_payment_history_UUID.sql  
Action: Copy entire file → Paste in SQL Editor → Click "Run"
```

### Step 3: Restart Backend
```bash
cd backend
npm start
```

---

## Test It Works

1. Login as student
2. Go to `/upgrade`
3. Pay ₱149
4. **Refresh page** → Should still show "Premium" ✅
5. Go to `/payment-history` → Should see transaction ✅

---

## Why This Fixes It

**Before:**
- Backend tries to save to `users.subscription_tier`
- Column doesn't exist → Error
- Tier resets on refresh

**After:**
- SQL creates the columns and tables
- Backend saves successfully
- Tier persists forever ✅

---

## Files to Use

⚠️ **IMPORTANT:** Use the **UUID versions**!

✅ `backend/database/add_subscription_system_UUID.sql`  
✅ `backend/database/add_payment_history_UUID.sql`

❌ NOT the regular versions (those are for INTEGER IDs)

---

## Quick Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Ran `add_subscription_system_UUID.sql`
- [ ] Ran `add_payment_history_UUID.sql`
- [ ] Restarted backend
- [ ] Tested upgrade
- [ ] Verified tier persists after refresh

---

**Do this now and subscriptions will save to database!** 🚀

See `RUN_THIS_NOW_SUBSCRIPTION_FIX.md` for detailed guide.  
See `SUBSCRIPTION_DATABASE_SETUP.txt` for visual guide.
