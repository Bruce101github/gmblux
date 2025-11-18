-- ============================================
-- FIX VISITOR TRACKING
-- Run this if tracking isn't working
-- ============================================

-- Drop and recreate the function with SECURITY DEFINER (with IP support)
DROP FUNCTION IF EXISTS increment_visitor_count(DATE, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS increment_visitor_count(DATE, TEXT, TEXT);

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

-- Also ensure the RLS policy allows inserts (drop first to avoid conflicts)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'visitor_tracking' 
    AND policyname = 'Allow public insert'
  ) THEN
    DROP POLICY "Allow public insert" ON visitor_tracking;
  END IF;
END $$;

CREATE POLICY "Allow public insert" ON visitor_tracking
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anon users to read their own tracking data (for fallback mechanism)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'visitor_tracking' 
    AND policyname = 'Allow public read for tracking'
  ) THEN
    DROP POLICY "Allow public read for tracking" ON visitor_tracking;
  END IF;
END $$;

CREATE POLICY "Allow public read for tracking" ON visitor_tracking
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anon users to update (for fallback increment)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'visitor_tracking' 
    AND policyname = 'Allow public update for tracking'
  ) THEN
    DROP POLICY "Allow public update for tracking" ON visitor_tracking;
  END IF;
END $$;

CREATE POLICY "Allow public update for tracking" ON visitor_tracking
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Test the function with different device types (should work without errors)
SELECT increment_visitor_count(CURRENT_DATE, 'desktop', '/', '127.0.0.1');
SELECT increment_visitor_count(CURRENT_DATE, 'mobile', '/', '127.0.0.1');
SELECT increment_visitor_count(CURRENT_DATE, 'tablet', '/', '127.0.0.1');

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

