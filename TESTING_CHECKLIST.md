# 🧪 Testing Checklist - Frontend-Backend Integration

## Prerequisites

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Supabase database schema created
- [ ] Admin account seeded

---

## Backend Tests

### 1. Backend Server
- [ ] Run `cd backend && npm run dev`
- [ ] See "✅ Database connected successfully"
- [ ] See "🚀 Server running on port 5000"

### 2. Health Check
```bash
curl http://localhost:5000/health
```
- [ ] Returns `{ "success": true }`

---

## Frontend Tests

### 1. Student Registration
- [ ] Go to http://localhost:5173
- [ ] Click "Get Started"
- [ ] Click "I'm a Student"
- [ ] Fill form:
  - Full Name: Juan Dela Cruz
  - Email: juan@student.com
  - Password: Student123
  - Confirm Password: Student123
  - Phone: +639123456789
  - University: UP Diliman
- [ ] Click "Create Account"
- [ ] Should redirect to `/student/dashboard`
- [ ] Check Supabase: user exists in database
- [ ] Check localStorage: `homigo_user` and `homigo_token` exist

### 2. Student Login
- [ ] Go to http://localhost:5173/login
- [ ] Select "Student" role
- [ ] Enter: juan@student.com
- [ ] Enter: Student123
- [ ] Click "Sign In"
- [ ] Should redirect to `/student/dashboard`
- [ ] User name should display in dashboard

### 3. Landlord Registration
- [ ] Go to http://localhost:5173
- [ ] Click "Get Started"
- [ ] Click "I'm a Landlord"
- [ ] Fill form:
  - Full Name: Maria Santos
  - Email: maria@landlord.com
  - Password: Landlord123
  - Confirm Password: Landlord123
  - Phone: +639987654321
  - Business Name: Santos Properties
- [ ] Click "Create Account"
- [ ] Should redirect to `/landlord/dashboard`
- [ ] Check Supabase: user exists in database

### 4. Landlord Login
- [ ] Go to http://localhost:5173/login
- [ ] Select "Landlord" role
- [ ] Enter: maria@landlord.com
- [ ] Enter: Landlord123
- [ ] Click "Sign In"
- [ ] Should redirect to `/landlord/dashboard`

### 5. Admin Login
- [ ] Go to http://localhost:5173/login
- [ ] Select "Admin" role
- [ ] Enter: admin@homigo.com
- [ ] Enter: Admin@123
- [ ] Click "Sign In"
- [ ] Should redirect to `/admin/dashboard`

---

## Error Handling Tests

### 1. Duplicate Email
- [ ] Try to register with existing email
- [ ] Should show: "Email already registered"

### 2. Password Mismatch
- [ ] Enter different passwords in confirm field
- [ ] Should show: "Passwords do not match"

### 3. Weak Password
- [ ] Enter password: "weak"
- [ ] Should show: "Password must be at least 8 characters long"

### 4. Wrong Login Credentials
- [ ] Enter wrong password
- [ ] Should show: "Invalid email or password"

### 5. Network Error
- [ ] Stop backend server
- [ ] Try to login
- [ ] Should show: "Network error. Please try again."

---

## Database Verification

### 1. Check Users Table
```sql
SELECT id, full_name, email, role, created_at 
FROM users 
ORDER BY created_at DESC;
```
- [ ] See all registered users
- [ ] Passwords are hashed (not plain text)
- [ ] Roles are correct (student/landlord/admin)

### 2. Check Password Hash
```sql
SELECT email, password_hash 
FROM users 
WHERE email = 'juan@student.com';
```
- [ ] Password hash starts with `$2b$10$`
- [ ] Hash is different from plain password

---

## Security Tests

### 1. Password Storage
- [ ] Open Supabase Table Editor
- [ ] View users table
- [ ] Confirm passwords are hashed (not readable)

### 2. JWT Token
- [ ] Login successfully
- [ ] Open browser DevTools → Application → Local Storage
- [ ] Check `homigo_token` exists
- [ ] Token should be a long string (JWT format)

### 3. CORS
- [ ] Backend accepts requests from frontend
- [ ] No CORS errors in browser console

---

## Existing Features (Should Still Work)

- [ ] Dashboard navigation
- [ ] Browse properties
- [ ] View property details
- [ ] Add to favorites
- [ ] Send messages
- [ ] View bookings
- [ ] View reservations
- [ ] Escrow system
- [ ] Notifications
- [ ] Settings page
- [ ] Logout

---

## Final Checks

- [ ] No console errors in browser
- [ ] No errors in backend terminal
- [ ] All redirects work correctly
- [ ] User data persists after page refresh
- [ ] Logout clears localStorage
- [ ] Can login again after logout

---

## ✅ All Tests Passed?

If all checkboxes are checked, your integration is working perfectly! 🎉

---

## 🐛 Common Issues

### Backend not connecting
- Check if backend is running on port 5000
- Check `.env` file has correct Supabase credentials
- Check Supabase project is active

### CORS errors
- Check `FRONTEND_URL` in backend `.env` matches frontend URL
- Restart backend server after changing `.env`

### Database errors
- Run `schema.sql` in Supabase SQL Editor
- Run `seed.sql` in Supabase SQL Editor
- Check table exists: `SELECT * FROM users LIMIT 1;`

### Login not working
- Check user exists in database
- Check password was entered correctly
- Check backend logs for errors
- Try registering a new user

---

**Happy Testing! 🚀**
