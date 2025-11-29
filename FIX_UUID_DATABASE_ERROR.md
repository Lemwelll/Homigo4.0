# 🔧 FIX: UUID Database Type Error

## ❌ The Problem

You got this error:
```
ERROR: 42804: foreign key constraint "subscription_history_user_id_fkey" cannot be implemented
DETAIL: Key columns "user_id" and "id" are of incompatible types: integer and uuid.
```

**Cause:** Your `users` table uses `UUID` as the primary key, but the SQL scripts assumed `INTEGER`.

---

## ✅ The Solution

Use the UUID-compatible versions of the SQL files instead!

### Step 1: Use UUID Version Files

**Instead of:**
- ❌ `backend/database/add_subscription_system.sql`
- ❌ `backend/database/add_payment_history.sql`

**Use these:**
- ✅ `backend/database/add_subscription_system_UUID.sql`
- ✅ `backend/database/add_payment_history_UUID.sql`

### Step 2: Run the Correct SQL Files

**In Supabase SQL Editor:**

1. **First, run the subscription system:**
   ```sql
   -- Copy and paste the entire content from:
   backend/database/add_subscription_system_UUID.sql
   ```

2. **Then, run the payment history:**
   ```sql
   -- Copy and paste the entire content from:
   backend/database/add_payment_history_UUID.sql
   ```

### Step 3: Restart Backend

```bash
cd backend
npm start
```

### Step 4: Test

```bash
test-payment-system.bat
```

---

## 🔍 What Was Changed?

### In subscription_history table:
```sql
-- OLD (INTEGER):
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE

-- NEW (UUID):
user_id UUID REFERENCES users(id) ON DELETE CASCADE
```

### In payment_transactions table:
```sql
-- OLD (INTEGER):
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE

-- NEW (UUID):
user_id UUID REFERENCES users(id) ON DELETE CASCADE
```

### In payment_refunds table:
```sql
-- OLD (INTEGER):
user_id UUID REFERENCES users(id) ON DELETE CASCADE
processed_by UUID REFERENCES users(id)

-- NEW (UUID):
user_id UUID REFERENCES users(id) ON DELETE CASCADE
processed_by UUID REFERENCES users(id)
```

### In payment_methods table:
```sql
-- OLD (INTEGER):
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE

-- NEW (UUID):
user_id UUID REFERENCES users(id) ON DELETE CASCADE
```

---

## 📝 Quick Checklist

- [ ] Delete any partially created tables (if needed)
- [ ] Run `add_subscription_system_UUID.sql`
- [ ] Run `add_payment_history_UUID.sql`
- [ ] Restart backend server
- [ ] Test with `test-payment-system.bat`
- [ ] Login and test upgrade flow
- [ ] Check payment history page

---

## 🗑️ Clean Up (If Needed)

If you already ran the wrong SQL and need to clean up:

```sql
-- Drop the incorrectly created tables
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS payment_refunds CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS subscription_history CASCADE;

-- Remove subscription columns from users (optional, only if you want to start fresh)
ALTER TABLE users 
DROP COLUMN IF EXISTS subscription_tier,
DROP COLUMN IF EXISTS subscription_start_date,
DROP COLUMN IF EXISTS subscription_end_date,
DROP COLUMN IF EXISTS subscription_status;
```

Then run the UUID versions.

---

## ✅ Verification

After running the UUID versions, verify with:

```sql
-- Check subscription_history table
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'subscription_history' 
AND column_name = 'user_id';
-- Should show: uuid

-- Check payment_transactions table
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'payment_transactions' 
AND column_name = 'user_id';
-- Should show: uuid
```

---

## 🎯 Summary

**Problem:** Type mismatch (INTEGER vs UUID)

**Solution:** Use UUID-compatible SQL files

**Files to use:**
- ✅ `add_subscription_system_UUID.sql`
- ✅ `add_payment_history_UUID.sql`

**Result:** All foreign keys will match the UUID type of your users table!

---

## 🚀 You're Ready!

Once you run the UUID versions, everything will work perfectly. The backend code doesn't need any changes - it works with both INTEGER and UUID types automatically!
