# Option A: Comprehensive Testing Guide for Task 3 (Student Features)

## 🎯 Overview

This guide will help you test all Student features end-to-end to ensure they work correctly with the backend database.

## 📋 Pre-Testing Setup

### 1. Start Backend Server
```bash
cd backend
npm start
```
Expected output: `Server running on port 5000`

### 2. Start Frontend
```bash
npm run dev
```
Expected output: `Local: http://localhost:5173`

### 3. Setup Database
Run the consolidated schema in Supabase:
- Go to Supabase Dashboard → SQL Editor
- Run `backend/database/schema.sql`
- Run `backend/database/setup_admin_and_verify.sql`

### 4. Create Test Data
You need at least:
- 1 admin account (created by setup script)
- 1 landlord account (register via UI)
- 1 student account (register via UI)
- 2-3 properties (created by landlord, verified by admin)

## 🧪 Task 3.1: Test Property Browsing

### Test Case 1: View Verified Properties Only
**Steps:**
1. Login as student
2. Navigate to `/student/browse`
3. Observe the properties displayed

**Expected Results:**
- ✅ Only verified properties are shown
- ✅ Properties have images, title, location, price
- ✅ Property count is accurate
- ✅ No pending/rejected properties visible

**How to Verify:**
- Open browser DevTools → Network tab
- Look for: `GET /properties/verified`
- Response should contain only `verification_status: 'verified'`

**Pass/Fail:** ⬜

---

### Test Case 2: Search Functionality
**Steps:**
1. On browse page, enter search term (e.g., "Studio")
2. Press Enter or click Search

**Expected Results:**
- ✅ Properties filter by title/location
- ✅ Count updates correctly
- ✅ "Clear Filters" button appears

**Pass/Fail:** ⬜

---

### Test Case 3: Filter by Price Range
**Steps:**
1. Select price range from dropdown (e.g., "₱5,000 - ₱10,000")
2. Observe filtered results

**Expected Results:**
- ✅ Only properties in price range show
- ✅ Count updates
- ✅ Can combine with other filters

**Pass/Fail:** ⬜

---

### Test Case 4: Filter by City
**Steps:**
1. Select city from dropdown (e.g., "Quezon City")
2. Observe filtered results

**Expected Results:**
- ✅ Only properties in selected city show
- ✅ Works with other filters

**Pass/Fail:** ⬜

---

### Test Case 5: Verified Only Filter
**Steps:**
1. Check "Show verified properties only"
2. Observe results

**Expected Results:**
- ✅ Only verified properties show (should be all since API filters)
- ✅ Checkbox state persists

**Pass/Fail:** ⬜

---

### Test Case 6: Clear All Filters
**Steps:**
1. Apply multiple filters
2. Click "Clear Filters"

**Expected Results:**
- ✅ All filters reset
- ✅ All properties show again
- ✅ Search box clears

**Pass/Fail:** ⬜

---

### Test Case 7: Empty State
**Steps:**
1. Search for non-existent property
2. Observe empty state

**Expected Results:**
- ✅ "No Properties Found" message
- ✅ Clear filters button shown
- ✅ No error in console

**Pass/Fail:** ⬜

---

## 🧪 Task 3.2: Test Property Details Page

### Test Case 8: View Property Details
**Steps:**
1. Click on any property card
2. Navigate to property details page

**Expected Results:**
- ✅ Property title, description, price display
- ✅ Images show correctly
- ✅ Amenities list displays
- ✅ Landlord information shows
- ✅ Location/address displays

**How to Verify:**
- Network tab: `GET /properties/:id`
- Response includes landlord info from `users` table

**Pass/Fail:** ⬜

---

### Test Case 9: Landlord Information Display
**Steps:**
1. On property details, scroll to landlord info section

**Expected Results:**
- ✅ Landlord name displays
- ✅ Landlord initial/avatar shows
- ✅ Phone number displays (if available)
- ✅ Email displays (if available)
- ✅ "Verified Landlord" badge shows

**Pass/Fail:** ⬜

---

### Test Case 10: Similar Properties
**Steps:**
1. Scroll to "You Might Also Like" section

**Expected Results:**
- ✅ Shows 3 similar properties (same city)
- ✅ Can click to navigate to those properties
- ✅ Properties are also verified

**Pass/Fail:** ⬜

---

### Test Case 11: Back Navigation
**Steps:**
1. Click "Back to listings" button

**Expected Results:**
- ✅ Returns to browse page
- ✅ Previous filters/search preserved

**Pass/Fail:** ⬜

---

## 🧪 Task 3.3: Test Favorites Functionality

