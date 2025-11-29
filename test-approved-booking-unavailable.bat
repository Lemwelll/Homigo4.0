@echo off
echo ========================================
echo Testing Approved Booking Unavailability
echo ========================================
echo.

echo Step 1: Checking backend property service...
echo Looking for approved booking logic...
findstr /C:"approved" backend\services\propertyService.js
echo.

echo Step 2: Checking frontend browse page...
echo Looking for disabled actions...
findstr /C:"disabled={property.isRented}" src\pages\StudentBrowse.jsx
echo.

echo Step 3: Checking property details page...
echo Looking for unavailable property handling...
findstr /C:"Property Not Available" src\pages\PropertyDetails.jsx
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo To manually test:
echo 1. Start backend: cd backend ^&^& npm start
echo 2. Start frontend: npm run dev
echo 3. Login as student
echo 4. Browse properties
echo 5. Login as landlord (different browser)
echo 6. Approve a booking request
echo 7. Refresh student browse page
echo 8. Property should show "NOT AVAILABLE"
echo.
pause
