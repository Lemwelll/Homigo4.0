@echo off
echo ========================================
echo Starting Backend Server Locally
echo ========================================
echo.

cd backend

echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting server on http://localhost:5000...
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
