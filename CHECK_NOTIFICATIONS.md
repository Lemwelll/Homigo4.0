# Check if Notifications Are Working

## Step 1: Verify Backend is Running

Make sure your backend server is running with the latest code:

```bash
# In backend terminal
# Press Ctrl+C to stop
npm run dev
```

Look for this in the logs:
```
✅ Database connected successfully
🚀 Server running on port 5000
```

## Step 2: Check Database

Run this SQL in Supabase to see if notification was created:

```sql
SELECT * FROM notifications 
ORDER BY created_at DESC 
LIMIT 5;
```

You should see a notification with:
- `type`: 'booking_created'
- `title`: 'New Inquiry Received'
- `message`: '[Student Name] is interested in "[Property Title]"'

## Step 3: Check Backend Logs

When you create a booking, look for these logs:

```
✅ GOOD: No error logs
❌ BAD: "Failed to send notification: [error]"
```

## Step 4: Refresh Frontend

After creating a booking:
1. **Refresh the page** (F5)
2. Click the notification bell icon
3. Notifications should appear

## Common Issues

### Issue 1: Backend Not Restarted
**Solution:** Stop backend (Ctrl+C) and run `npm run dev` again

### Issue 2: Notification Created But Not Showing
**Check:**
- Is the notification for the correct user?
- Run SQL: `SELECT receiver_id, title FROM notifications ORDER BY created_at DESC LIMIT 1;`
- Compare `receiver_id` with your logged-in landlord's ID

### Issue 3: Frontend Not Fetching
**Solution:** 
- Open browser console (F12)
- Look for errors
- Check if `/notifications` API is being called

## Manual Test

1. **Login as landlord** - note the user ID
2. **Login as student** (different browser/incognito)
3. **Create a booking** as student
4. **Switch back to landlord**
5. **Refresh page**
6. **Click notification bell**

Should see: "New Inquiry Received"

## Debug SQL

```sql
-- Check if notification exists
SELECT 
  n.*,
  u.full_name as receiver_name,
  u.role as receiver_role
FROM notifications n
JOIN users u ON n.receiver_id = u.id
ORDER BY n.created_at DESC
LIMIT 5;

-- Check recent bookings
SELECT 
  b.id,
  b.landlord_id,
  b.student_id,
  b.created_at,
  s.full_name as student_name,
  l.full_name as landlord_name
FROM bookings b
JOIN users s ON b.student_id = s.id
JOIN users l ON b.landlord_id = l.id
ORDER BY b.created_at DESC
LIMIT 3;
```

If booking exists but notification doesn't, the notification service failed.
