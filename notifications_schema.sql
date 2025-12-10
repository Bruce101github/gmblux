-- Create notifications table for admin notification system
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('booking', 'contact_inquiry', 'property_added', 'error')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id TEXT, -- Can reference booking.id (bigint), contact_inquiries.id (UUID), properties.id (UUID/bigint), etc.
  related_type TEXT, -- 'booking', 'contact_inquiry', 'property', etc.
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Create index on is_read for filtering unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Create index on type for filtering
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Enable Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to read all notifications
CREATE POLICY "Allow admin read" ON notifications
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow admins to update notifications (mark as read)
CREATE POLICY "Allow admin update" ON notifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, UPDATE ON notifications TO authenticated;

-- Function to create notification for new booking
-- SECURITY DEFINER allows the function to bypass RLS
CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  customer_name TEXT;
  request_type_formatted TEXT;
  property_title TEXT;
  property_location TEXT;
BEGIN
  -- Format customer name
  customer_name := COALESCE(
    TRIM(NEW.first_name || ' ' || NEW.last_name),
    'A prospective client'
  );
  
  -- Format request type
  request_type_formatted := CASE 
    WHEN NEW.request_type = 'Tour' THEN 'property tour'
    WHEN NEW.request_type = 'Rent' THEN 'rental inquiry'
    WHEN NEW.request_type = 'Buy' THEN 'purchase inquiry'
    WHEN NEW.request_type = 'Consultation Request' THEN 'consultation'
    ELSE LOWER(NEW.request_type)
  END;
  
  -- Get property details if available
  IF NEW.property_id IS NOT NULL THEN
    SELECT title, location INTO property_title, property_location
    FROM properties
    WHERE id = NEW.property_id;
  END IF;
  
  -- Create professional notification message
  IF property_title IS NOT NULL THEN
    INSERT INTO notifications (type, title, message, related_id, related_type)
    VALUES (
      'booking',
      'New ' || INITCAP(request_type_formatted) || ' Request',
      customer_name || ' has submitted a ' || request_type_formatted || ' request for ' || 
      COALESCE(property_title, 'a property') || 
      CASE WHEN property_location IS NOT NULL THEN ' in ' || property_location ELSE '' END || 
      '. Please review and respond promptly.',
      NEW.id::TEXT,
      'booking'
    );
  ELSE
    INSERT INTO notifications (type, title, message, related_id, related_type)
    VALUES (
      'booking',
      'New ' || INITCAP(request_type_formatted) || ' Request',
      customer_name || ' has submitted a ' || request_type_formatted || 
      ' request. Please review the details and respond promptly.',
      NEW.id::TEXT,
      'booking'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification when booking is created
CREATE TRIGGER trigger_new_booking
  AFTER INSERT ON booking
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_booking();

-- Function to create notification for new contact inquiry
-- SECURITY DEFINER allows the function to bypass RLS
CREATE OR REPLACE FUNCTION notify_new_contact_inquiry()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contact_method_text TEXT;
  contact_action TEXT;
  property_title TEXT;
  property_location TEXT;
BEGIN
  -- Format contact method for professional messaging
  contact_method_text := CASE 
    WHEN NEW.contact_method = 'call' THEN 'initiated a phone call'
    WHEN NEW.contact_method = 'whatsapp' THEN 'contacted via WhatsApp'
    ELSE 'reached out'
  END;
  
  contact_action := CASE 
    WHEN NEW.contact_method = 'call' THEN 'Phone Call'
    WHEN NEW.contact_method = 'whatsapp' THEN 'WhatsApp Message'
    ELSE 'Contact Inquiry'
  END;
  
  -- Get property details if available
  IF NEW.property_id IS NOT NULL THEN
    SELECT title, location INTO property_title, property_location
    FROM properties
    WHERE id = NEW.property_id;
  END IF;
  
  -- Create professional notification message
  IF property_title IS NOT NULL THEN
    INSERT INTO notifications (type, title, message, related_id, related_type)
    VALUES (
      'contact_inquiry',
      'New ' || contact_action || ' Inquiry',
      NEW.name || ' has ' || contact_method_text || ' regarding ' || 
      property_title || 
      CASE WHEN property_location IS NOT NULL THEN ' in ' || property_location ELSE '' END || 
      '. Contact details: ' || COALESCE(NEW.phone, 'N/A') || ' | ' || COALESCE(NEW.email, 'N/A') || '. Please follow up promptly.',
      NEW.id::TEXT,
      'contact_inquiry'
    );
  ELSE
    INSERT INTO notifications (type, title, message, related_id, related_type)
    VALUES (
      'contact_inquiry',
      'New ' || contact_action || ' Inquiry',
      NEW.name || ' has ' || contact_method_text || ' about a property. ' ||
      'Contact details: ' || COALESCE(NEW.phone, 'N/A') || ' | ' || COALESCE(NEW.email, 'N/A') || 
      '. Please respond promptly to maintain customer engagement.',
      NEW.id::TEXT,
      'contact_inquiry'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification when contact inquiry is created
CREATE TRIGGER trigger_new_contact_inquiry
  AFTER INSERT ON contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_contact_inquiry();

-- Function to create notification when property is added (optional)
-- SECURITY DEFINER allows the function to bypass RLS
CREATE OR REPLACE FUNCTION notify_new_property()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  property_description TEXT;
BEGIN
  -- Create professional property addition message
  property_description := COALESCE(
    NEW.title,
    INITCAP(NEW.property_type) || ' in ' || NEW.location
  );
  
  INSERT INTO notifications (type, title, message, related_id, related_type)
  VALUES (
    'property_added',
    'New Property Listing Added',
    'A new property listing has been added to the platform: ' || property_description || 
    CASE 
      WHEN NEW.bedrooms IS NOT NULL THEN ' (' || NEW.bedrooms || ' bed' || 
        CASE WHEN NEW.bedrooms > 1 THEN 's' ELSE '' END || ')'
      ELSE ''
    END || 
    '. The listing is now live and available for viewing.',
    NEW.id::TEXT,
    'property'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create notification when property is created (optional - uncomment if needed)
-- CREATE TRIGGER trigger_new_property
--   AFTER INSERT ON properties
--   FOR EACH ROW
--   EXECUTE FUNCTION notify_new_property();

-- Function to automatically update read_at when notification is marked as read
CREATE OR REPLACE FUNCTION update_notification_read_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    NEW.read_at = NOW();
  ELSIF NEW.is_read = FALSE THEN
    NEW.read_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update read_at timestamp
CREATE TRIGGER trigger_update_read_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_read_at();

-- Function to get unread notification count (useful for queries)
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM notifications WHERE is_read = FALSE);
END;
$$ LANGUAGE plpgsql;
