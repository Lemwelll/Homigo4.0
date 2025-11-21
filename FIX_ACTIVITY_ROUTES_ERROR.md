# Fix Activity Routes 404 Error

## Errors Found

### 1. Import Statement in Wrong Place
**Error:** Activity routes import was inside the routes section instead of at the top
**Fix:** Moved import to top with other route imports

### 2. Supabase Raw SQL Syntax Error
**Error:** Used `supabase.raw('views + 1')` which doesn't exist in Supabase client
**Fix:** Changed to fetch current value, increment, then update

## Changes Made

### backend/server.js
```javascript
// BEFORE - Import in wrong place
// Escrow routes
app.use('/escrow', escrowRoutes);

// Activity routes
import activityRoutes from './routes/activityRoutes.js'; // ❌ Wrong place
app.use('/activities', activityRoutes);

// AFTER - Import at top
import activityRoutes from './routes/activityRoutes.js'; // ✅ Correct place
// ... other imports

// Then use it
app.use('/activities', activityRoutes);
```

### backend/services/activityService.js
```javascript
// BEFORE - Using non-existent supabase.raw()
const { data, error } = await supabase
  .from('properties')
  .update({ 
    views: supabase.raw('views + 1') // ❌ Doesn't exist
  })

// AFTER - Fetch, increment, update
const { data: property } = await supabase
  .from('properties')
  .select('views')
  .eq('id', propertyId)
  .single();

const newViews = (property.views || 0) + 1;

const { data, error } = await supabase
  .from('properties')
  .update({ views: newViews }) // ✅ Works correctly
```

## How to Fix

### Step 1: Restart Backend
```bash
# Stop the backend (Ctrl+C)
# Then restart
cd backend
npm run dev
```

### Step 2: Verify Routes
Check backend console for:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

### Step 3: Test Activity Endpoint
```bash
# Test the endpoint
curl -X POST http://localhost:5000/activities/track-view/YOUR_PROPERTY_ID
```

Should return:
```json
{
  "success": true,
  "message": "View tracked successfully",
  "data": { "views": 1 }
}
```

### Step 4: Refresh Frontend
```bash
# In browser console
localStorage.clear()
# Then refresh page (F5)
```

## Expected Result

After fixing:
- ✅ No more 404 errors
- ✅ Property views tracked correctly
- ✅ Dashboard shows real activity data
- ✅ View counts increment properly

## Testing

1. Visit any property details page
2. Check browser console - should see "✅ Property view tracked"
3. Check backend console - should see successful POST request
4. Refresh landlord dashboard
5. Total Views should increase

## Files Modified

1. `backend/server.js` - Fixed import placement
2. `backend/services/activityService.js` - Fixed view increment logic

## Status

✅ Import error fixed
✅ Supabase syntax error fixed
⏳ Restart backend to apply changes
