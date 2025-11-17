-- ============================================
-- DATABASE STRUCTURE INSPECTION QUERY
-- Run this in Supabase SQL Editor to see your full database structure
-- ============================================

-- 1. List all tables in the database
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Get detailed column information for all main tables
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default,
    CASE 
        WHEN pk.column_name IS NOT NULL THEN 'YES'
        ELSE 'NO'
    END as is_primary_key
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
LEFT JOIN (
    SELECT ku.table_name, ku.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage ku
        ON tc.constraint_name = ku.constraint_name
    WHERE tc.constraint_type = 'PRIMARY KEY'
) pk ON c.table_name = pk.table_name AND c.column_name = pk.column_name
WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND t.table_name IN ('properties', 'booking', 'email_list', 'admins')
ORDER BY t.table_name, c.ordinal_position;

-- 3. Get foreign key relationships
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 4. Get indexes on tables
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN ('properties', 'booking', 'email_list', 'admins')
ORDER BY tablename, indexname;

-- 5. Get row counts for each table
SELECT 
    'properties' as table_name,
    COUNT(*) as row_count
FROM properties
UNION ALL
SELECT 
    'booking' as table_name,
    COUNT(*) as row_count
FROM booking
UNION ALL
SELECT 
    'email_list' as table_name,
    COUNT(*) as row_count
FROM email_list
UNION ALL
SELECT 
    'admins' as table_name,
    COUNT(*) as row_count
FROM admins;

-- Note: 'property_images' is a storage bucket, not a database table
-- To view storage buckets, go to Storage section in Supabase dashboard

-- 6. Sample data from each table (first 3 rows)
SELECT 'properties' as table_name, json_agg(row_to_json(t)) as sample_data
FROM (SELECT * FROM properties LIMIT 3) t
UNION ALL
SELECT 'booking' as table_name, json_agg(row_to_json(t)) as sample_data
FROM (SELECT * FROM booking LIMIT 3) t
UNION ALL
SELECT 'email_list' as table_name, json_agg(row_to_json(t)) as sample_data
FROM (SELECT * FROM email_list LIMIT 3) t;

-- 7. Check for specific columns in properties table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'properties'
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. Check for enum types (if any)
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid
ORDER BY t.typname, e.enumsortorder;

