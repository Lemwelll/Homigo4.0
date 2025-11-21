@echo off
echo ========================================
echo Landlord Verification System Setup
echo ========================================
echo.

echo Step 1: Database Setup
echo ----------------------
echo Please run the following SQL in your Supabase SQL Editor:
echo.
echo File: backend/database/add_landlord_verification_columns.sql
echo.
echo Press any key after you've run the SQL...
pause > nul

echo.
echo Step 2: Backend Server
echo ----------------------
echo Starting backend server...
cd backend
start cmd /k "npm start"
cd ..

echo.
echo Step 3: Frontend Server
echo ----------------------
echo Starting frontend server...
start cmd /k "npm run dev"

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Admin Login Credentials:
echo Email: admin@homigo.com
echo Password: admin123
echo.
echo Navigate to: http://localhost:5173/admin/landlords
echo.
echo Press any key to exit...
pause > nul
