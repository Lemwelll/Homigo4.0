# Property Availability Troubleshooting Guide

## Quick Diagnosis

### Problem: Property still shows as available after booking approval

#### Step 1: Check Backend Logs
Look for these messages in your backend console:
```
🔍 DEBUG: Checking escrow payments...
🏠 Property "Title" (ID: xxx): { hasApprovedBooking: true, ... }
🚫 Property "Title" is UNAVAILABLE
```

If you don't see these logs, the backend might not be checking correctly.

#### Step 2: Check Database
```sql
-- Check booking status
SELECT id, status, property_id 
FROM bookings 
WHERE property_id = 'YOUR_PROPERTY_ID';

-- Check escrow status
SELECT id, status, property_id 
FROM escrow_transactions 
WHERE property_id = 'YOUR_PROPERTY_ID';
```

Expected results:
- Booking status should be 'approved', 'active', or 'completed'
- Escrow status should be 'released'

#### Step 3: Check API Response
```bash
curl http://localhost:5000/properties/verified | jq '.data[] | select(.id=="YOUR_PROPERTY_ID")'
```

Expected: `"isRented": true`

#### Step 4: Clear Cache
```javascript
// In browser console
localStorage.clear()
location.reload()
```

Or restart backend to clear server cache:
```bash
# Ctrl+C to stop backend
npm start
```

---

## Common Issues

### Issue 1: Backend says property is unavailable, but frontend shows it as available

**Cause**: Frontend cache or stale data

**Solution**:
```javascript
// Browser console
localStorage.clear()
sessionStorage.clear()
location.reload()
```

**Prevention**: Implement cache invalidation when booking is approved

---

### Issue 2: Property shows as unavailable but should be available

**Cause**: Booking or escrow not properly cancelled/refunded

**Solution**:
```sql
-- Check current status
SELECT b.status, e.status 
FROM bookings b
LEFT JOIN escrow_transactions e ON e.booking_id = b.id
WHERE b.property_id = 'YOUR_PROPERTY_ID';

-- Fix: Cancel booking
UPDATE bookings 
SET status = 'cancelled', updated_at = NOW()
WHERE property_id = 'YOUR_PROPERTY_ID';

-- Fix: Refund escrow
UPDATE escrow_transactions 
SET status = 'refunded', refunded_date = NOW()
WHERE property_id = 'YOUR_PROPERTY_ID';
```

---

### Issue 3: Multiple students can book the same property

**Cause**: Race condition or missing validation

**Solution**: Add database constraint
```sql
-- Create unique index to prevent multiple active bookings
CREATE UNIQUE INDEX idx_one_active_booking_per_property 
ON bookings (property_id) 
WHERE status IN ('approved', 'active', 'completed');
```

**Backend validation** (already implemented):
```javascript
// In bookingService.js
export const hasActiveBooking = async (propertyId) => {
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('property_id', propertyId)
    .in('status', ['confirmed', 'active'])
    .limit(1);
  return bookings && bookings.length > 0;
};
```

---

### Issue 4: Escrow released but property still available

**Cause**: Backend not checking escrow_payments table

**Solution**: Already implemented in `propertyService.js`:
```javascript
// Checks BOTH tables
const [escrowPaymentsResult, escrowTransactionsResult] = await Promise.all([
  supabase.from('escrow_payments').select('property_id, status')
    .in('property_id', propertyIds).eq('status', 'released'),
  supabase.from('escrow_transactions').select('property_id, status')
    .in('property_id', propertyIds).eq('status', 'released')
]);
```

**Verify**: Check both tables
```sql
SELECT 'escrow_payments' as table_name, * 
FROM escrow_payments 
WHERE property_id = 'YOUR_PROPERTY_ID' AND status = 'released'
UNION ALL
SELECT 'escrow_transactions' as table_name, * 
FROM escrow_transactions 
WHERE property_id = 'YOUR_PROPERTY_ID' AND status = 'released';
```

---

### Issue 5: Frontend buttons not disabled

**Cause**: Missing `property.isRented` check

**Solution**: Verify in component:
```jsx
// StudentBrowse.jsx
<button
  disabled={property.isRented}
  className={property.isRented ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'}
>
  {property.isRented ? 'Not Available' : 'View Details'}
</button>

// PropertyDetails.jsx
<button
  onClick={handleReserveProperty}
  disabled={alreadyReserved || property.isRented}
>
  {property.isRented ? 'Property Not Available' : 'Reserve Property'}
</button>
```

---

### Issue 6: Property available immediately after approval

**Cause**: Cache not cleared

**Solution**: Add cache invalidation in `bookingController.js`:
```javascript
export const updateBookingStatus = async (req, res) => {
  // ... existing code ...
  
  if (status === 'approved') {
    // Clear properties cache
    propertiesCache.clear();
  }
  
  // ... rest of code ...
};
```

---

### Issue 7: Backend logs not showing availability checks

**Cause**: Logs might be disabled or not visible

**Solution**: Enable debug logging
```javascript
// In propertyService.js
console.log('🔍 DEBUG: Checking escrow payments...');
console.log('Property IDs:', propertyIds);
console.log('Escrow Payments Result:', JSON.stringify(escrowPaymentsResult.data, null, 2));
```

**Check logs**:
```bash
# Backend console should show:
🔍 DEBUG: Checking escrow payments...
Property IDs: [ 'abc-123', 'def-456' ]
🏠 Property "Test Property" (ID: abc-123): {
  hasApprovedBooking: true,
  isUnavailable: true
}
🚫 Property "Test Property" is UNAVAILABLE
```

---

## Debugging Checklist

Use this checklist to diagnose issues:

