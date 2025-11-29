# Fixed: Escrow Accept/Decline 401 Authentication Error

## Problem
When clicking "Accept Payment" or "Decline Payment" buttons, getting:
```
POST http://localhost:5000/escrow/{id}/accept 401 (Unauthorized)
Error: Authentication failed
```

## Root Cause
The LandlordEscrow page was using the wrong localStorage key for the token:
- **Used:** `localStorage.getItem('token')`
- **Should be:** `localStorage.getItem('homigo_token')`

The AuthContext stores the token as `homigo_token`, not just `token`.

## Fix Applied
Updated both handler functions in `src/pages/LandlordEscrow.jsx`:

### Before:
```javascript
const token = localStorage.getItem('token')
```

### After:
```javascript
const token = localStorage.getItem('homigo_token')
```

## Files Modified
- `src/pages/LandlordEscrow.jsx` - Fixed token retrieval in:
  - `handleAcceptPayment()` function
  - `handleDeclinePayment()` function

## Testing
1. **Refresh your browser** (Ctrl+F5)
2. **Login as landlord** (if not already logged in)
3. **Go to Escrow page**
4. **Click "Accept Payment"** on a held escrow
5. **Should work now!** ✅

## Why This Happened
The app uses `homigo_token` and `homigo_user` as localStorage keys to avoid conflicts with other apps. The escrow handlers were using the old generic `token` key.

## Status: FIXED ✅
The Accept/Decline buttons should now work properly with authentication.
