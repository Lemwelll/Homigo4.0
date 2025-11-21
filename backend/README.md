# 🔐 Homigo Backend Authentication API

Production-ready authentication backend for Homigo platform using Node.js, Express, PostgreSQL (Supabase), and JWT.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Database Setup](#database-setup)
6. [Environment Variables](#environment-variables)
7. [Running the Server](#running-the-server)
8. [API Endpoints](#api-endpoints)
9. [Security Features](#security-features)
10. [Testing](#testing)

---

## ✨ Features

- ✅ User registration (Student & Landlord)
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Email uniqueness validation
- ✅ Password strength validation
- ✅ Role-based access (student, landlord, admin)
- ✅ Secure error handling
- ✅ CORS enabled
- ✅ Input validation
- ✅ PostgreSQL database (Supabase)

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Environment**: dotenv

---

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Supabase connection
├── controllers/
│   └── authController.js    # Request handlers
├── database/
│   ├── schema.sql           # Database schema
│   └── seed.sql             # Admin seed data
├── middleware/
│   └── errorHandler.js      # Error handling
├── routes/
│   └── authRoutes.js        # API routes
├── services/
│   └── authService.js       # Business logic
├── utils/
│   ├── jwtUtils.js          # JWT utilities
│   └── passwordUtils.js     # Password utilities
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Main entry point
└── README.md                # Documentation
```

---

## 📦 Installation

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

---

## 🗄 Database Setup

### Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `oohtlvtcogjszpigynay`
3. Click on **SQL Editor** in the left sidebar

### Step 2: Create Database Schema

Copy and run the contents of `database/schema.sql` in the SQL Editor.

This will create:
- `users` table with all required columns
- Indexes for performance
- Auto-update trigger for `updated_at`

### Step 3: Seed Admin Account

Copy and run the contents of `database/seed.sql` in the SQL Editor.

This creates the default admin account:
- **Email**: `admin@homigo.com`
- **Password**: `Admin@123`

⚠️ **IMPORTANT**: Change the admin password after first login in production!

### Step 4: Verify Setup

Run this query in SQL Editor:

```sql
SELECT id, full_name, email, role, created_at 
FROM users 
WHERE role = 'admin';
```

You should see the admin account.

---

## 🔐 Environment Variables

Create a `.env` file in the `backend` folder:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://oohtlvtcogjszpigynay.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Where to find Supabase keys:

1. Go to Supabase Dashboard
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY` (keep this secret!)

---

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Expected Output

```
╔════════════════════════════════════════╗
║     HOMIGO BACKEND API SERVER         ║
╚════════════════════════════════════════╝

✅ Database connected successfully
🚀 Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000
🔗 Frontend URL: http://localhost:5173

Available endpoints:
  GET  /health          - Health check
  POST /auth/signup     - User registration
  POST /auth/login      - User login
```

---

## 🌐 API Endpoints

### Base URL

```
http://localhost:5000
```

---

### 1. Health Check

**GET** `/health`

Check if the API is running.

**Response:**

```json
{
  "success": true,
  "message": "Homigo API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. User Signup

**POST** `/auth/signup`

Register a new user (student or landlord).

**Request Body:**

```json
{
  "fullName": "Juan Dela Cruz",
  "email": "juan@example.com",
  "password": "SecurePass123",
  "phone": "+639123456789",
  "role": "student"
}
```

**Validation Rules:**
- `fullName`: Required, 2-255 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 8 characters, must contain uppercase, lowercase, and number
- `phone`: Optional, valid phone format
- `role`: Required, must be "student" or "landlord"

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-here",
      "full_name": "Juan Dela Cruz",
      "email": "juan@example.com",
      "phone": "+639123456789",
      "role": "student",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

```json
// 400 - Validation Error
{
  "success": false,
  "message": "Password must contain at least one uppercase letter"
}

// 409 - Email Already Exists
{
  "success": false,
  "message": "Email already registered"
}

// 500 - Server Error
{
  "success": false,
  "message": "Registration failed. Please try again"
}
```

---

### 3. User Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "email": "juan@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "full_name": "Juan Dela Cruz",
      "email": "juan@example.com",
      "phone": "+639123456789",
      "role": "student",
      "is_active": true,
      "is_verified": false,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 🔒 Security Features

### 1. Password Security
- ✅ Bcrypt hashing with 10 salt rounds
- ✅ Password strength validation (min 8 chars, uppercase, lowercase, number)
- ✅ Passwords never stored in plain text
- ✅ Passwords never returned in API responses

### 2. JWT Security
- ✅ Signed tokens with secret key
- ✅ 7-day expiration (configurable)
- ✅ Includes user ID, email, and role in payload
- ✅ Token verification utilities included

### 3. Input Validation
- ✅ Email format validation
- ✅ Phone number format validation
- ✅ Role validation (only student/landlord allowed)
- ✅ SQL injection prevention (parameterized queries)

### 4. Error Handling
- ✅ Generic error messages (don't reveal if email exists)
- ✅ Proper HTTP status codes
- ✅ Detailed logging for debugging
- ✅ Stack traces only in development mode

### 5. CORS Protection
- ✅ Configured for specific frontend origin
- ✅ Credentials support enabled
- ✅ Prevents unauthorized cross-origin requests

---

## 🧪 Testing

### Using cURL

**Signup:**

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "phone": "+639123456789",
    "role": "student"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Using Postman

1. Import the collection (create one with the endpoints above)
2. Set base URL: `http://localhost:5000`
3. Test each endpoint with sample data

---

## 📝 JWT Token Structure

The JWT token contains:

```json
{
  "userId": "uuid-here",
  "email": "user@example.com",
  "role": "student",
  "iat": 1705315800,
  "exp": 1705920600
}
```

Use this token in frontend requests:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🚨 Important Notes

1. **Admin Account**: Cannot be created via signup. Only exists as seeded data.
2. **Password Requirements**: Min 8 chars, uppercase, lowercase, number
3. **Email Uniqueness**: Enforced at database level
4. **Token Expiry**: Default 7 days (configurable in .env)
5. **CORS**: Configure `FRONTEND_URL` in .env for your React app
6. **Production**: Change JWT_SECRET and admin password before deploying

---

## 🔄 Next Steps

This authentication module is ready for:
- ✅ Integration with React frontend
- ✅ Adding more endpoints (profile, password reset, etc.)
- ✅ Implementing middleware for protected routes
- ✅ Adding refresh token functionality
- ✅ Email verification system
- ✅ OAuth integration (Google, Facebook)

---

## 📞 Support

For issues or questions, refer to the main project documentation or contact the development team.

---

**Built with ❤️ for Homigo Platform**
