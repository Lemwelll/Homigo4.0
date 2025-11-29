@echo off
echo ========================================
echo Testing Admin Login
echo ========================================
echo.
echo Testing login with:
echo Email: admin@homigo.com
echo Password: admin123
echo.

curl -X POST http://localhost:5000/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@homigo.com\",\"password\":\"admin123\"}"

echo.
echo.
echo ========================================
echo If you see "success": true above,
echo the admin login is working!
echo ========================================
pause
