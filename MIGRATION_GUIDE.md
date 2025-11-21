# 🔄 Migration Guide - File Upload System

Step-by-step guide to update your existing Homigo installation with file upload.

---

## Prerequisites

- ✅ Backend and frontend already running
- ✅ Users can register and login
- ✅ Database has users table

---

## Step 1: Update Database Schema

### If you have existing users table:

Run this in Supabase SQL Editor:

```sql
-- Add new columns for photo URLs
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS student_id_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS university VARCHAR(255),
ADD COLUMN IF NOT EXISTS student_id_photo_url TEXT,
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS government_id_photo_url TEXT;

-- Verify columns added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
```

---

## Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs `multer` for file uploads.

---

## Step 3: Setup Supabase Storage

1. Go to Supabase Dashboard
2. Click **Storage**
3. Click **New Bucket**
4. Name: `verification-documents`
5. Check **Public bucket**
6. Click **Create**

Then set policies (SQL Editor):

```sql
-- Allow uploads
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'verification-documents');

-- Allow downloads
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'verification-documents');
```

---

## Step 4: Restart Servers

```bash
# Stop both servers (Ctrl+C)

# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
npm run dev
```

---

## Step 5: Test

1. Go to http://localhost:5173
2. Register new student
3. Upload student ID photo
4. Complete registration
5. Check Supabase:
   - Storage: File exists
   - Database: URL saved

---

## ✅ Verification

### Check Backend Logs
Should see:
```
POST /upload/student-id       - Upload student ID
POST /upload/government-id    - Upload government ID
```

### Check Supabase Storage
Should have:
```
verification-documents/
├── student-ids/
└── g