# 🧪 Testing Approved Booking Unavailability Flow

## Quick Test Guide

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- At least one verified property in the database
- Student account and landlord account

---

## Test Case 1: Property Becomes Unavailable After Approval

### Step 1: Student Submits Booking Request
1. Login as **Student**
2. Browse properties
3. Click on a property
4. Click **"Book Now"** or **"Reserve Property"**
5. Complete the payment form
6. Submit booking request

**Expected Result**: 
- ✅ Booking created with status `pending`
- ✅ Property still shows as available in browse

### Step 2: Landlord Approves Booking
1. Open a new browser/incognito window
2. Login as **Landlord** (owner of the property)
3. Go to **"Bookings"** page
4. Find the pending booking request
5. Click **"Approve"** button

**Expected Result**: 
- ✅ Booking status changes to `approved`
- ✅ Success message displayed

### Step 3: Verify Property is Unavailable
1. Go back to **Student** browser
2. Refresh the browse page
3. Find the property that was just booked

**Expected Result**: 
- ✅ Property shows **"NOT AVAILABLE"** badge
- ✅ Property image is grayscale with dark overlay
- ✅ Favorite button is disabled (grayed out)
- ✅ "View Details" button shows "Not Available"
- ✅ Property card has gray background

### Step 4: Check Property Details Page
1. Click on the unavailable property
2. View the property details page

**Expected Result**: 
- ✅ **"Reserve Property"** button is disabled
- ✅ Button text shows "Property Not Available"
- ✅ **"Book Now"** button is disabled
- ✅ Button text shows "Property Not Available"
- ✅ **"Message Landlord"** button is still enabled

---

## Test Case 2: Property Remains Available After Rejection

### Step 1: Student Submits Booking Request
1. Login as **Student**
2. Submit a booking request for a property

### Step 2: Landlord Rejects Booking
1. Login as **Landlord**
2. Go to **"Bookings"** page
3. Find the pending booking request
4. Click **"Reject"** button

**Expected Result**: 
- ✅ Booking status changes to `rejected`
- ✅ Escrow is refunded to student

### Step 3: Verify Property is Still Available
1. Go back to **Student** browser
2. Refresh the browse page
3. Find the property

**Expected Result**: 
- ✅ Property shows as **AVAILABLE** (no "NOT AVAILABLE" badge)
- ✅ Property image is in full color
- ✅ Favorite button is enabled
- ✅ "View Details" button is enabled
- ✅ All actions work normally

---

## Test Case 3: Escrow Release Makes Property Unavailable

### Step 1: Approve a Booking
1. Follow Test Case 1 steps 1-2
2. Booking is now approved

### Step 2: Landlord Accepts Escrow
1. Login as **Landlord**
2. Go to **"Escrow"** page
3. Find the escrow payment for the approved booking
4. Click **"Accept Payment"** button

**Expected Result**: 
- ✅ Escrow status changes to `released`
- ✅ Funds are released to landlord

### Step 3: Verify Property Remains Unavailable
1. Go back to **Student** browser
2. Refresh the browse page
3. Find the property

**Expected Result**: 
- ✅ Property still shows **"NOT AVAILABLE"**
- ✅ All actions remain disabled
- ✅ Property is marked as unavailable due to released escrow

---

## Test Case 4: Multiple Students Cannot Book Same Property

### Step 1: First Student Books Property
1. Login as **Student 1**
2. Submit booking request for Property A
3. Landlord approves the booking

### Step 2: Second Student Tries to Book
1. Login as **Student 2** (different account)
2. Browse properties
3. Try to find Property A

**Expected Result**: 
- ✅ Property A shows as **"NOT AVAILABLE"**
- ✅ Student 2 cannot favorite the property
- ✅ Student 2 cannot reserve the property
- ✅ Student 2 cannot book the property
- ✅ Student 2 can only message the landlord

---

## Visual Verification Checklist

### Available Property ✅
- [ ] Property image is in full color
- [ ] No dark overlay on image
- [ ] No "NOT AVAILABLE" badge
- [ ] Favorite button is clickable (white/red)
- [ ] "View Details" button is blue
- [ ] Property card has white background

