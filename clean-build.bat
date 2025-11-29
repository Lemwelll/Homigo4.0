@echo off
echo ========================================
echo Cleaning Build Artifacts
echo ========================================

echo.
echo [1/4] Removing dist folder...
if exist dist rmdir /s /q dist
echo Done!

echo.
echo [2/4] Removing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo Done!

echo.
echo [3/4] Cleaning npm cache...
npm cache clean --force
echo Done!

echo.
echo [4/4] Building fresh...
npm run build

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Test locally: npm run preview
echo 2. Deploy: git push
echo.
pause
