@echo off
echo ========================================
echo Testing Analytics Endpoint After Deploy
echo ========================================
echo.

echo Step 1: Testing Health Check...
echo.
curl -s https://homigo-backend.onrender.com/health
echo.
echo.

echo Step 2: Testing Routes Endpoint...
echo.
curl -s https://homigo-backend.onrender.com/test-routes
echo.
echo.

echo Step 3: Testing Admin Dashboard Endpoint...
echo.
echo To test with authentication, you need your admin token.
echo.
echo How to get your token:
echo 1. Go to https://homigov5.vercel.app
echo 2. Login as admin
echo 3. Press F12 to open console
echo 4. Type: localStorage.getItem('homigo_token')
echo 5. Copy the token (without quotes)
echo.

set /p TOKEN="Paste your admin token here (or press Enter to skip): "

if "%TOKEN%"=="" (
    echo.
    echo Skipping authenticated test.
    echo.
    goto :summary
)

echo.
echo Testing with your token...
echo.
curl -s -X GET "https://homigo-backend.onrender.com/admin/dashboard?startDate=2025-10-30&endDate=2025-11-29" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json"
echo.
echo.

:summary
echo ========================================
echo Test Summary
echo ========================================
echo.
echo If you see:
echo  - Health check: {"success":true} = Backend is running ✓
echo  - Test routes: JSON with routes = Routes loaded ✓  
echo  - Dashboard: JSON with data = Endpoint working ✓
echo.
echo If you see 404 errors:
echo  - Backend needs to be redeployed on Render
echo  - Follow instructions in DEPLOY_BACKEND_NOW_FIX_ANALYTICS.md
echo.
echo After successful deployment:
echo  1. Go to https://homigov5.vercel.app/admin/analytics
echo  2. Login as admin
echo  3. Analytics should load without errors
echo  4. Metrics should show numbers
echo.
pause
