@echo off
echo ========================================
echo TESTING ALL PERFORMANCE OPTIMIZATIONS
echo ========================================
echo.

echo [1/5] Checking ApiClient implementation...
if not exist "src\utils\apiClient.js" (
    echo ❌ ERROR: ApiClient not found!
    pause
    exit /b 1
)
echo ✅ ApiClient exists
echo.

echo [2/5] Verifying Context imports...
findstr /C:"import ApiClient" src\context\StudentContext.jsx >nul
if errorlevel 1 (
    echo ❌ ERROR: StudentContext missing ApiClient import
) else (
    echo ✅ StudentContext has ApiClient
)

findstr /C:"import ApiClient" src\context\PropertyContext.jsx >nul
if errorlevel 1 (
    echo ❌ ERROR: PropertyContext missing ApiClient import
) else (
    echo ✅ PropertyContext has ApiClient
)

findstr /C:"import ApiClient" src\context\ReservationContext.jsx >nul
if errorlevel 1 (
    echo ❌ ERROR: ReservationContext missing ApiClient import
) else (
    echo ✅ ReservationContext has ApiClient
)

findstr /C:"import ApiClient" src\context\BookingContext.jsx >nul
if errorlevel 1 (
    echo ❌ ERROR: BookingContext missing ApiClient import
) else (
    echo ✅ BookingContext has ApiClient
)

findstr /C:"import ApiClient" src\context\EscrowContext.jsx >nul
if errorlevel 1 (
    echo ❌ ERROR: EscrowContext missing ApiClient import
) else (
    echo ✅ EscrowContext has ApiClient
)

findstr /C:"import ApiClient" src\context\MessageContext.jsx >nul
if errorlevel 1 (
    echo ❌ ERROR: MessageContext missing ApiClient import
) else (
    echo ✅ MessageContext has ApiClient
)

findstr /C:"import ApiClient" src\context\NotificationContext.jsx >nul
if errorlevel 1 (
    echo ❌ ERROR: NotificationContext missing ApiClient import
) else (
    echo ✅ NotificationContext has ApiClient
)
echo.

echo [3/5] Checking for old timeout patterns...
findstr /C:"setTimeout(() => controller.abort()" src\context\*.jsx >nul
if errorlevel 1 (
    echo ✅ No old timeout patterns found
) else (
    echo ⚠️  WARNING: Some old timeout patterns still exist
    echo These should be replaced with ApiClient calls
)
echo.

echo [4/5] Building project to check for errors...
call npm run build
if errorlevel 1 (
    echo ❌ ERROR: Build failed! Check console for errors
    pause
    exit /b 1
)
echo ✅ Build successful!
echo.

echo [5/5] Starting test server...
echo.
echo ========================================
echo MANUAL TESTING CHECKLIST
echo ========================================
echo.
echo Test these features and check Network tab:
echo.
echo 1. Student Browse Properties
echo    - Should load in under 1 second
echo    - Check for "x-cache: HIT" on subsequent loads
echo    - Response should be gzipped (smaller size)
echo.
echo 2. Add/Remove Favorites
echo    - Should respond instantly
echo    - Auto-retry on failure
echo    - Cache should clear after update
echo.
echo 3. Create Reservation
echo    - Should complete in under 2 seconds
echo    - Check for retry on network issues
echo    - Verify data updates immediately
echo.
echo 4. View Bookings
echo    - Should load quickly with caching
echo    - Escrow data should load in parallel
echo    - No timeout errors
echo.
echo 5. Messages
echo    - Conversations load fast
echo    - Sending messages is instant
echo    - Unread count updates quickly
echo.
echo 6. Notifications
echo    - Load in under 1 second
echo    - Mark as read is instant
echo    - Polling every 30 seconds works
echo.
echo Expected Performance Metrics:
echo - Initial Load: 0.8-1.5s (was 3-5s)
echo - Cached Load: 0.1-0.3s (was 3-5s)
echo - Payload Size: 100-400KB (was 500KB-2MB)
echo - Timeout Errors: Rare (was frequent)
echo.
echo Starting preview server...
start "" cmd /c "npm run preview"
echo.
echo Server starting at http://localhost:4173
echo.
echo Open DevTools Network tab and test the features above!
echo.
pause