### Unavailable Property ❌
- [ ] Property image is grayscale
- [ ] Dark overlay covers the image
- [ ] Large "NOT AVAILABLE" badge in center
- [ ] Favorite button is grayed out and disabled
- [ ] "Not Available" button is gray
- [ ] Property card has gray background
- [ ] Price badge is gray instead of blue

---

## Database Verification

Run this SQL to check property status:

```sql
-- Check if property has approved bookings
SELECT 
    p.title,
    b.status,
    b.created_at
FROM properties p
JOIN bookings b ON p.id = b.property_id
WHERE p.id = 'YOUR_PROPERTY_ID'
AND b.status IN ('approved', 'active', 'completed');

-- Check if property has released escrow
SELECT 
    p.title,
    e.status,
    e.amount
FROM properties p
LEFT JOIN escrow_payments e ON p.id = e.property_id
WHERE p.id = 'YOUR_PROPERTY_ID'
AND e.status = 'released';
```

Or use the provided script:
```bash
# Run the check script
psql -U your_username -d your_database -f CHECK_APPROVED_BOOKINGS.sql
```

---

## API Testing

### Test Property Availability Endpoint

```bash
# Get all verified properties
curl http://localhost:5000/properties/verified

# Check response for isRented field
# Properties with approved bookings should have isRented: true
```

### Expected Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "property-uuid",
      "title": "Property Title",
      "isRented": true,  // ← Should be true for approved bookings
      "rent_price": 5000,
      ...
    }
  ]
}
```

---

## Console Logs to Watch

### Backend Console
```
🏠 Property "Property Title" (ID: xxx):
  hasApprovedBooking: true
  hasReleasedEscrowPayment: false
  hasReleasedEscrowTransaction: false
  hasReleasedEscrow: false
  isUnavailable: true

🚫 Property "Property Title" is UNAVAILABLE (has approved booking)
```

### Frontend Console
```
✅ Property view tracked
📊 Fetched 10 properties, 2 are unavailable/booked
```

---

## Troubleshooting

### Property Not Showing as Unavailable

1. **Check booking status**:
   ```sql
   SELECT status FROM bookings WHERE property_id = 'xxx';
   ```
   - Should be `approved`, `active`, or `completed`

2. **Check backend logs**:
   - Look for "Property is UNAVAILABLE" message
   - Verify `isRented` field is set to `true`

3. **Clear browser cache**:
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

4. **Restart backend**:
   ```bash
   cd backend
   npm start
   ```

### Actions Not Disabled

1. **Check property object**:
   - Open browser console
   - Type: `console.log(property.isRented)`
   - Should return `true`

2. **Verify frontend code**:
   - Check `disabled={property.isRented}` is present on buttons

---

## Success Criteria

✅ Property shows "NOT AVAILABLE" after booking approval
✅ Favorite button is disabled for unavailable properties
✅ Reserve/Book buttons are disabled for unavailable properties
✅ Property remains available after booking rejection
✅ Multiple students cannot book the same property
✅ Visual indicators clearly show unavailable status
✅ Backend correctly identifies approved bookings
✅ Frontend correctly displays unavailable properties

---

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________

Test Case 1: Property Becomes Unavailable After Approval
- Student submits booking: [ ] Pass [ ] Fail
- Landlord approves booking: [ ] Pass [ ] Fail
- Property shows unavailable: [ ] Pass [ ] Fail
- Actions are disabled: [ ] Pass [ ] Fail

Test Case 2: Property Remains Available After Rejection
- Student submits booking: [ ] Pass [ ] Fail
- Landlord rejects booking: [ ] Pass [ ] Fail
- Property shows available: [ ] Pass [ ] Fail
- Actions are enabled: [ ] Pass [ ] Fail

Test Case 3: Escrow Release Makes Property Unavailable
- Booking approved: [ ] Pass [ ] Fail
- Escrow released: [ ] Pass [ ] Fail
- Property unavailable: [ ] Pass [ ] Fail

Test Case 4: Multiple Students Cannot Book Same Property
- First student books: [ ] Pass [ ] Fail
- Second student blocked: [ ] Pass [ ] Fail

Overall Result: [ ] All Tests Passed [ ] Some Tests Failed

Notes:
_________________________________
_________________________________
```

---

## 🎉 All Tests Passed?

Congratulations! The approved booking unavailability system is working correctly. Students can now only see and interact with properties that are actually available for booking.
