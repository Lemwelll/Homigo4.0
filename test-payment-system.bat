@echo off
echo ========================================
echo PAYMENT SYSTEM TEST
echo ========================================
echo.
echo This will test:
echo - Login authentication
echo - Subscription status
echo - Payment history
echo - Payment statistics
echo - Payment methods
echo.
echo Make sure:
echo 1. Backend server is running (npm start in backend folder)
echo 2. Database migrations are complete
echo 3. You have a test user account
echo.
pause

cd backend
node test-payment-system.js

echo.
echo ========================================
echo Test complete!
echo ========================================
pause
