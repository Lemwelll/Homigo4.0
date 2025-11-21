# Quick Start: Fix Property Images

## The Problem
All properties showing the same image? Follow these steps to fix it.

## Quick Fix (5 minutes)

### Step 1: Test Current State
```bash
cd backend
node test-property-images.js
```

This will show you:
- How many properties have images
- Which images are duplicated
- What needs to be fixed

### Step 2: Fix Duplicate Images
If the test shows duplicates, run this SQL script:

**Option A: Using psql**
```bash
psql -d your_database_name -f database/fix_duplicate_images.sql
```

**Option B: Using Supabase Dashboard**
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Copy contents of `backend/database/fix_duplicate_images.sql`
4. Paste and run

### Step 3: Restart Backend
```bash
# Stop the backend (Ctrl+C)
# Then restart:
npm start
```

### Step 4: Clear Frontend Cache
In your browser:
1. Open DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.clear()`
4. Press Enter
5. Refresh the page (F5)

### Step 5: Verify
1. Go to Landlord Escrow page
2. Check if properties now show different images
3. ✅ Done!

## What the Fix Does

The SQL script assigns 10 different placeholder images to your properties:
- Modern bedroom
- Cozy living room
- Bright kitchen
- Stylish bathroom
- Spacious studio
- Contemporary apartment
- Minimalist room
- Urban loft
- Comfortable space
- Modern interior

Each property gets a unique image based on when it was created.

## Long-term Solution

Have landlords upload real photos:
1. Go to "My Properties"
2. Click "Edit" on each property
3. Upload actual photos
4. Much better user experience!

## Troubleshooting

### Images still the same?
1. Check browser console for errors
2. Verify backend restarted successfully
3. Make sure you cleared localStorage
4. Try hard refresh (Ctrl+Shift+R)

### SQL script failed?
1. Check database connection
2. Verify you have write permissions
3. Check Supabase logs for errors

### Need help?
Check the detailed guide: `PROPERTY_IMAGE_FIX_COMPLETE.md`

## Files Created

- ✅ `backend/test-property-images.js` - Test script
- ✅ `backend/database/fix_duplicate_images.sql` - Fix script
- ✅ `backend/database/check_property_images.sql` - Diagnostic queries
- ✅ `PROPERTY_IMAGE_FIX_COMPLETE.md` - Detailed guide
- ✅ `FIX_IMAGES_QUICK_START.md` - This file

## Expected Result

**Before:**
```
🏠 Property A → [same image]
🏠 Property B → [same image]
🏠 Property C → [same image]
```

**After:**
```
🏠 Property A → [unique image 1]
🏠 Property B → [unique image 2]
🏠 Property C → [unique image 3]
```

Much better! 🎉
