-- ============================================
-- PAYMENT HISTORY SYSTEM DATABASE SETUP (UUID VERSION - CLEAN)
-- For databases where users.id is UUID type
-- Handles existing triggers gracefully
-- ============================================

-- 1. Create payment_transactions table (UUID version)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_type VARCHAR(50) NOT NULL, -- 'subscription', 'booking', 'reservation', 'escrow'
  payment_method VARCHAR(50) NOT NULL, -- 'card', 'gcash', 'bank_transfer'
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  transaction_id VARCHAR(255) UNIQUE,
  reference_id INTEGER, -- ID of related booking/reservation/subscription
  reference_type VARCHAR(50), -- 'booking', 'reservation', 'subscription'
  payment_details JSONB, -- Store card details, gcash number, etc. (encrypted)
  gateway_response JSONB, -- Store payment gateway response
  receipt_url TEXT, -- URL to receipt/invoice
  notes TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create payment_refunds table (UUID version)
CREATE TABLE IF NOT EXISTS payment_refunds (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES payment_transactions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refund_amount DECIMAL(10, 2) NOT NULL,
  refund_reason TEXT,
  refund_status VARCHAR(50) DEFAULT 'pending' CHECK (refund_status IN ('pending', 'approved', 'rejected', 'completed')),
  refund_transaction_id VARCHAR(255),
  processed_by UUID REFERENCES users(id), -- Admin who processed
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create payment_methods table for saved payment methods (UUID version)
CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  method_type VARCHAR(50) NOT NULL, -- 'card', 'gcash', 'bank'
  method_name VARCHAR(100), -- User-friendly name like "Visa ending in 1234"
  encrypted_details JSONB, -- Encrypted payment method details
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  expires_at DATE, -- For cards
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_type ON payment_transactions(payment_type);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);

CREATE INDEX IF NOT EXISTS idx_payment_refunds_user_id ON payment_refunds(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_transaction_id ON payment_refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_status ON payment_refunds(refund_status);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_active ON payment_methods(is_active);

-- 5. Create trigger function (only if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Drop existing triggers if they exist, then create new ones
DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at 
  BEFORE UPDATE ON payment_transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at 
  BEFORE UPDATE ON payment_methods 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert sample data for testing (optional)
-- This will create sample transactions for users who already have premium subscriptions
INSERT INTO payment_transactions (user_id, amount, payment_type, payment_method, status, transaction_id, reference_type, processed_at) 
SELECT 
    u.id,
    CASE 
        WHEN u.role = 'student' THEN 149.00
        WHEN u.role = 'landlord' THEN 199.00
        ELSE 149.00
    END,
    'subscription',
    'card',
    'completed',
    'TXN-SAMPLE-' || u.id || '-' || EXTRACT(EPOCH FROM NOW())::bigint,
    'subscription',
    NOW() - INTERVAL '1 day'
FROM users u 
WHERE u.subscription_tier = 'premium'
AND NOT EXISTS (
    SELECT 1 FROM payment_transactions pt 
    WHERE pt.user_id = u.id AND pt.payment_type = 'subscription'
)
LIMIT 10;

-- 8. Verify the setup
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('payment_transactions', 'payment_refunds', 'payment_methods')
ORDER BY table_name, ordinal_position;

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE '✅ Payment history system database setup complete!';
    RAISE NOTICE '✅ payment_transactions table created (UUID version)';
    RAISE NOTICE '✅ payment_refunds table created (UUID version)';
    RAISE NOTICE '✅ payment_methods table created (UUID version)';
    RAISE NOTICE '✅ Indexes and triggers created';
    RAISE NOTICE '✅ Sample data inserted for premium users';
END $$;