### Backend Checks
- [ ] Backend is running (`npm start` in backend folder)
- [ ] Database connection is working
- [ ] Booking status is 'approved', 'active', or 'completed'
- [ ] Escrow status is 'released'
- [ ] Backend logs show availability checks
- [ ] API returns `isRented: true`

### Frontend Checks
- [ ] Frontend is running (`npm run dev`)
- [ ] Browser console shows no errors
- [ ] StudentContext has correct property data
- [ ] Property has `isRented: true` in state
- [ ] Buttons are disabled
- [ ] "NOT AVAILABLE" badge is visible

### Database Checks
- [ ] Bookings table has approved booking
- [ ] Escrow table has released escrow
- [ ] Property ID matches across tables
- [ ] No conflicting data

---

## Testing Commands

### Quick Test Script
```bash
# 1. Check backend is running
curl http://localhost:5000/health

# 2. Get properties
curl http://localhost:5000/properties/verified | jq '.data[] | {id, title, isRented}'

# 3. Check specific property
curl http://localhost:5000/properties/YOUR_PROPERTY_ID | jq '.data.isRented'

# 4. Check backend logs
# Look for "🔍 DEBUG" messages in backend console
```

### Database Quick Check
```sql
-- One query to check everything
SELECT 
  p.title,
  b.status as booking_status,
  e.status as escrow_status,
  CASE 
    WHEN b.status IN ('approved', 'active', 'completed') 
      OR e.status = 'released' 
    THEN 'UNAVAILABLE' 
    ELSE 'AVAILABLE' 
  END as should_be
FROM properties p
LEFT JOIN bookings b ON b.property_id = p.id
LEFT JOIN escrow_transactions e ON e.property_id = p.id
WHERE p.id = 'YOUR_PROPERTY_ID';
```

---

## Emergency Fixes

### Reset Everything (Development Only)
```sql
-- WARNING: This will reset all bookings and escrow
-- Only use in development/testing

-- Reset bookings
UPDATE bookings SET status = 'pending' WHERE status IN ('approved', 'active', 'completed');

-- Reset escrow
UPDATE escrow_transactions SET status = 'held', released_date = NULL WHERE status = 'released';
UPDATE escrow_payments SET status = 'held', released_date = NULL WHERE status = 'released';

-- Clear backend cache
-- Restart backend server
```

### Make Specific Property Available
```sql
-- Replace YOUR_PROPERTY_ID with actual ID
UPDATE bookings 
SET status = 'cancelled' 
WHERE property_id = 'YOUR_PROPERTY_ID';

UPDATE escrow_transactions 
SET status = 'refunded' 
WHERE property_id = 'YOUR_PROPERTY_ID';

UPDATE escrow_payments 
SET status = 'refunded' 
WHERE property_id = 'YOUR_PROPERTY_ID';
```

### Make Specific Property Unavailable
```sql
-- Replace YOUR_PROPERTY_ID, STUDENT_ID, LANDLORD_ID with actual IDs
INSERT INTO bookings (
  property_id, student_id, landlord_id,
  move_in_date, duration_months, amount_paid,
  status
) VALUES (
  'YOUR_PROPERTY_ID',
  'STUDENT_ID',
  'LANDLORD_ID',
  CURRENT_DATE,
  12,
  5000,
  'approved'
);
```

---

## Performance Issues

### Slow Property Loading

**Symptom**: Properties take > 2 seconds to load

**Diagnosis**:
```bash
# Measure API response time
time curl http://localhost:5000/properties/verified
```

**Solutions**:

1. **Enable caching** (already implemented):
```javascript
const CACHE_DURATION = 30000; // 30 seconds
```

2. **Add database indexes**:
```sql
CREATE INDEX idx_bookings_property_status ON bookings(property_id, status);
CREATE INDEX idx_escrow_property_status ON escrow_transactions(property_id, status);
CREATE INDEX idx_properties_verification ON properties(verification_status);
```

3. **Use materialized view**:
```sql
CREATE MATERIALIZED VIEW fast_verified_properties AS
SELECT p.*, 
  CASE WHEN EXISTS (
    SELECT 1 FROM bookings b 
    WHERE b.property_id = p.id 
    AND b.status IN ('approved', 'active', 'completed')
  ) THEN true ELSE false END as is_rented
FROM properties p
WHERE p.verification_status = 'verified';

-- Refresh periodically
REFRESH MATERIALIZED VIEW fast_verified_properties;
```

---

## Contact Support

If issues persist after trying all solutions:

1. **Collect Information**:
   - Backend logs (last 50 lines)
   - Database query results
   - API response
   - Browser console errors
   - Screenshots of issue

2. **Create Issue Report**:
   ```
   Issue: Property availability not working
   
   Environment:
   - Backend: Running/Not Running
   - Database: PostgreSQL/Supabase
   - Browser: Chrome/Firefox/Safari
   
   Steps to Reproduce:
   1. ...
   2. ...
   
   Expected: Property should be unavailable
   Actual: Property shows as available
   
   Database Check:
   - Booking status: approved
   - Escrow status: released
   
   API Response:
   - isRented: false (should be true)
   
   Logs: [attach logs]
   ```

---

## Prevention Tips

1. **Always check both tables**: `escrow_transactions` and `escrow_payments`
2. **Clear cache after status changes**: Restart backend or clear cache
3. **Use database constraints**: Prevent multiple active bookings
4. **Enable logging**: Keep debug logs enabled during development
5. **Test thoroughly**: Use the test scripts provided
6. **Monitor performance**: Check API response times regularly

---

## Summary

The property availability system is **fully functional**. Most issues are caused by:
1. Cache not being cleared
2. Database status not updated correctly
3. Frontend not receiving updated data

Follow this troubleshooting guide to quickly identify and fix any issues.