### Test Case 12: Add to Favorites
**Steps:**
1. On browse page, click heart icon on property card
2. Observe visual feedback

**Expected Results:**
- ✅ Heart icon fills with red color
- ✅ Property added to favorites
- ✅ State persists on page refresh

**Current Status:** ⚠️ Uses localStorage (not database yet)

**Pass/Fail:** ⬜

---

### Test Case 13: Remove from Favorites
**Steps:**
1. Click heart icon on favorited property

**Expected Results:**
- ✅ Heart icon becomes outline
- ✅ Property removed from favorites

**Pass/Fail:** ⬜

---

### Test Case 14: View Favorites Page
**Steps:**
1. Navigate to `/student/favorites`
2. View favorited properties

**Expected Results:**
- ✅ All favorited properties display
- ✅ Can unfavorite from this page
- ✅ Empty state if no favorites

**Pass/Fail:** ⬜

---

## 🧪 Task 3.4: Test Reservation System

### Test Case 15: Create Reservation
**Steps:**
1. On property details, click "Reserve Property (48h Hold)"
2. Fill in optional message
3. Click "Confirm Reservation"

**Expected Results:**
- ✅ Reservation modal appears
- ✅ Shows 48-hour countdown info
- ✅ Success message displays
- ✅ Redirects to reservations page

**Current Status:** ⚠️ Uses localStorage (needs database integration)

**Pass/Fail:** ⬜

---

### Test Case 16: View Reservations
**Steps:**
1. Navigate to `/student/reservations`
2. View all reservations

**Expected Results:**
- ✅ All reservations display
- ✅ Shows countdown timer
- ✅ Shows status (reserved, approved, rejected)
- ✅ Can cancel reservation

**Pass/Fail:** ⬜

---

### Test Case 17: Reservation Expiry
**Steps:**
1. Wait for 48-hour countdown to expire (or manually test)

**Expected Results:**
- ✅ Status changes to "expired"
- ✅ Property becomes available again

**Pass/Fail:** ⬜

---

### Test Case 18: Duplicate Reservation Prevention
**Steps:**
1. Try to reserve same property twice

**Expected Results:**
- ✅ Shows "Already Reserved" message
- ✅ Button disabled
- ✅ No duplicate created

**Pass/Fail:** ⬜

---

## 🧪 Task 3.5: Test Booking System

### Test Case 19: Create Booking
**Steps:**
1. On property details, click "Book Now (Instant)"
2. Navigate to payment page
3. Complete payment

**Expected Results:**
- ✅ Navigates to secure payment page
- ✅ Property details display
- ✅ Payment options show
- ✅ Booking created after payment

**Current Status:** ⚠️ Uses localStorage (needs database integration)

**Pass/Fail:** ⬜

---

### Test Case 20: View Bookings
**Steps:**
1. Navigate to `/student/bookings`
2. View all bookings

**Expected Results:**
- ✅ All bookings display
- ✅ Shows status (pending, approved, rejected)
- ✅ Shows property details
- ✅ Shows landlord info

**Pass/Fail:** ⬜

---

### Test Case 21: Duplicate Booking Prevention
**Steps:**
1. Try to book same property twice

**Expected Results:**
- ✅ Shows "Already Booked" message
- ✅ Button disabled

**Pass/Fail:** ⬜

---

## 📊 Test Results Summary

### Overall Results
- Total Test Cases: 21
- Passed: ___
- Failed: ___
- Skipped: ___

### Critical Issues Found
1. 
2. 
3. 

### Minor Issues Found
1. 
2. 
3. 

### Features Working Correctly
- [ ] Property browsing
- [ ] Search and filters
- [ ] Property details
- [ ] Favorites
- [ ] Reservations
- [ ] Bookings

### Features Needing Work
- [ ] Favorites (database integration)
- [ ] Reservations (database integration)
- [ ] Bookings (database integration)
- [ ] Escrow (database integration)

## 🔧 Troubleshooting

### Issue: No properties showing
**Solution:** 
1. Check backend is running
2. Verify properties exist in database
3. Ensure properties are verified by admin
4. Check browser console for errors

### Issue: API errors
**Solution:**
1. Check network tab for failed requests
2. Verify JWT token in localStorage
3. Check backend logs
4. Verify Supabase connection

### Issue: Images not loading
**Solution:**
1. Check if images exist in database
2. Verify base64 format is correct
3. Check for CORS issues

## ✅ Sign-off

**Tester Name:** _______________
**Date:** _______________
**Overall Status:** ⬜ Pass ⬜ Fail ⬜ Needs Work

**Notes:**
