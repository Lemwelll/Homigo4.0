@echo off
echo ========================================
echo Testing Admin Dashboard Endpoint
echo ========================================
echo.

echo 1. Testing if server is running...
curl -s https://homigo-backend.onrender.com/test-routes
echo.
echo.

echo 2. Testing admin dashboard endpoint...
echo NOTE: You need to replace YOUR_ADMIN_TOKEN with actual token
echo.
echo To get your token:
echo 1. Login as admin at https://homigov5.vercel.app
echo 2. Open browser console (F12)
echo 3. Type: localStorage.getItem('homigo_token')
echo 4. Copy the token
echo.

set /p TOKEN="Enter your admin token (or press Enter to skip): "

if "%TOKEN%"=="" (
    echo Skipping authenticated test
    echo.
    goto :end
)

echo.
echo Testing with your token...
curl -X GET "https://homigo-backend.onrender.com/admin/dashboard?startDate=2025-10-30&endDate=2025-11-29" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json"
echo.

:end
echo.
echo ========================================
echo Test Complete
echo ========================================
echo.
echo If you see JSON data above, the endpoint is working!
echo If you see 404 error, the backend needs to be redeployed.
echo.
pause
