-- ============================================
-- ADD ADMIN SETTINGS COLUMNS
-- Run this to add notification_email and phone columns to admins table
-- ============================================

-- Add notification_email column if it doesn't exist
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS notification_email TEXT;

-- Add phone column if it doesn't exist
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Verify columns were added
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'admins' 
  AND column_name IN ('notification_email', 'phone')
ORDER BY column_name;

