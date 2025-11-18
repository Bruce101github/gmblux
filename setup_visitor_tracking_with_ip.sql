-- ============================================
-- COMPLETE VISITOR TRACKING SETUP WITH IP ADDRESS
-- Run this script to set up visitor tracking with IP address support
-- This script is idempotent - safe to run multiple times
-- ============================================

-- Step 1: Add IP address column if it doesn't exist
ALTER TABLE visitor_tracking 
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Step 2: Create index for faster queries by IP (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_ip ON visitor_tracking(ip_address);

-- Step 3: Drop old function versions (if they exist)
DROP FUNCTION IF EXISTS increment_visitor_count(DATE, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS increment_visitor_count(DATE, TEXT, TEXT);

-- Step 4: Create the function with IP support
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

-- Step 5: Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION increment_visitor_count(DATE, TEXT, TEXT, TEXT) TO anon, authenticated;

-- Step 6: Drop and recreate RLS policies (safe to run multiple times)
DROP POLICY IF EXISTS "Allow public insert" ON visitor_tracking;
CREATE POLICY "Allow public insert" ON visitor_tracking
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read for tracking" ON visitor_tracking;
CREATE POLICY "Allow public read for tracking" ON visitor_tracking
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow public update for tracking" ON visitor_tracking;
CREATE POLICY "Allow public update for tracking" ON visitor_tracking
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Step 7: Verify setup
SELECT 
  'IP column exists' as check_result,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'visitor_tracking' 
  AND column_name = 'ip_address';

SELECT 
  'Function created' as check_result,
  p.proname as function_name,
  CASE p.prosecdef
    WHEN true THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END as security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'increment_visitor_count';

-- Step 8: Test the function (optional - comment out if you don't want test data)
-- SELECT increment_visitor_count(CURRENT_DATE, 'desktop', '/', '127.0.0.1');
-- SELECT increment_visitor_count(CURRENT_DATE, 'mobile', '/', '127.0.0.1');
-- SELECT increment_visitor_count(CURRENT_DATE, 'tablet', '/', '127.0.0.1');

-- Step 9: Check recent tracking data
SELECT 
  date,
  device_type,
  page_path,
  visit_count,
  ip_address,
  created_at
FROM visitor_tracking 
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY created_at DESC 
LIMIT 10;

