# Quick Messaging Test Guide

## 🚀 Quick Fix (3 Steps)

### Step 1: Create Messages Table in Supabase

1. Open Supabase Dashboard → SQL Editor
2. Paste and run this:

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

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id);
```

### Step 2: Verify Table Created

Run this query to confirm:
```sql
SELECT * FROM messages;
```

You should see an empty table (no errors).

### Step 3: Restart Backend

```bash
# In your backend terminal, press Ctrl+C to stop
# Then restart:
npm run dev
```

## ✅ Test It Works

1. Login to your app as a student
2. Go to Messages page
3. Try sending a message to a landlord
4. Check if the 404 errors are gone

## 🔍 Quick Verification

Open browser console and check:
- ❌ Before: `GET http://localhost:5000/messages/conversations 404 (Not Found)`
- ✅ After: `GET http://localhost:5000/messages/conversations 200 (OK)`

## That's It!

The backend code is already complete. You just needed the database table.
