# Landlord Verification System

## Overview
The landlord verification system allows admins to verify or suspend landlord accounts through the admin dashboard.

## Features Implemented

### Backend (✅ Complete)

1. **Admin Controller** (`backend/controllers/adminController.js`)
   - `getAllLandlords()` - Fetch all landlords with property counts
   - `verifyLandlord()` - Verify a landlord account
   - `suspendLandlord()` - Suspend a landlord account

2. **Admin Routes** (`backend/routes/adminRoutes.js`)
   - `GET /admin/landlords` - Get all landlords
   - `POST /admin/landlords/:landlordId/verify` - Verify landlord
   - `POST /admin/landlords/:landlordId/suspend` - Suspend landlord

3. **Database Schema**
   - Added verification columns to users table:
     - `verified_at` - Timestamp when verified
     - `verified_by` - Admin who verified (references users.id)
     - `suspended_at` - Timestamp when suspended
     - `suspension_reason` - Reason for suspension

### Frontend (✅ Complete)

1. **AdminContext** (`src/context/AdminContext.jsx`)
   - `fetchLandlords()` - Fetch landlords from API
   - `verifyLandlord(landlordId)` - Verify a landlord
   - `suspendLandlord(landlordId, reason)` - Suspend a landlord

2. **AdminLandlords Page** (`src/pages/AdminLandlords.jsx`)
   - View all landlords in a table
   - Search landlords by name or email
   - View detailed landlord information in modal
   - Verify pending landlords
   - Suspend verified landlords
   - Statistics dashboard showing:
     - Verified landlords count
     - Pending verification count
     - Suspended landlords count

## Setup Instructions

### 1. Database Setup

Run the SQL migration to add verification columns:

```bash
# Connect to your Supabase database and run:
psql -h [your-supabase-host] -U postgres -d postgres -f backend/database/add_landlord_verification_columns.sql
```

Or run directly in Supabase SQL Editor:
```sql
-- Copy and paste the contents of backend/database/add_landlord_verification_columns.sql
```

### 2. Backend Setup

The backend is already configured. Just restart your server:

```bash
cd backend
npm start
```

### 3. Frontend Setup

The frontend is already configured. Just restart your dev server:

```bash
npm run dev
```

## Usage Guide

### For Admins

1. **Login as Admin**
   - Email: admin@homigo.com
   - Password: admin123

2. **Navigate to Landlord Management**
   - Click "Landlords" in the admin sidebar

3. **View Landlords**
   - See all landlords in a table format
   - View statistics at the top:
     - Verified Landlords (green)
     - Pending Verification (yellow)
     - Suspended (red)

4. **Search Landlords**
   - Use the search bar to filter by name or email

5. **View Landlord Details**
   - Click "View" button on any landlord
   - Modal shows:
     - Personal information
     - Business information
     - Verification documents
     - Property statistics
     - Verification history

6. **Verify a Landlord**
   - Open landlord details modal
   - Click "Verify Landlord" button (only for pending landlords)
   - Landlord status changes to "Verified"
   - Success message appears

7. **Suspend a Landlord**
   - Open landlord details modal
   - Click "Suspend Landlord" button (only for verified landlords)
   - Landlord status changes to "Suspended"
   - Success message appears

## API Endpoints

### Get All Landlords
```http
GET /admin/landlords
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "business_name": "John's Properties",
      "created_at": "2024-01-01T00:00:00Z",
      "is_verified": false,
      "total_properties": 5,
      "verified_properties": 3,
      "pending_properties": 2
    }
  ],
  "count": 1
}
```

### Verify Landlord
```http
POST /admin/landlords/:landlordId/verify
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Landlord verified successfully",
  "data": {
    "id": "uuid",
    "is_verified": true,
    "verified_at": "2024-01-01T00:00:00Z",
    "verified_by": "admin_uuid"
  }
}
```

### Suspend Landlord
```http
POST /admin/landlords/:landlordId/suspend
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "reason": "Violation of terms"
}

Response:
{
  "success": true,
  "message": "Landlord suspended successfully",
  "data": {
    "id": "uuid",
    "is_verified": false,
    "suspended_at": "2024-01-01T00:00:00Z",
    "suspension_reason": "Violation of terms"
  }
}
```

## Status Flow

```
New Landlord Registration
         ↓
    [Pending] ←──────────┐
         ↓               │
    Admin Reviews        │
         ↓               │
    [Verified] ──────────┘
         ↓
    Admin Suspends
         ↓
    [Suspended]
```

## Database Schema

```sql
-- Users table (landlords)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  business_name TEXT,
  role TEXT CHECK (role IN ('student', 'landlord', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  suspended_at TIMESTAMP,
  suspension_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Security

- All admin endpoints require authentication
- Only users with `role = 'admin'` can access admin endpoints
- JWT tokens are validated on every request
- Landlord verification is tracked with admin ID and timestamp

## Future Enhancements

1. **Email Notifications**
   - Send email when landlord is verified
   - Send email when landlord is suspended

2. **Verification Documents**
   - Upload and view verification documents
   - Document approval workflow

3. **Suspension Appeals**
   - Allow landlords to appeal suspensions
   - Admin review of appeals

4. **Audit Log**
   - Track all admin actions
   - View history of verifications and suspensions

5. **Bulk Actions**
   - Verify multiple landlords at once
   - Export landlord data

## Troubleshooting

### Landlords not showing up
- Check if backend is running on port 5000
- Verify admin token is valid
- Check browser console for errors

### Verification not working
- Ensure database columns exist (run migration)
- Check admin has proper permissions
- Verify API endpoint is accessible

### Status not updating
- Check AdminContext is properly wrapped in App.jsx
- Verify fetchLandlords() is called after actions
- Check network tab for API responses

## Testing

1. **Create Test Landlord**
```bash
# Register a new landlord through the frontend
# Or insert directly into database
```

2. **Test Verification**
```bash
# Login as admin
# Navigate to Landlords page
# Click View on a pending landlord
# Click Verify Landlord
# Verify status changes to "Verified"
```

3. **Test Suspension**
```bash
# Click View on a verified landlord
# Click Suspend Landlord
# Verify status changes to "Suspended"
```

## Support

For issues or questions:
1. Check the browser console for errors
2. Check the backend logs
3. Verify database schema is up to date
4. Ensure all environment variables are set

---

**Status**: ✅ Fully Implemented and Ready to Use
**Last Updated**: 2024-01-01
