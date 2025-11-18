-- ============================================
-- ADD IP ADDRESS TRACKING
-- Run this to add IP address column to visitor_tracking table
-- ============================================

-- Add IP address column to visitor_tracking table
ALTER TABLE visitor_tracking 
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Create index for faster queries by IP
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_ip ON visitor_tracking(ip_address);

-- Update the increment_visitor_count function to include IP address
DROP FUNCTION IF EXISTS increment_visitor_count(DATE, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION increment_visitor_count(
  p_date DATE,
  p_device_type TEXT,
  p_page_path TEXT DEFAULT '/',
  p_ip_address TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO visitor_tracking (date, device_type, page_path, visit_count, ip_address)
  VALUES (p_date, p_device_type, COALESCE(p_page_path, '/'), 1, p_ip_address)
  ON CONFLICT (date, device_type, page_path) 
  DO UPDATE SET 
    visit_count = visitor_tracking.visit_count + 1,
    updated_at = NOW(),
    ip_address = COALESCE(p_ip_address, visitor_tracking.ip_address);
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION increment_visitor_count(DATE, TEXT, TEXT, TEXT) TO anon, authenticated;

-- Verify the column was added
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'visitor_tracking' 
  AND column_name = 'ip_address';

