@echo off
echo ========================================
echo Landlord Settings Complete Setup
echo ========================================
echo.

echo This script will help you set up the landlord settings page.
echo.
echo IMPORTANT: You need to run SQL migrations first!
echo.
echo Step 1: Run SQL Migrations in Supabase
echo ----------------------------------------
echo.
echo Open Supabase SQL Editor and run these files in order:
echo.
echo 1. backend/database/add_landlord_profile_fields.sql
echo 2. backend/database/create_verification_documents_table.sql
echo 3. backend/database/add_landlord_verification_columns.sql
echo.
echo Press any key after you've run ALL SQL files...
pause > nul

echo.
echo Step 2: Restart Backend Server
echo --------------------------------
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
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Step 3: Test Backend Connection
echo ---------------------------------
curl -s http://localhost:5000/health
echo.

echo.
echo Step 4: Start Frontend (if not running)
echo -----------------------------------------
echo.
echo If frontend is not running, press Y to start it
echo Otherwise, press N to skip
echo.
choice /C YN /M "Start frontend"
if errorlevel 2 goto :skip_frontend
if errorlevel 1 goto :start_frontend

:start_frontend
start cmd /k "npm run dev"
goto :continue

:skip_frontend
echo Skipping frontend start...

:continue
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Open http://localhost:5173/landlord/login
echo 2. Login with your landlord account
echo 3. Go to Settings
echo 4. Fill in all information
echo 5. Upload verification documents
echo 6. Click "Save Changes"
echo 7. Refresh page to verify data is saved
echo.
echo To test the API directly, run:
echo   cd backend
echo   node test-profile-update.js
echo.
pause
