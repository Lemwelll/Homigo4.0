@echo off
echo ========================================
echo Testing Reservations API
echo ========================================
echo.

echo Step 1: Check if backend is running
curl -s http://localhost:5000/health
echo.
echo.

echo Step 2: Test reservations endpoint (you need to be logged in)
echo.
echo Please provide your JWT token from localStorage
echo Open browser console and run: localStorage.getItem('homigo_token')
echo.
set /p TOKEN="Enter your token: "

echo.
echo Testing GET /reservations...
curl -H "Authorization: Bearer %TOKEN%" http://localhost:5000/reservations
echo.
echo.

pause
