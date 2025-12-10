-- Create contact_inquiries table to store contact information from property page
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('call', 'whatsapp')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on property_id for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_property_id ON contact_inquiries(property_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);

-- Create index on contact_method for filtering
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_contact_method ON contact_inquiries(contact_method);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow public inserts" ON contact_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow admins to read all contact inquiries
-- Adjust this policy based on your admin authentication setup
CREATE POLICY "Allow admin read" ON contact_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Optional: Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_inquiries_updated_at
  BEFORE UPDATE ON contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT INSERT ON contact_inquiries TO anon, authenticated;
GRANT SELECT ON contact_inquiries TO authenticated;
