@echo off
echo ========================================
echo Creating Admin Account
echo ========================================
echo.
echo Email: admin@homigo.com
echo Password: admin123
echo.
echo Running script...
echo.

cd backend
node scripts/createAdminNow.js

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo You can now login with:
echo Email: admin@homigo.com
echo Password: admin123
echo.
pause
