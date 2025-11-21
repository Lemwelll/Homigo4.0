@echo off
echo ========================================
echo Restarting Backend Server
echo ========================================
echo.

echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting backend server...
cd backend
start cmd /k "npm start"
cd ..

echo.
echo ========================================
echo Backend server is restarting...
echo ========================================
echo.
echo Wait 5 seconds for server to start, then press any key to test...
timeout /t 5 /nobreak >nul
pause > nul

echo.
echo Testing admin endpoint...
curl -s http://localhost:5000/health
echo.
echo.

echo If you see the health check above, the server is running!
echo Now try accessing the admin landlords page.
echo.
pause
