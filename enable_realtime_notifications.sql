-- Enable real-time for notifications table
-- Run this SQL in your Supabase SQL Editor

-- Enable real-time replication for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- If the above doesn't work, try this alternative:
-- ALTER TABLE notifications REPLICA IDENTITY FULL;

-- Verify real-time is enabled (this should return the table)
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'notifications';
