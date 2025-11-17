-- ============================================
-- FIX VISITOR TRACKING
-- Run this if tracking isn't working
-- ============================================

-- Drop and recreate the function with SECURITY DEFINER
DROP FUNCTION IF EXISTS increment_visitor_count(DATE, TEXT, TEXT);

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

-- Also ensure the RLS policy allows inserts
DROP POLICY IF EXISTS "Allow public insert" ON visitor_tracking;
CREATE POLICY "Allow public insert" ON visitor_tracking
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anon users to read their own tracking data (for fallback mechanism)
DROP POLICY IF EXISTS "Allow public read for tracking" ON visitor_tracking;
CREATE POLICY "Allow public read for tracking" ON visitor_tracking
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anon users to update (for fallback increment)
DROP POLICY IF EXISTS "Allow public update for tracking" ON visitor_tracking;
CREATE POLICY "Allow public update for tracking" ON visitor_tracking
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Test the function with different device types (should work without errors)
SELECT increment_visitor_count(CURRENT_DATE, 'desktop', '/');
SELECT increment_visitor_count(CURRENT_DATE, 'mobile', '/');
SELECT increment_visitor_count(CURRENT_DATE, 'tablet', '/');

-- Check if it worked
SELECT * FROM visitor_tracking WHERE date = CURRENT_DATE ORDER BY created_at DESC LIMIT 10;

-- Verify function permissions
SELECT 
  p.proname as function_name,
  CASE p.prosecdef
    WHEN true THEN 'DEFINER'
    ELSE 'INVOKER'
  END as security_type,
  pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'increment_visitor_count';

