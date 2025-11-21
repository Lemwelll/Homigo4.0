@echo off
echo ========================================
echo Admin Routes Verification
echo ========================================
echo.

echo Checking if required files exist...
echo.

if exist "backend\routes\adminRoutes.js" (
    echo [OK] adminRoutes.js exists
) else (
    echo [ERROR] adminRoutes.js NOT FOUND
    goto :error
)

if exist "backend\controllers\adminController.js" (
    echo [OK] adminController.js exists
) else (
    echo [ERROR] adminController.js NOT FOUND
    goto :error
)

if exist "src\context\AdminContext.jsx" (
    echo [OK] AdminContext.jsx exists
) else (
    echo [ERROR] AdminContext.jsx NOT FOUND
    goto :error
)

echo.
echo Checking if server.js imports adminRoutes...
findstr /C:"adminRoutes" backend\server.js >nul
if %errorlevel% equ 0 (
    echo [OK] server.js imports adminRoutes
) else (
    echo [ERROR] server.js does NOT import adminRoutes
    goto :error
)

echo.
echo Checking if server.js registers /admin route...
findstr /C:"app.use('/admin'" backend\server.js >nul
if %errorlevel% equ 0 (
    echo [OK] server.js registers /admin route
) else (
    echo [ERROR] server.js does NOT register /admin route
    goto :error
)

echo.
echo ========================================
echo All checks passed!
echo ========================================
echo.
echo Now you need to:
echo 1. RESTART the backend server
echo 2. Refresh your browser
echo.
echo Run: restart-backend.bat
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ERROR: Some files are missing!
echo ========================================
echo.
echo Please make sure all files were created properly.
echo.
pause
exit /b 1
