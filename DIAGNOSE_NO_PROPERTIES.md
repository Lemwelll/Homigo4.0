# Diagnosing: No Properties Showing in Student Browse

## Issue
Properties exist in database but don't show up on `/student/browse` page.

## Diagnostic Steps

### Step 1: Check if Backend is Running
```bash
# Backend should be running on http://localhost:5000
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Homigo API is running",
  "timestamp": "2025-11-19T..."
}
```

### Step 2: Check if Properties Exist in Database
Open your Supabase dashboard and run:
```sql
SELECT id, title, verification_status 
FROM properties;
```

**Check:**
- Are there any properties?
- What is their `verification_status`?
- Should be `'verified'` to show up

### Step 3: Test API Endpoint Directly
```bash
curl http://localhost:5000/properties/verified
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Property Title",
      "verification_status": "verified",
      ...
    }
  ]
}
```

### Step 4: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Go to Network tab
5. Refresh page
6. Look for `/properties/verified` request
7. Check response

### Step 5: Check Frontend API URL
The StudentContext is using:
```javascript
const API_URL = 'http://localhost:5000'
```

Make sure your backend is running on port 5000.

## Common Issues & Solutions

### Issue 1: No Verified Properties
**Symptom:** API returns empty array `[]`

**Solution:** Verify properties in admin panel or run SQL:
```sql
UPDATE properties 
SET verification_status = 'verified' 
WHERE verification_status = 'pending_verification';
```

### Issue 2: Backend Not Running
**Symptom:** Network error in console, "Failed to fetch"

**Solution:**
```bash
cd backend
npm start
```

### Issue 3: CORS Error
**Symptom:** Console shows CORS policy error

**Solution:** Check `backend/server.js` has:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue 4: Wrong Port
**Symptom:** Connection refused

**Solution:** 
- Backend should run on port 5000
- Frontend should run on port 5173
- Check `.env` file in backend

### Issue 5: Data Transformation Error
**Symptom:** Properties fetch but don't display

**Solution:** Check browser console for JavaScript errors in data transformation

## Quick Fix Script

Run this in your Supabase SQL editor to verify all properties:

```sql
-- Verify all pending properties
UPDATE properties 
SET verification_status = 'verified' 
WHERE verification_status = 'pending_verification';

-- Check results
SELECT 
  id,
  title,
  location,
  rent_price,
  verification_status,
  created_at
FROM properties
ORDER BY created_at DESC;
```

## Test the Fix

1. Run the SQL above
2. Refresh the student browse page
3. Properties should now appear

## Still Not Working?

### Check Property Images
Properties need at least one image:
```sql
SELECT 
  p.id,
  p.title,
  COUNT(pi.id) as image_count
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
GROUP BY p.id, p.title;
```

If `image_count` is 0, add a default image:
```sql
INSERT INTO property_images (property_id, image_url, is_primary, display_order)
SELECT 
  id,
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
  true,
  0
FROM properties
WHERE id NOT IN (SELECT DISTINCT property_id FROM property_images);
```

## Debug Mode

Add this to `StudentContext.jsx` temporarily:
```javascript
const fetchVerifiedProperties = async () => {
  try {
    setLoading(true)
    console.log('Fetching from:', `${API_URL}/properties/verified`)
    const response = await fetch(`${API_URL}/properties/verified`)
    console.log('Response status:', response.status)
    const data = await response.json()
    console.log('Response data:', data)

    if (data.success) {
      console.log('Number of properties:', data.data.length)
      console.log('First property:', data.data[0])
      // ... rest of code
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
  } finally {
    setLoading(false)
  }
}
```

Then check browser console for detailed logs.
