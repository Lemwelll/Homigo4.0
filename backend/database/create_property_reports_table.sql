-- Create property_reports table for user-reported properties
CREATE TABLE IF NOT EXISTS property_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (reason IN ('misleading_info', 'inappropriate_content', 'scam_fraud', 'duplicate_listing', 'other')),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    admin_note TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_property_reports_property ON property_reports(property_id);
CREATE INDEX idx_property_reports_status ON property_reports(status);
CREATE INDEX idx_property_reports_reported_by ON property_reports(reported_by);
CREATE INDEX idx_property_reports_created ON property_reports(created_at DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_property_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_reports_updated_at
    BEFORE UPDATE ON property_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_property_reports_updated_at();

-- Insert sample data for testing
INSERT INTO property_reports (property_id, reported_by, reason, description, status)
SELECT 
    p.id,
    u.id,
    'misleading_info',
    'The property listing shows 2 bedrooms but actually has only 1 bedroom.',
    'pending'
FROM properties p
CROSS JOIN users u
WHERE p.title LIKE '%Studio%'
AND u.role = 'student'
LIMIT 1;

INSERT INTO property_reports (property_id, reported_by, reason, description, status)
SELECT 
    p.id,
    u.id,
    'inappropriate_content',
    'Property images contain inappropriate content.',
    'pending'
FROM properties p
CROSS JOIN users u
WHERE p.title LIKE '%Apartment%'
AND u.role = 'student'
LIMIT 1;

INSERT INTO property_reports (property_id, reported_by, reason, description, status, resolved_at)
SELECT 
    p.id,
    u.id,
    'scam_fraud',
    'This listing appears to be a scam. The landlord is asking for payment before viewing.',
    'resolved',
    NOW() - INTERVAL '2 days'
FROM properties p
CROSS JOIN users u
WHERE p.title LIKE '%Condo%'
AND u.role = 'student'
LIMIT 1;

COMMENT ON TABLE property_reports IS 'Stores user reports about properties';
COMMENT ON COLUMN property_reports.reason IS 'Reason for reporting: misleading_info, inappropriate_content, scam_fraud, duplicate_listing, other';
COMMENT ON COLUMN property_reports.status IS 'Report status: pending, resolved, dismissed';
