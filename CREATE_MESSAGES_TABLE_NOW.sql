-- ============================================
-- CREATE MESSAGES TABLE - RUN THIS IN SUPABASE NOW
-- ============================================
-- Copy this entire file and paste into Supabase SQL Editor
-- Then click "Run" button
-- ============================================

-- Create the messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Sender and Receiver
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    message TEXT NOT NULL,
    
    -- Optional: Related to a property
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_property ON messages(property_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(sender_id, receiver_id);

-- Create trigger function for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_messages_timestamp
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();

-- Add comments for documentation
COMMENT ON TABLE messages IS 'Stores messages between students and landlords';
COMMENT ON COLUMN messages.sender_id IS 'User who sent the message';
COMMENT ON COLUMN messages.receiver_id IS 'User who receives the message';
COMMENT ON COLUMN messages.property_id IS 'Optional: Property the message is about';
COMMENT ON COLUMN messages.is_read IS 'Whether the message has been read';

-- Verify table was created
SELECT 
    'SUCCESS! Messages table created' as status,
    COUNT(*) as message_count 
FROM messages;

-- ============================================
-- AFTER RUNNING THIS:
-- 1. You should see: "SUCCESS! Messages table created"
-- 2. Restart your backend server
-- 3. Test the messaging feature
-- ============================================
