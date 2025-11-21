# Fix Profile Update 404 Error

## Problem
```
PUT http://localhost:5000/auth/profile 404 (Not Found)
```

## Root Cause
The backend server hasn't been restarted after adding the new PUT /auth/profile route.

## Solution

### Quick Fix (Do this NOW)

1. **Stop the backend server**
   - Find the terminal/command prompt running `npm start` in the backend folder
   - Press `Ctrl + C` to stop it

2. **Restart the backend server**
   ```bash
   cd backend
   npm start
   ```

3. **Wait for server to start** (you should see):
   ```
   ╔════════════════════════════════════════╗
   ║     HOMIGO BACKEND API SERVER         ║
   ╚════════════════════════════════════════╝
   
   🚀 Server running on port 5000
   ```

4. **Refresh your browser**
   - Go back to the Landlord Settings page
   - Try saving again

### Verify the Fix

Open a new terminal and run:
```bash
curl -X GET http://localhost:5000/auth/profile
```

You should see:
```json
{
  "success": false,
  "message": "No token provided"
}
```

This means the endpoint exists (not 404 anymore).

## Alternative: Use the Restart Script

Run this batch file:
```bash
restart-backend.bat
```

## Test After Restart

1. Login as landlord
2. Go to Settings
3. Fill in some information
4. Click "Save Changes"
5. You should see "Settings Saved Successfully!"

## If Still Getting 404

### Check 1: Verify updateProfile function exists
```bash
# In backend/controllers/authController.js
# Search for: export const updateProfile
```

### Check 2: Verify route is registered
```bash
# In backend/routes/authRoutes.js
# Should have: router.put('/profile', authenticate, updateProfile);
```

### Check 3: Check server logs
Look at the backend terminal for any errors when starting.

### Check 4: Clear and restart everything
```bash
# Stop backend (Ctrl + C)
# Stop frontend (Ctrl + C)

# Clear node modules cache (optional)
cd backend
npm install

# Restart backend
npm start

# In another terminal, restart frontend
cd ..
npm run dev
```

## Common Mistakes

❌ **Mistake 1**: Didn't restart backend after code changes
✅ **Solution**: Always restart backend after modifying routes or controllers

❌ **Mistake 2**: Backend running on different port
✅ **Solution**: Check backend is on port 5000, not 3000 or 5001

❌ **Mistake 3**: Multiple backend instances running
✅ **Solution**: Kill all node processes and start fresh
```bash
taskkill /F /IM node.exe
cd backend
npm start
```

## Verification Checklist

After restarting, verify these endpoints work:

- [ ] GET http://localhost:5000/health (should return 200)
- [ ] GET http://localhost:5000/auth/profile (should return 401 without token)
- [ ] PUT http://localhost:5000/auth/profile (should return 401 without token)

If all return 401 (not 404), the routes are working!

## Next Steps

Once backend is restarted:

1. ✅ Login as landlord
2. ✅ Go to Settings
3. ✅ Fill in information
4. ✅ Upload documents
5. ✅ Click "Save Changes"
6. ✅ See success message
7. ✅ Refresh page
8. ✅ Verify data is saved

---

**Quick Command**: Just run `restart-backend.bat` and try again!
