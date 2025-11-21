# Design Document

## Overview

This design document outlines the complete system integration for the Homigo platform, ensuring 100% functionality across Student, Landlord, and Admin user types with full frontend-backend-database connectivity.

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Student    │  │   Landlord   │  │    Admin     │     │
│  │   Portal     │  │   Portal     │  │    Portal    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           │                                  │
│                    Context Providers                         │
│         (Auth, Property, Student, Admin, etc.)              │
└─────────────────────────────────────────────────────────────┘
                            │
                     HTTP/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │   Services   │  │  Middleware  │     │
│  │              │  │              │  │              │     │
│  │ - Auth       │  │ - Auth       │  │ - JWT Auth   │     │
│  │ - Property   │  │ - Property   │  │ - Role Check │     │
│  │ - Upload     │  │ - Upload     │  │ - Error      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                      Supabase Client
                            │
┌─────────────────────────────────────────────────────────────┐
│                  Database (PostgreSQL/Supabase)              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables: users, properties, property_images,         │  │
│  │  property_amenities, verification_logs, bookings,    │  │
│  │  reservations, escrow_transactions, notifications    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Frontend Component → Context API → 
Backend API → Service Layer → Database → 
Response → Context Update → UI Re-render
```

## Components and Interfaces

### Frontend Components

#### 1. Context Providers (Data Layer)

**AuthContext**
- Manages user authentication state
- Stores JWT token in localStorage
- Provides login, logout, register functions
- Validates token on app load

**PropertyContext**
- Manages property data for landlords
- Fetches landlord's properties from API
- Provides CRUD operations
- Handles image uploads

**StudentContext**
- Manages student-specific data
- Fetches verified properties
- Handles favorites (stored in database)
- Manages search and filters

**AdminContext**
- Manages admin-specific data
- Fetches all properties with filters
- Handles verification actions
- Manages user data

#### 2. Page Components

**Student Pages**
- StudentBrowse: Display verified properties with search/filter
- PropertyDetails: Show detailed property information
- StudentReservations: Manage 48-hour reservations
- StudentBookings: View confirmed bookings
- StudentFavorites: View favorited properties

**Landlord Pages**
- LandlordProperties: CRUD operations on properties
- AddProperty: Create new property with images
- LandlordReservations: View and manage reservation requests
- LandlordBookings: View confirmed bookings
- LandlordEscrow: Track payment status

**Admin Pages**
- AdminVerifications: Verify/reject pending properties
- AdminLandlords: View and manage landlord accounts
- AdminDashboard: View platform statistics
- AdminReports: Generate reports

### Backend API Endpoints

#### Authentication Routes (`/auth`)
```
POST   /auth/register          - Register new user
POST   /auth/login             - Login user
GET    /auth/profile           - Get user profile (protected)
PUT    /auth/profile           - Update profile (protected)
```

#### Property Routes (`/properties`)
```
GET    /properties/verified              - Get all verified properties (public)
GET    /properties/my-properties         - Get landlord's properties (landlord)
GET    /properties/:id                   - Get property by ID (public)
POST   /properties                       - Create property (landlord)
PUT    /properties/:id                   - Update property (landlord, owner only)
DELETE /properties/:id                   - Delete property (landlord, owner only)
GET    /properties/admin/all             - Get all properties (admin)
POST   /properties/admin/verify/:id      - Verify/reject property (admin)
```

#### Upload Routes (`/upload`)
```
POST   /upload/base64          - Upload base64 image (protected)
```

### Database Schema

#### Core Tables

**users**
```sql
- id (UUID, PK)
- full_name (VARCHAR)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- phone (VARCHAR)
- role (ENUM: student, landlord, admin)
- student_id_number (VARCHAR, nullable)
- university (VARCHAR, nullable)
- business_name (VARCHAR, nullable)
- is_active (BOOLEAN)
- is_verified (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**properties**
```sql
- id (UUID, PK)
- landlord_id (UUID, FK → users.id)
- title (VARCHAR)
- description (TEXT)
- location (VARCHAR)
- address (TEXT)
- rent_price (DECIMAL)
- bedrooms (INTEGER)
- bathrooms (INTEGER)
- allow_reservations (BOOLEAN)
- enable_downpayment (BOOLEAN)
- downpayment_amount (DECIMAL)
- verification_status (ENUM: pending_verification, verified, rejected)
- is_active (BOOLEAN)
- views (INTEGER)
- inquiries (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**property_images**
```sql
- id (UUID, PK)
- property_id (UUID, FK → properties.id, CASCADE)
- image_url (TEXT) -- base64 encoded
- is_primary (BOOLEAN)
- display_order (INTEGER)
- created_at (TIMESTAMP)
```

**property_amenities**
```sql
- id (UUID, PK)
- property_id (UUID, FK → properties.id, CASCADE)
- amenity_name (VARCHAR)
- created_at (TIMESTAMP)
```

**verification_logs**
```sql
- id (UUID, PK)
- property_id (UUID, FK → properties.id)
- admin_id (UUID, FK → users.id)
- action (ENUM: verified, rejected)
- admin_note (TEXT, nullable)
- created_at (TIMESTAMP)
```

## Error Handling

### Frontend Error Handling
- Try-catch blocks in all async operations
- User-friendly error messages
- Toast notifications for errors
- Fallback UI for failed data loads
- Retry mechanisms for failed requests

### Backend Error Handling
- Centralized error handler middleware
- Consistent error response format
- HTTP status codes (400, 401, 403, 404, 500)
- Error logging for debugging
- Validation errors with field-specific messages

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "Field-specific error"
  }
}
```

## Testing Strategy

### Unit Testing
- Test individual service functions
- Test utility functions (password hashing, JWT)
- Test data transformation functions
- Mock database calls

### Integration Testing
- Test API endpoints with real database
- Test authentication flow
- Test property CRUD operations
- Test admin verification workflow

### End-to-End Testing
- Test complete user journeys
- Student: Browse → View → Reserve → Book
- Landlord: Register → Create Property → Manage
- Admin: Login → Verify Properties → Monitor

### Manual Testing Checklist
1. Student can browse only verified properties
2. Student can search and filter properties
3. Student can view property details with landlord info
4. Landlord can create property with images
5. Landlord can edit only their properties
6. Landlord can delete their properties
7. Admin can verify pending properties
8. Admin can reject properties with notes
9. All data persists across page refreshes
10. No dummy data is displayed anywhere

## Security Considerations

### Authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- Tokens stored in localStorage
- Token validation on every protected route

### Authorization
- Role-based access control (RBAC)
- Ownership verification for property operations
- Admin-only routes protected
- SQL injection prevention (parameterized queries)

### Data Validation
- Input validation on frontend and backend
- Email format validation
- Password strength requirements
- File size limits for images
- XSS prevention (sanitize inputs)

## Performance Optimization

### Frontend
- Lazy loading of images
- Debounced search inputs
- Pagination for large lists
- Caching of frequently accessed data
- Code splitting by route

### Backend
- Database indexing on frequently queried fields
- Connection pooling
- Query optimization
- Response compression
- Rate limiting

### Database
- Indexes on: email, landlord_id, verification_status
- Cascade deletes for related records
- Efficient joins with proper foreign keys
- Regular vacuum and analyze

## Deployment Considerations

### Environment Variables
```
SUPABASE_URL
SUPABASE_KEY
JWT_SECRET
PORT
NODE_ENV
```

### Database Migration
1. Run schema.sql to create tables
2. Run setup_admin_and_verify.sql to create admin
3. Verify all tables exist
4. Check foreign key constraints

### Frontend Build
1. Update API_URL for production
2. Build optimized bundle
3. Deploy to hosting service
4. Configure environment variables

### Backend Deployment
1. Install dependencies
2. Set environment variables
3. Start server
4. Monitor logs for errors

## Data Migration Plan

### Remove Dummy Data
1. Identify all hardcoded data in contexts
2. Replace with API calls
3. Add loading states
4. Add empty states
5. Test with empty database
6. Test with populated database

### Consolidate Schema
1. Review all existing tables
2. Merge into single schema.sql
3. Add missing tables
4. Verify relationships
5. Test with fresh database
6. Document schema changes
