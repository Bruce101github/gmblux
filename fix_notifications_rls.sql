-- Fix RLS policies for notifications table
-- Run this SQL in your Supabase SQL Editor

-- Update trigger functions to use SECURITY DEFINER to bypass RLS
-- This allows triggers to insert notifications even when RLS is enabled

-- Function to create notification for new booking
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

-- Function to create notification for new contact inquiry
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

-- Function to create notification when property is added (optional)
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
