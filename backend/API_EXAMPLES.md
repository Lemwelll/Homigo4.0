# 📡 API Testing Examples

Complete examples for testing all authentication endpoints.

---

## 🔧 Tools You Can Use

1. **cURL** (Command line)
2. **Postman** (GUI)
3. **Thunder Client** (VS Code extension)
4. **Insomnia** (GUI)
5. **JavaScript fetch** (Frontend)

---

## 1️⃣ Health Check

### cURL

```bash
curl http://localhost:5000/health
```

### JavaScript (Fetch)

```javascript
fetch('http://localhost:5000/health')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Expected Response

```json
{
  "success": true,
  "message": "Homigo API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 2️⃣ User Signup (Student)

### cURL

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Juan Dela Cruz",
    "email": "juan@student.com",
    "password": "Student123",
    "phone": "+639123456789",
    "role": "student"
  }'
```

### JavaScript (Fetch)

```javascript
fetch('http://localhost:5000/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: 'Juan Dela Cruz',
    email: 'juan@student.com',
    password: 'Student123',
    phone: '+639123456789',
    role: 'student'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Axios (React)

```javascript
import axios from 'axios';

const signup = async () => {
  try {
    const response = await axios.post('http://localhost:5000/auth/signup', {
      fullName: 'Juan Dela Cruz',
      email: 'juan@student.com',
      password: 'Student123',
      phone: '+639123456789',
      role: 'student'
    });
    
    console.log('User:', response.data.data.user);
    console.log('Token:', response.data.data.token);
    
    // Store token in localStorage
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
  } catch (error) {
    console.error('Signup failed:', error.response.data.message);
  }
};
```

### Success Response (201)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "full_name": "Juan Dela Cruz",
      "email": "juan@student.com",
      "phone": "+639123456789",
      "role": "student",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6Imp1YW5Ac3R1ZGVudC5jb20iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTcwNTMxNTgwMCwiZXhwIjoxNzA1OTIwNjAwfQ.abc123xyz"
  }
}
```

---

## 3️⃣ User Signup (Landlord)

### cURL

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Maria Santos",
    "email": "maria@landlord.com",
    "password": "Landlord123",
    "phone": "+639987654321",
    "role": "landlord"
  }'
```

### JavaScript (Fetch)

```javascript
fetch('http://localhost:5000/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: 'Maria Santos',
    email: 'maria@landlord.com',
    password: 'Landlord123',
    phone: '+639987654321',
    role: 'landlord'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 4️⃣ User Login

### cURL

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@student.com",
    "password": "Student123"
  }'
```

### JavaScript (Fetch)

```javascript
fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'juan@student.com',
    password: 'Student123'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Axios (React)

```javascript
import axios from 'axios';

const login = async () => {
  try {
    const response = await axios.post('http://localhost:5000/auth/login', {
      email: 'juan@student.com',
      password: 'Student123'
    });
    
    console.log('User:', response.data.data.user);
    console.log('Token:', response.data.data.token);
    
    // Store token and user data
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    
    // Redirect based on role
    const role = response.data.data.user.role;
    if (role === 'student') {
      window.location.href = '/student/dashboard';
    } else if (role === 'landlord') {
      window.location.href = '/landlord/dashboard';
    } else if (role === 'admin') {
      window.location.href = '/admin/dashboard';
    }
    
  } catch (error) {
    console.error('Login failed:', error.response.data.message);
  }
};
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "full_name": "Juan Dela Cruz",
      "email": "juan@student.com",
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

---

## 5️⃣ Admin Login

### cURL

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@homigo.com",
    "password": "Admin@123"
  }'
```

### JavaScript (Fetch)

```javascript
fetch('http://localhost:5000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@homigo.com',
    password: 'Admin@123'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## ❌ Error Response Examples

### 400 - Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Password must be at least 8 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### 401 - Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 409 - Email Already Exists

```json
{
  "success": false,
  "message": "Email already registered"
}
```

### 500 - Server Error

```json
{
  "success": false,
  "message": "Registration failed. Please try again"
}
```

---

## 🔐 Using JWT Token in Requests

After login, use the token for authenticated requests:

### JavaScript (Fetch)

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Axios

```javascript
import axios from 'axios';

const token = localStorage.getItem('token');

axios.get('http://localhost:5000/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

---

## 📋 Complete React Integration Example

```javascript
// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

export const authService = {
  // Signup
  signup: async (userData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  }
};
```

### Usage in React Component

```javascript
import { useState } from 'react';
import { authService } from './services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await authService.login({ email, password });
      
      // Redirect based on role
      const role = result.data.user.role;
      window.location.href = `/${role}/dashboard`;
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## ✅ Testing Checklist

- [ ] Health check returns 200
- [ ] Student signup works
- [ ] Landlord signup works
- [ ] Duplicate email returns 409
- [ ] Weak password returns 400
- [ ] Invalid email format returns 400
- [ ] Student login works
- [ ] Landlord login works
- [ ] Admin login works
- [ ] Wrong password returns 401
- [ ] Non-existent email returns 401
- [ ] Token is returned on success
- [ ] User data is returned (without password)

---

**Happy Testing! 🚀**
