# Landlord Settings Complete Setup Guide

## Overview
This guide will help you set up the landlord settings page so landlords can fill in their business information, upload verification documents, and save their changes.

## Step 1: Database Setup

You need to run TWO SQL files in your Supabase SQL Editor:

### 1.1 Add Profile Fields
```sql
-- Copy and paste from: backend/database/add_landlord_profile_fields.sql
```

This adds columns for:
- TIN Number
- Business Address
- Residential Address
- Emergency Contact
- Valid ID Type & Number
- Bank Account Information

### 1.2 Create Verification Documents Table
```sql
-- Copy and paste from: backend/database/create_verification_documents_table.sql
```

This creates a table to store uploaded verification documents.

### 1.3 Add Verification Columns (if not done yet)
```sql
-- Copy and paste from: backend/database/add_landlord_verification_columns.sql
```

This adds verification tracking columns.

## Step 2: Restart Backend Server

The backend has been updated with new endpoints. You MUST restart it:

```bash
# Stop the current backend (Ctrl + C in the terminal)
# Then restart:
cd backend
npm start
```

## Step 3: Test the Setup

### Test 1: Check Backend is Running
Open browser: http://localhost:5000/health

Should see:
```json
{
  "success": true,
  "message": "Homigo API is running"
}
```

### Test 2: Login as Landlord
1. Go to http://localhost:5173/landlord/login
2. Login with your landlord account
3. Navigate to Settings

### Test 3: Fill in Information
Fill in the following fields:
- ✅ Full Name
- ✅ Phone Number
- ✅ Emergency Contact
- ✅ Residential Address
- ✅ Business Name
- ✅ TIN Number
- ✅ Business Address
- ✅ Valid ID Type & Number
- ✅ Bank Name, Account Number, Account Name

### Test 4: Upload Documents
Upload verification documents:
- ✅ Valid ID (Front and Back)
- ✅ Business Permit (Optional)
- ✅ Bank Statement (Optional)

### Test 5: Save Changes
1. Click "Save Changes" button
2. Wait for "Settings Saved Successfully!" message
3. Refresh the page
4. Verify all data is still there

## API Endpoints Used

### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+63 912 345 6789",
    "business_name": "John's Properties",
    "tin_number": "000-000-000-000",
    "business_address": "123 Business St",
    "residential_address": "456 Home St",
    "emergency_contact": "+63 912 345 6789",
    "valid_id_type": "drivers_license",
    "valid_id_number": "D01-12-345678",
    "bank_name": "BDO",
    "bank_account_number": "1234567890",
    "bank_account_name": "John Doe"
  }
}
```

### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+63 912 345 6789",
  "business_name": "John's Properties",
  "tin_number": "000-000-000-000",
  "business_address": "123 Business St",
  "residential_address": "456 Home St",
  "emergency_contact": "+63 912 345 6789",
  "valid_id_type": "drivers_license",
  "valid_id_number": "D01-12-345678",
  "bank_name": "BDO",
  "bank_account_number": "1234567890",
  "bank_account_name": "John Doe"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### Upload Verification Document
```http
POST /upload/verification-document
Authorization: Bearer <token>
Content-Type: application/json

{
  "base64Image": "data:image/jpeg;base64,...",
  "documentType": "validId"
}

Response:
{
  "success": true,
  "message": "Verification document uploaded successfully",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "document_type": "validId",
    "document_url": "data:image/jpeg;base64,...",
    "uploaded_at": "2024-01-01T00:00:00Z"
  }
}
```

## Troubleshooting

### Issue 1: "Failed to update profile"
**Cause**: Database columns don't exist

**Solution**:
1. Run all SQL migrations in Supabase
2. Restart backend server
3. Try again

### Issue 2: "Failed to upload verification document"
**Cause**: verification_documents table doesn't exist

**Solution**:
1. Run `create_verification_documents_table.sql` in Supabase
2. Restart backend server
3. Try again

### Issue 3: Data not saving
**Cause**: Backend not restarted after code changes

**Solution**:
1. Stop backend (Ctrl + C)
2. Run `npm start` in backend folder
3. Try again

### Issue 4: "No token provided"
**Cause**: Not logged in or token expired

**Solution**:
1. Logout
2. Login again
3. Try again

### Issue 5: Image upload fails
**Cause**: Image too large

**Solution**:
1. Use smaller images (< 5MB)
2. Compress images before upload
3. Try again

## Verification Checklist

Before testing, verify these files exist:

- [x] `backend/database/add_landlord_profile_fields.sql`
- [x] `backend/database/create_verification_documents_table.sql`
- [x] `backend/database/add_landlord_verification_columns.sql`
- [x] `backend/controllers/authController.js` (has updateProfile function)
- [x] `backend/controllers/uploadController.js` (has uploadVerificationDocument function)
- [x] `backend/routes/authRoutes.js` (has PUT /profile route)
- [x] `backend/routes/uploadRoutes.js` (has POST /verification-document route)
- [x] `src/pages/LandlordSettings.jsx` (updated with all fields)

## Testing Script

Run this to test the profile update endpoint:

```bash
cd backend
node test-profile-update.js
```

## Admin View

After landlords fill in their information:

1. Login as admin (admin@homigo.com / admin123)
2. Go to Admin > Landlords
3. Click "View" on any landlord
4. You should see:
   - Business Information (Business Name, TIN Number, Business Address)
   - Verification Documents (Valid ID, Bank Account)
   - All filled information

## Database Schema

### users table (updated columns)
```sql
- tin_number TEXT
- business_address TEXT
- residential_address TEXT
- emergency_contact TEXT
- valid_id_type TEXT
- valid_id_number TEXT
- bank_name TEXT
- bank_account_number TEXT
- bank_account_name TEXT
- verified_at TIMESTAMP
- verified_by UUID
- suspended_at TIMESTAMP
- suspension_reason TEXT
```

### verification_documents table (new)
```sql
- id UUID PRIMARY KEY
- user_id UUID REFERENCES users(id)
- document_type TEXT (validId, businessPermit, bankStatement)
- document_url TEXT (base64 image)
- file_name TEXT
- file_size INTEGER
- mime_type TEXT
- uploaded_at TIMESTAMP
- verified BOOLEAN
- verified_at TIMESTAMP
- verified_by UUID
- rejection_reason TEXT
```

## Success Indicators

You'll know it's working when:

1. ✅ Landlord can fill in all fields
2. ✅ Landlord can upload documents
3. ✅ Click "Save Changes" shows success message
4. ✅ Refresh page shows saved data
5. ✅ Admin can see landlord information
6. ✅ Admin can verify landlord account

## Next Steps

After setup is complete:

1. **Test with real landlord account**
   - Register new landlord
   - Fill in all information
   - Upload documents
   - Save changes

2. **Verify admin can see data**
   - Login as admin
   - View landlord details
   - Verify all information is visible

3. **Test verification workflow**
   - Admin verifies landlord
   - Check landlord status changes to "Verified"

---

**Status**: Ready to use after running SQL migrations and restarting backend
**Last Updated**: 2024-01-01
