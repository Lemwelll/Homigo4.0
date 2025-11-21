# Fix: No Properties Showing in Student Browse

## Problem
The Student Browse page is not showing any properties even though there is data in the database.

## Root Cause
Properties in the database have `verification_status = 'pending_verification'` but the student browse page only shows properties with `verification_status = 'verified'`.

## Solution Options

### Option 1: Verify Properties via Admin Panel (Recommended)
1. Login as admin
2. Go to Admin > Verifications page
3. Verify the properties you want students to see

### Option 2: Manually Update Database (Quick Fix for Testing)
Run this SQL query in your Supabase SQL Editor:

```sql
-- Check current verification status
SELECT id, title, verification_status FROM properties;

-- Update all properties to verified (for testing only)
UPDATE properties 
SET verification_status = 'verified' 
WHERE verification_status = 'pending_verification';

-- Verify the update
SELECT id, title, verification_status FROM properties;
```

### Option 3: Update Seed Data
If you want properties to be verified by default when seeding, update your `backend/database/seed.sql`:

```sql
-- Change this line in seed.sql
verification_status = 'pending_verification'

-- To this
verification_status = 'verified'
```

## How to Check if Properties are Verified

### Via API:
```bash
# Check verified properties (what students see)
curl http://localhost:5000/properties/verified

# Should return properties with verification_status = 'verified'
```

### Via Browser Console:
```javascript
// Open browser console on Student Browse page
fetch('http://localhost:5000/properties/verified')
  .then(r => r.json())
  .then(d => console.log(d))
```

## Verification Workflow

```
Landlord adds property
        ↓
Status: pending_verification
        ↓
Admin reviews property
        ↓
Admin verifies/rejects
        ↓
Status: verified (shows to students)
   OR
Status: rejected (hidden from students)
```

## Quick Test

1. **Check if backend is running**: `http://localhost:5000`
2. **Check API response**: `http://localhost:5000/properties/verified`
3. **Expected**: Should return array of properties
4. **If empty**: Properties need to be verified first

## After Verification

Once properties are verified, they will automatically appear in:
- Student Browse page
- Public Listings page
- Property search results
