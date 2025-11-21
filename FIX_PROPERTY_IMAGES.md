# Fix Property Images Showing Same Image

## Problem
All properties in the escrow/booking pages are showing the same image instead of their unique property images.

## Possible Causes
1. All properties in database actually have the same image URL
2. Images aren't being properly fetched from the database
3. Frontend is using a fallback image for all properties

## Diagnosis Steps

### Step 1: Check Database
Run this SQL query to see what images are actually in the database:

```sql
-- See all property images
SELECT 
  p.id,
  p.title,
  pi.image_url,
  pi.is_primary
FROM properties p
LEFT JOIN property_images pi ON p.id = pi.property_id
ORDER BY p.title, pi.is_primary DESC;
```

### Step 2: Check API Response
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to Landlord Escrow page
4. Look for the `/escrow/landlord` API call
5. Check the response - does each property have different `property_images`?

### Step 3: Check Frontend Transformation
Look at the EscrowContext.jsx line 59:
```javascript
propertyImage: escrow.properties?.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
```

## Solutions Applied

### Backend Fix
Updated `backend/services/escrowService.js` to:
1. Ensure property_images are properly joined
2. Sort images so primary image comes first
3. Return properly structured data

### Frontend Fix
The EscrowContext already correctly extracts the first image from the array.

## If Images Are Actually the Same in Database

This means landlords uploaded the same image for all properties. To fix:

1. **Option A: Re-upload Properties**
   - Landlords need to edit their properties and upload unique images

2. **Option B: Use Different Placeholder Images**
   - Update the fallback to use different Unsplash images based on property ID

## Testing
1. Check database with SQL query above
2. If all images are the same URL, that's the root cause
3. Landlords need to upload unique images for each property
4. Or we can assign different placeholder images temporarily
