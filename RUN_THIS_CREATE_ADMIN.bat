@echo off
echo ========================================
echo CREATING ADMIN ACCOUNT
echo ========================================
echo.
echo This will create:
echo Email: admin@homigo.com
echo Password: admin123
echo.
echo Press any key to continue...
pause > nul
echo.
echo Starting...
echo.

cd backend
node scripts/createAdminNow.js

echo.
echo ========================================
echo.
echo If you see "ADMIN ACCOUNT READY" above,
echo you can now login!
echo.
echo Go to: http://localhost:5173/login
echo Email: admin@homigo.com
echo Password: admin123
echo.
echo ========================================
pause
