@echo off
echo ========================================
echo Landlord Fetch Diagnostic
echo ========================================
echo.

echo Step 1: Testing Backend Connection
echo -----------------------------------
curl -s http://localhost:5000/health
echo.
echo.

echo Step 2: Running Admin Landlords Test
echo -------------------------------------
cd backend
node test-admin-landlords.js
cd ..
echo.

echo ========================================
echo Diagnostic Complete
echo ========================================
echo.
echo If you see errors above:
echo 1. Make sure backend is running on port 5000
echo 2. Make sure admin account exists (admin@homigo.com)
echo 3. Make sure database has landlord users
echo 4. Check browser console for errors
echo.
pause
