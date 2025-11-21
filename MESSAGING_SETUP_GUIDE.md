# 🔧 Messaging System Setup Guide

## Error: 404 Route Not Found

You're seeing 404 errors because:
1. The messages table doesn't exist in the database yet
2. The backend server needs to be restarted

## ✅ Fix Steps

### Step 1: Create Messages Table in Database

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Open your project
   - Click on "SQL Editor" in the left sidebar

2. **Run the SQL Script**
   - Copy the entire content from `backend/database/create_messages_table.sql`
   - Paste it into the SQL Editor
   - Click "Run" button

The SQL script will create:
- `messages` table
- Indexes for performance
- Triggers for auto-updating timestamps

### Step 2: Restart Backend Server

1. **Stop the current backend server**
   - Press `Ctrl+C` in the terminal where backend is running

2. **Start the backend server again**
   ```bash
   cd backend
   npm start
   ```

3. **Verify the server started**
   - You should see: "🚀 Server running on port 5000"
   - Check for any errors in the console

### Step 3: Test the Messaging System

1. **Refresh your browser** (F5 or Ctrl+R)

2. **Test the flow:**
   - Login as Student
   - Go to a property details page
   - Click "Message Landlord" button
   - You should be redirected to Messages page
   - Type a message and send

3. **Check for errors:**
   - Open browser console (F12)
   - Look for any red errors
   - All API calls should return 200 or 201 status

## 🔍 Troubleshooting

### Still Getting 404 Errors?

**Check 1: Verify routes are loaded**
```bash
# In backend terminal, you should see:
GET /messages/conversations
POST /messages
GET /messages/:partnerId
```

**Check 2: Verify database table exists**
```sql
-- Run this in Supabase SQL Editor
SELECT * FROM messages LIMIT 1;
```

If you get an error "relation messages does not exist", run the create table script again.

**Check 3: Check backend console for errors**
Look for any import errors or syntax errors when server starts.

### Messages Not Sending?

**Check 1: JWT Token**
- Make sure you're logged in
- Check localStorage for 'homigo_token'
- Token should not be expired

**Check 2: User IDs**
- Make sure both sender and receiver exist in users table
- Check that landlord_id is correct on the property

**Check 3: Network Tab**
- Open browser DevTools (F12)
- Go to Network tab
- Send a message
- Click on the POST /messages request
- Check the request payload and response

### Database Connection Issues?

**Check environment variables:**
```env
# backend/.env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

## 📝 SQL Script Content

If you need to manually create the table, here's the SQL:

```sql
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_property ON messages(property_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_messages_timestamp
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();
```

## ✅ Success Checklist

- [ ] Messages table created in Supabase
- [ ] Backend server restarted
- [ ] No 404 errors in browser console
- [ ] Can click "Message Landlord" button
- [ ] Redirects to messages page
- [ ] Can send messages
- [ ] Messages appear in conversation
- [ ] Messages persist after refresh

## 🎉 Once Complete

After following these steps, your messaging system should be fully functional!

Test the complete flow:
1. Student clicks "Message Landlord" on property
2. Opens messages page with conversation
3. Student sends message
4. Message appears in chat
5. Landlord can see and reply to message

---

**Need Help?**
- Check backend console for errors
- Check browser console for errors
- Verify database connection
- Make sure all files are saved
- Try restarting both frontend and backend
