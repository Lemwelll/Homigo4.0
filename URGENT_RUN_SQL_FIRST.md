# ⚠️ URGENT: Run SQL First!

## The Error You're Seeing

```
Could not find the table 'public.verification_documents' in the schema cache
```

## What This Means

The database table doesn't exist yet. You need to create it.

## Fix (Takes 30 seconds)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Copy and Run SQL

1. Open the file: `RUN_THIS_SQL_NOW.sql`
2. Copy ALL the contents (Ctrl + A, then Ctrl + C)
3. Paste into Supabase SQL Editor (Ctrl + V)
4. Click "Run" button (or press Ctrl + Enter)

### Step 3: Verify Success

You should see at the bottom:
```
✅ Database setup complete! All tables and columns created successfully.
```

And a list of all the columns that were created.

### Step 4: Try Again

1. Go back to your browser
2. Refresh the Landlord Settings page
3. Fill in information
4. Click "Save Changes"
5. It should work now!

## What Gets Created

This SQL creates:

### In `users` table (new columns):
- tin_number
- business_address
- residential_address
- emergency_contact
- valid_id_type
- valid_id_number
- bank_name
- bank_account_number
- bank_account_name
- verified_at
- verified_by
- suspended_at
- suspension_reason

### New table: `verification_documents`
- Stores uploaded verification documents
- Links to users table
- Tracks verification status

## If SQL Fails

### Error: "relation already exists"
This is OK! It means the table already exists. The SQL is safe to run multiple times.

### Error: "permission denied"
You need to be logged in as the database owner in Supabase.

### Error: "syntax error"
Make sure you copied the ENTIRE file, from the first line to the last.

## After Running SQL

The profile save should work! You can now:

1. ✅ Fill in all landlord information
2. ✅ Upload verification documents
3. ✅ Click "Save Changes"
4. ✅ See success message
5. ✅ Refresh and see saved data

## Quick Test

After running SQL, test with this command:

```sql
-- Run this in Supabase SQL Editor to verify table exists
SELECT * FROM verification_documents LIMIT 1;
```

If it returns "No rows" or shows column names, it worked!

---

**DO THIS NOW**: Open `RUN_THIS_SQL_NOW.sql` → Copy all → Paste in Supabase → Run
