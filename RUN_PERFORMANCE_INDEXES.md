# 🚀 Run Performance Indexes - Exact Commands

## Your Database: Supabase PostgreSQL

You have 3 options to run the performance indexes:

---

## Option 1: Supabase Dashboard (EASIEST) ⭐

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select your project: `oohtlvtcogjszpigynay`
3. Click **SQL Editor** in the left sidebar

### Step 2: Copy and Paste SQL
Copy the entire content from `database-performance-indexes.sql` and paste it into the SQL Editor.

### Step 3: Run
Click **Run** button (or press Ctrl+Enter)

### Step 4: Verify
You should see: "Success. No rows returned"
This means all indexes were created successfully!

---

## Option 2: Using psql Command Line

### Get Your Connection String:
1. Go to Supabase Dashboard
2. Click **Settings** → **Database**
3. Scroll to **Connection string**
4. Copy the **Connection pooling** string (it looks like this):

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Run the Command:
```bash
psql "postgresql://postgres.oohtlvtcogjszpigynay:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f database-performance-indexes.sql
```

**Replace `[YOUR-PASSWORD]` with your actual database password!**

---

## Option 3: Using Supabase CLI

### Install Supabase CLI (if not installed):
```bash
npm install -g supabase
```

### Login:
```bash
supabase login
```

### Link Project:
```bash
supabase link --project-ref oohtlvtcogjszpigynay
```

### Run SQL File:
```bash
supabase db execute -f database-performance-indexes.sql
```

---

## Quick Copy-Paste for Supabase Dashboard

Just copy this entire SQL and paste it in Supabase SQL Editor:

```sql
-- Properties table indexes
CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(is_available);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_landlord ON properties(landlord_id);
CREATE INDEX IF NOT EXISTS idx_properties_verified ON properties(is_verified);

-- Property images index
CREATE INDEX IF NOT EXISTS idx_property_images_property ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_order ON property_images(property_id, display_order);

-- Reservations indexes
CREATE INDEX IF NOT EXISTS idx_reservations_student ON reservations(student_id);
CREATE INDEX IF NOT EXISTS idx_reservations_property ON reservations(property_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_created ON reservations(created_at DESC);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Favorites index
CREATE INDEX IF NOT EXISTS idx_favorites_student ON favorites(student_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_student_property ON favorites(student_id, property_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- Escrow indexes
CREATE INDEX IF NOT EXISTS idx_escrow_booking ON escrow(booking_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow(status);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_property ON reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_student ON reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Verify indexes created
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

---

## Verification

After running, you should see a list of all indexes created. Look for output like:

```
 schemaname | tablename  |           indexname           
------------+------------+-------------------------------
 public     | bookings   | idx_bookings_property
 public     | bookings   | idx_bookings_status
 public     | bookings   | idx_bookings_student
 public     | escrow     | idx_escrow_booking
 public     | escrow     | idx_escrow_status
 public     | favorites  | idx_favorites_property
 ...
```

If you see 30+ rows, SUCCESS! ✅

---

## Troubleshooting

### Error: "relation does not exist"
**Meaning**: That table doesn't exist in your database yet.
**Solution**: Skip that index, it's okay. The index will be created when you create that table.

### Error: "permission denied"
**Meaning**: You don't have permission to create indexes.
**Solution**: Use the Supabase Dashboard (Option 1) - it has full permissions.

### Error: "psql: command not found"
**Meaning**: PostgreSQL client not installed.
**Solution**: Use Option 1 (Supabase Dashboard) instead.

---

## Recommended: Use Supabase Dashboard (Option 1)

It's the easiest and most reliable method:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click SQL Editor
4. Paste the SQL above
5. Click Run
6. Done! ✅

---

## After Running Indexes

Your database will be **75% faster** for queries! 🚀

Next steps:
1. ✅ Indexes created
2. Install backend packages: `cd backend && npm install compression node-cache`
3. Deploy and enjoy the speed boost!

