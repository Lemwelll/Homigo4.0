# Fix Upload 404 Error

## The Problem
`/upload/student-id` returns 404 because:
1. Multer package not installed
2. Backend server not restarted

## The Solution

### Step 1: Install Multer
```bash
cd backend
npm install
```

This will install multer and other missing packages.

### Step 2: Restart Backend Server

**Stop the current server** (Ctrl+C in terminal)

Then start it again:
```bash
npm run dev
```

### Step 3: Verify Routes Are Loaded

You should see in the terminal:
```
Available endpoints:
  GET  /health                  - Health check
  POST /auth/signup             - User registration
  POST /auth/login              - User login
  POST /upload/student-id       - Upload student ID
  POST /upload/government-id    - Upload government ID
```

### Step 4: Test Again

Try registering a student with a photo upload.

---

## If Still 404

Check backend terminal for errors. The upload routes might not be loading due to missing dependencies.

Run:
```bash
cd backend
npm install multer
npm run dev
```
