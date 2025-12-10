-- Fix notifications table to support both UUID and bigint IDs
-- Run this SQL in your Supabase SQL Editor

-- Change related_id from UUID to TEXT to support both UUID and bigint IDs
ALTER TABLE notifications 
  ALTER COLUMN related_id TYPE TEXT USING related_id::TEXT;

-- This allows the notifications table to store:
-- - booking.id (bigint) as text
-- - contact_inquiries.id (UUID) as text  
-- - properties.id (UUID or bigint) as text
