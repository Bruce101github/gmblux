-- ============================================
-- VISITOR TRACKING TABLE
-- Run this in Supabase SQL Editor to create the visitor tracking table
-- ============================================

-- Create visitor_tracking table
CREATE TABLE IF NOT EXISTS visitor_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  page_path TEXT DEFAULT '/',
  visit_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, device_type, page_path)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_date ON visitor_tracking(date);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_device ON visitor_tracking(device_type);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_created_at ON visitor_tracking(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE visitor_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (for tracking)
CREATE POLICY "Allow public insert" ON visitor_tracking
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users (admins) to read
CREATE POLICY "Allow authenticated read" ON visitor_tracking
  FOR SELECT
  TO authenticated
  USING (true);

-- Create a function to increment visitor count (upsert)
-- SECURITY DEFINER allows the function to bypass RLS
CREATE OR REPLACE FUNCTION increment_visitor_count(
  p_date DATE,
  p_device_type TEXT,
  p_page_path TEXT DEFAULT '/'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO visitor_tracking (date, device_type, page_path, visit_count)
  VALUES (p_date, p_device_type, COALESCE(p_page_path, '/'), 1)
  ON CONFLICT (date, device_type, page_path) 
  DO UPDATE SET 
    visit_count = visitor_tracking.visit_count + 1,
    updated_at = NOW();
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION increment_visitor_count(DATE, TEXT, TEXT) TO anon, authenticated;

-- Verify table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'visitor_tracking'
ORDER BY ordinal_position;

