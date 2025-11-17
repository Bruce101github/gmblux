-- ============================================
-- TEST VISITOR TRACKING
-- Run this to test if tracking is working
-- ============================================

-- Test 1: Check if function exists and has correct permissions
SELECT 
  p.proname as function_name,
  CASE p.prosecdef
    WHEN true THEN 'DEFINER ✓'
    ELSE 'INVOKER ✗ (should be DEFINER)'
  END as security_type,
  pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'increment_visitor_count';

-- Test 2: Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'visitor_tracking';

-- Test 3: Manually test the function
SELECT increment_visitor_count(CURRENT_DATE, 'desktop', '/test');
SELECT increment_visitor_count(CURRENT_DATE, 'mobile', '/test');
SELECT increment_visitor_count(CURRENT_DATE, 'tablet', '/test');

-- Test 4: Check recent tracking data
SELECT 
  date,
  device_type,
  page_path,
  visit_count,
  created_at,
  updated_at
FROM visitor_tracking 
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC, created_at DESC
LIMIT 20;

-- Test 5: Count visits by device type today
SELECT 
  device_type,
  SUM(visit_count) as total_visits,
  COUNT(*) as unique_pages
FROM visitor_tracking 
WHERE date = CURRENT_DATE
GROUP BY device_type
ORDER BY device_type;

