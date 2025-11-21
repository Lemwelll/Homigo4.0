# 📦 Supabase Storage Setup Guide

Quick guide to set up file storage for ID verification photos.

---

## Step 1: Create Storage Bucket

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `oohtlvtcogjszpigynay`
3. Click **Storage** in the left sidebar
4. Click **New Bucket** button
5. Enter bucket details:
   - **Name**: `verification-documents`
   - **Public bucket**: ✅ Check this box
   - **File size limit**: 5MB (default is fine)
6. Click **Create Bucket**

---

## Step 2: Configure Bucket Policies

### Option A: Using Supabase Dashboard (Recommended)

1. Click on your `verification-documents` bucket
2. Click **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Add these two policies:

**Policy 1: Allow Uploads**
```
Name: Allow public uploads
Target roles: public
Policy definition: 
  (bucket_id = 'verification-documents')
```

**Policy 2: Allow Downloads**
```
Name: Allow public downloads
Target roles: public
Policy definition:
  (bucket_id = 'verification-documents')
```

### Option B: Using SQL Editor

1. Click **SQL Editor** in sidebar
2. Click **New Query**
3. Paste and run:

```sql
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow anyone to upload
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'verification-documents');

-- Allow anyone to view
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'verification-documents');
```

---

## Step 3: Verify Setup

### Test in Supabase Dashboard

1. Go to **Storage** → `verification-documents`
2. Click **Upload File**
3. Select any image
4. If upload succeeds, setup is correct!

### Test via API

```bash
curl -X POST http://localhost:5000/upload/student-id \
  -F "file=@test-image.jpg" \
  -F "userId=test-user-id"
```

Expected response:
```json
{
  "success": true,
  "message": "Student ID uploaded successfully",
  "data": {
    "fileUrl": "https://...supabase.co/.../student-ids/..."
  }
}
```

---

## Step 4: Check File Structure

After successful uploads, your bucket should look like:

```
verification-documents/
├── student-ids/
│   └── 1705315800-abc123.jpg
└── government-ids/
    └── 1705315801-xyz789.jpg
```

---

## 🔐 Security Notes

**Public Bucket**:
- ✅ Anyone can upload files
- ✅ Anyone can view files
- ✅ Good for verification documents
- ⚠️ Don't store sensitive data

**For Production**:
- Add authentication to upload endpoints
- Implement file scanning for malware
- Add rate limiting
- Monitor storage usage

---

## 🐛 Common Issues

### Issue: "Bucket not found"
**Solution**: Make sure bucket name is exactly `verification-documents`

### Issue: "Permission denied"
**Solution**: Check bucket policies are set correctly

### Issue: "Bucket is not public"
**Solution**: Edit bucket settings and check "Public bucket"

### Issue: "File not accessible"
**Solution**: Verify download policy is set

---

## ✅ Verification Checklist

- [ ] Bucket `verification-documents` created
- [ ] Bucket set to Public
- [ ] Upload policy added
- [ ] Download policy added
- [ ] Test upload successful
- [ ] File URL accessible in browser
- [ ] Backend can upload files
- [ ] Frontend can trigger uploads

---

## 📞 Need Help?

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Verify bucket name matches code
3. Ensure policies are active
4. Test with Supabase Dashboard upload first

---

**Once setup is complete, file uploads will work automatically!** 🎉
