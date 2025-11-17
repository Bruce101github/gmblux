# Troubleshooting Visitor Tracking

## Issue: Tracking Not Working

If visits aren't being recorded, follow these steps:

### Step 1: Run the Fix SQL Script

Run `fix_visitor_tracking.sql` in your Supabase SQL Editor. This will:
- Recreate the function with `SECURITY DEFINER`
- Grant execute permissions to anon users
- Fix RLS policies

### Step 2: Check Browser Console

1. Open your site in a browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Navigate to a page
5. Look for any errors related to visitor tracking

**Expected behavior:**
- No errors = tracking is working
- "RPC failed" warning = function permissions issue (run fix script)
- "insert error" = RLS policy issue (check policies)

### Step 3: Verify Function Exists

Run this in Supabase SQL Editor:
```sql
SELECT 
  routine_name, 
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_name = 'increment_visitor_count';
```

**Expected result:**
- `routine_name`: increment_visitor_count
- `routine_type`: FUNCTION
- `security_type`: DEFINER (important!)

### Step 4: Test Function Manually

Run this in Supabase SQL Editor:
```sql
SELECT increment_visitor_count(CURRENT_DATE, 'desktop', '/test');
SELECT * FROM visitor_tracking WHERE date = CURRENT_DATE;
```

If this works, the function is correct. If it fails, check the error message.

### Step 5: Check RLS Policies

Run this in Supabase SQL Editor:
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'visitor_tracking';
```

**Expected policies:**
- "Allow public insert" for INSERT to anon, authenticated
- "Allow authenticated read" for SELECT to authenticated

### Step 6: Check Function Permissions

Run this in Supabase SQL Editor:
```sql
SELECT 
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  CASE p.prosecdef
    WHEN true THEN 'DEFINER'
    ELSE 'INVOKER'
  END as security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'increment_visitor_count';
```

**Expected:**
- `security_type` should be `DEFINER`

### Step 7: Verify Environment Variables

Check that your `.env` file has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 8: Test Direct Insert

If RPC still doesn't work, the code will fallback to direct insert. Check if this works:

1. Open browser console
2. Navigate to a page
3. Look for "RPC failed, trying direct insert" message
4. Check if data appears in database

### Common Issues & Solutions

#### Issue: "function does not exist"
**Solution:** Run `fix_visitor_tracking.sql` to create the function

#### Issue: "permission denied for function"
**Solution:** Run the GRANT statement in `fix_visitor_tracking.sql`

#### Issue: "new row violates row-level security policy"
**Solution:** Check RLS policies are set correctly (see Step 5)

#### Issue: "duplicate key value violates unique constraint"
**This is OK!** It means tracking is working, just a duplicate visit. The RPC function should handle this.

#### Issue: No errors but no data
**Check:**
1. Is the hook being called? (check console logs)
2. Are environment variables set correctly?
3. Is Supabase client initialized?

### Quick Test

Run this in your browser console on your site:
```javascript
// Test tracking manually
const { data, error } = await supabase.rpc("increment_visitor_count", {
  p_date: new Date().toISOString().split("T")[0],
  p_device_type: "desktop",
  p_page_path: "/test"
});
console.log("Result:", { data, error });
```

If this works, the function is fine. If it fails, check the error message.

### Manual Verification

After visiting your site, check the database:
```sql
SELECT * FROM visitor_tracking 
ORDER BY created_at DESC 
LIMIT 10;
```

You should see recent visits with today's date.

