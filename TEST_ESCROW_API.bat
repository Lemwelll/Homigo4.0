@echo off
echo ========================================
echo Testing Properties API for Escrow Status
echo ========================================
echo.
echo Fetching properties from API...
echo.
curl -s "http://localhost:5000/properties/verified" | jq ".data[] | {title: .title, isRented: .isRented}"
echo.
echo ========================================
echo If isRented is true, property should show as NOT AVAILABLE
echo ========================================
pause
