# Property Management API Guide

## Overview
Complete API documentation for property management features in Homigo backend.

## Database Setup

### Run Migration
Execute the properties schema migration in Supabase SQL Editor:
```bash
# Copy and run the contents of:
backend/database/properties_schema.sql
```

This will create:
- `properties` table
- `property_images` table
- `property_amenities` table
- `verification_logs` table

---

## API Endpoints

### 1. Create Property (Landlord)

**Endpoint:** `POST /properties`  
**Auth:** Required (Landlord only)  
**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "title": "Modern Studio near UP Diliman",
  "description": "A cozy and modern studio apartment perfect for students.",
  "location": "Quezon City",
  "address": "123 University Avenue, Quezon City",
  "price": 8500,
  "bedrooms": 1,
  "bathrooms": 1,
  "amenities": ["WiFi", "Air Conditioning", "Security"],
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ],
  "paymentRules": {
    "allowReservations": true,
    "enableDownpayment": false,
    "downpaymentAmount": 3000
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": "uuid",
    "landlord_id": "uuid",
    "title": "Modern Studio near UP Diliman",
    "verification_status": "pending_verification",
    "created_at": "2025-01-19T10:00:00Z"
  }
}
```

---

### 2. Get My Properties (Landlord)

**Endpoint:** `GET /properties/my-properties`  
**Auth:** Required (Landlord only)  
**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Modern Studio near UP Diliman",
      "location": "Quezon City",
      "rent_price": 8500,
      "verification_status": "verified",
      "views": 245,
      "inquiries": 12,
      "property_images": [
        {
          "id": "uuid",
          "image_url": "data:image/jpeg;base64,...",
          "is_primary": true,
          "display_order": 0
        }
      ],
      "property_amenities": [
        {
          "id": "uuid",
          "amenity_name": "WiFi"
        }
      ]
    }
  ]
}
```

---

### 3. Get Property by ID (Public)

**Endpoint:** `GET /properties/:id`  
**Auth:** Not required  

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Modern Studio near UP Diliman",
    "description": "A cozy and modern studio apartment...",
    "location": "Quezon City",
    "address": "123 University Avenue, Quezon City",
    "rent_price": 8500,
    "bedrooms": 1,
    "bathrooms": 1,
    "verification_status": "verified",
    "views": 245,
    "inquiries": 12,
    "property_images": [...],
    "property_amenities": [...],
    "users": {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+63 912 345 6789"
    }
  }
}
```

---

### 4. Update Property (Landlord)

**Endpoint:** `PUT /properties/:id`  
**Auth:** Required (Landlord only - must own property)  
**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "location": "Quezon City",
  "address": "123 University Avenue",
  "price": 9000,
  "bedrooms": 2,
  "bathrooms": 1,
  "amenities": ["WiFi", "Air Conditioning"],
  "images": ["data:image/jpeg;base64,..."],
  "paymentRules": {
    "allowReservations": true,
    "enableDownpayment": true,
    "downpaymentAmount": 3500
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated Title",
    "updated_at": "2025-01-19T11:00:00Z"
  }
}
```

---

### 5. Delete Property (Landlord)

**Endpoint:** `DELETE /properties/:id`  
**Auth:** Required (Landlord only - must own property)  
**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

### 6. Get All Properties (Admin)

**Endpoint:** `GET /properties/admin/all?status=pending_verification`  
**Auth:** Required (Admin only)  
**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Query Parameters:**
- `status` (optional): Filter by verification status
  - `pending_verification`
  - `verified`
  - `rejected`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Modern Studio near UP Diliman",
      "verification_status": "pending_verification",
      "property_images": [...],
      "property_amenities": [...],
      "users": {
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

### 7. Verify/Reject Property (Admin)

**Endpoint:** `POST /properties/admin/verify/:id`  
**Auth:** Required (Admin only)  
**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "action": "verify",
  "adminNote": "Property meets all requirements"
}
```

**Actions:**
- `verify` - Approve the property
- `reject` - Reject the property

**Success Response (200):**
```json
{
  "success": true,
  "message": "Property verified successfully",
  "data": {
    "id": "uuid",
    "verification_status": "verified",
    "updated_at": "2025-01-19T12:00:00Z"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Landlord role required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Property not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create property"
}
```

---

## Testing with Postman/Thunder Client

### 1. Login as Landlord
```
POST http://localhost:5000/auth/login
Body: {
  "email": "landlord@example.com",
  "password": "password123"
}
```
Copy the JWT token from response.

### 2. Create Property
```
POST http://localhost:5000/properties
Headers: {
  "Authorization": "Bearer <YOUR_JWT_TOKEN>"
}
Body: { ... property data ... }
```

### 3. Get My Properties
```
GET http://localhost:5000/properties/my-properties
Headers: {
  "Authorization": "Bearer <YOUR_JWT_TOKEN>"
}
```

---

## Security Features

✅ JWT Authentication  
✅ Role-based access control (Landlord/Admin)  
✅ Ownership verification (landlords can only edit/delete their own properties)  
✅ Input validation  
✅ SQL injection protection (Supabase handles this)  
✅ Base64 image storage (no external storage needed)  

---

## Database Schema

### Properties Table
- `id` (UUID, Primary Key)
- `landlord_id` (UUID, Foreign Key → users)
- `title` (VARCHAR)
- `description` (TEXT)
- `location` (VARCHAR)
- `address` (TEXT)
- `rent_price` (DECIMAL)
- `bedrooms` (INTEGER)
- `bathrooms` (INTEGER)
- `allow_reservations` (BOOLEAN)
- `enable_downpayment` (BOOLEAN)
- `downpayment_amount` (DECIMAL)
- `verification_status` (VARCHAR: pending_verification, verified, rejected)
- `is_active` (BOOLEAN)
- `views` (INTEGER)
- `inquiries` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Property Images Table
- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key → properties)
- `image_url` (TEXT - base64 encoded)
- `is_primary` (BOOLEAN)
- `display_order` (INTEGER)
- `created_at` (TIMESTAMP)

### Property Amenities Table
- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key → properties)
- `amenity_name` (VARCHAR)
- `created_at` (TIMESTAMP)

### Verification Logs Table
- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key → properties)
- `admin_id` (UUID, Foreign Key → users)
- `action` (VARCHAR: verified, rejected)
- `admin_note` (TEXT)
- `created_at` (TIMESTAMP)

---

## Next Steps

1. Run the migration SQL in Supabase
2. Restart your backend server
3. Test the endpoints with Postman
4. Integrate with your frontend

---

## Support

For issues or questions, check:
- Backend logs: `npm run dev` output
- Supabase logs: Supabase Dashboard → Logs
- Network tab in browser DevTools
