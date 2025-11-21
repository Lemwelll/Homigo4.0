# Fix Admin Landlords 404 Error

## Problem
Getting 404 error when trying to fetch landlords:
```
GET http://localhost:5000/admin/landlords 404 (Not Found)
```

## Root Cause
The admin routes were just added but the backend server hasn't been restarted to load them.

## Solution

### Quick Fix (Recommended)

1. **Stop the backend server**
   - Find the terminal/command prompt running the backend
   - Press `Ctrl + C` to stop it

2. **Restart the backend server**
   ```bash
   cd backend
   npm start
   ```

3. **Refresh your browser**
   - Go to the admin landlords page
   - The landlords should now load

### Automated Fix

Run the restart script:
```bash
restart-backend.bat
```

## Verification Steps

### 1. Check if backend is running
Open browser and go to: http://localhost:5000/health

You should see:
```json
{
  "success": true,
  "message": "Homigo API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test admin endpoint manually
Open a new terminal and run:
```bash
cd backend
node test-admin-landlords.js
```

Expected output:
```
🔐 Step 1: Logging in as admin...
✅ Login successful
   User: Admin User
   Role: admin

📋 Step 2: Fetching all landlords...
✅ Landlords fetched successfully
   Total landlords: X
```

### 3. Check browser console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to Admin > Landlords page
4. You should see:
```
📡 Fetching landlords from: http://localhost:5000/admin/landlords
📥 Response status: 200
✅ Landlords fetched successfully: X landlords
```

## Files Changed

The following files were created/modified:

1. ✅ `backend/routes/adminRoutes.js` - New admin routes
2. ✅ `backend/controllers/adminController.js` - Added verify/suspend functions
3. ✅ `backend/server.js` - Registered admin routes
4. ✅ `src/context/AdminContext.jsx` - Added fetch and verify functions
5. ✅ `backend/database/add_landlord_verification_columns.sql` - Database schema

## Common Issues

### Issue 1: Port already in use
**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Windows
taskkill /F /IM node.exe

# Then restart
cd backend
npm start
```

### Issue 2: Admin not authenticated
**Error**: `401 Unauthorized`

**Solution**:
1. Logout and login again as admin
2. Check credentials: admin@homigo.com / admin123

### Issue 3: No landlords showing
**Error**: `No landlords found`

**Solution**:
This is normal if you don't have any landlord accounts yet.

To create a test landlord:
1. Go to http://localhost:5173/landlord/register
2. Register a new landlord account
3. Go back to admin panel
4. Refresh the landlords page

### Issue 4: Database columns missing
**Error**: `column "verified_at" does not exist`

**Solution**:
Run the database migration:
1. Open Supabase SQL Editor
2. Copy contents of `backend/database/add_landlord_verification_columns.sql`
3. Run the SQL
4. Restart backend server

## Testing Checklist

- [ ] Backend server is running on port 5000
- [ ] Health check endpoint works (http://localhost:5000/health)
- [ ] Admin can login (admin@homigo.com / admin123)
- [ ] Admin landlords page loads without 404
- [ ] Landlords list shows (or "No landlords found" if empty)
- [ ] Can view landlord details
- [ ] Can verify a pending landlord
- [ ] Can suspend a verified landlord

## Next Steps

After fixing the 404 error:

1. **Add Database Columns**
   ```bash
   # Run in Supabase SQL Editor
   backend/database/add_landlord_verification_columns.sql
   ```

2. **Create Test Landlord**
   - Register a landlord account
   - Verify it shows in admin panel

3. **Test Verification**
   - Click "View" on a landlord
   - Click "Verify Landlord"
   - Check status changes to "Verified"

4. **Test Suspension**
   - Click "View" on a verified landlord
   - Click "Suspend Landlord"
   - Check status changes to "Suspended"

## Support

If you're still getting 404 errors after restarting:

1. Check server.js has this line:
   ```javascript
   app.use('/admin', adminRoutes);
   ```

2. Check adminRoutes.js exists in `backend/routes/`

3. Check the import in server.js:
   ```javascript
   import adminRoutes from './routes/adminRoutes.js';
   ```

4. Check for any error messages in the backend terminal

5. Try clearing browser cache and hard refresh (Ctrl + Shift + R)

---

**Status**: Ready to fix - Just restart the backend server!
