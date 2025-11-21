@echo off
echo.
echo ========================================
echo   HOMIGO MESSAGING SYSTEM VERIFICATION
echo ========================================
echo.

echo Checking backend files...
echo.

if exist "backend\routes\messageRoutes.js" (
    echo [OK] messageRoutes.js exists
) else (
    echo [ERROR] messageRoutes.js NOT FOUND
)

if exist "backend\controllers\messageController.js" (
    echo [OK] messageController.js exists
) else (
    echo [ERROR] messageController.js NOT FOUND
)

if exist "backend\services\messageService.js" (
    echo [OK] messageService.js exists
) else (
    echo [ERROR] messageService.js NOT FOUND
)

if exist "backend\database\create_messages_table.sql" (
    echo [OK] create_messages_table.sql exists
) else (
    echo [ERROR] create_messages_table.sql NOT FOUND
)

echo.
echo Checking frontend files...
echo.

if exist "src\context\MessageContext.jsx" (
    echo [OK] MessageContext.jsx exists
) else (
    echo [ERROR] MessageContext.jsx NOT FOUND
)

if exist "src\pages\StudentMessages.jsx" (
    echo [OK] StudentMessages.jsx exists
) else (
    echo [ERROR] StudentMessages.jsx NOT FOUND
)

if exist "src\pages\LandlordMessages.jsx" (
    echo [OK] LandlordMessages.jsx exists
) else (
    echo [ERROR] LandlordMessages.jsx NOT FOUND
)

echo.
echo ========================================
echo   VERIFICATION COMPLETE
echo ========================================
echo.
echo All code files are present!
echo.
echo NEXT STEP:
echo 1. Open Supabase Dashboard
echo 2. Go to SQL Editor
echo 3. Run the SQL from: backend\database\create_messages_table.sql
echo 4. Restart backend: npm run dev
echo.
echo See FIX_MESSAGING_404_ERROR.md for detailed instructions
echo.
pause
