-- SQL script to add new columns to the properties table
-- Run this in your Supabase SQL editor

-- Add features column (array of feature strings)
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}';

-- Add Location & Proximity columns
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS school_distance numeric,
ADD COLUMN IF NOT EXISTS hospital_distance numeric,
ADD COLUMN IF NOT EXISTS market_distance numeric,
ADD COLUMN IF NOT EXISTS public_transport text,
ADD COLUMN IF NOT EXISTS road_type text;

-- Add Rent-specific columns
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS min_rent_duration text,
ADD COLUMN IF NOT EXISTS deposit_amount numeric,
ADD COLUMN IF NOT EXISTS utilities_included text,
ADD COLUMN IF NOT EXISTS billing_type text;

-- Add Sale-specific columns
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS land_title_type text,
ADD COLUMN IF NOT EXISTS ownership_document text,
ADD COLUMN IF NOT EXISTS payment_plan_available text;

-- Optional: Add comments to describe columns (PostgreSQL feature)
COMMENT ON COLUMN properties.features IS 'Array of property features/amenities';
COMMENT ON COLUMN properties.school_distance IS 'Distance to nearest school in kilometers';
COMMENT ON COLUMN properties.hospital_distance IS 'Distance to nearest hospital in kilometers';
COMMENT ON COLUMN properties.market_distance IS 'Distance to nearest market in kilometers';
COMMENT ON COLUMN properties.public_transport IS 'Public transport access level';
COMMENT ON COLUMN properties.road_type IS 'Type of road access (tarred, untarred, etc.)';
COMMENT ON COLUMN properties.min_rent_duration IS 'Minimum rental duration';
COMMENT ON COLUMN properties.deposit_amount IS 'Deposit amount for rental';
COMMENT ON COLUMN properties.utilities_included IS 'Which utilities are included in rent';
COMMENT ON COLUMN properties.billing_type IS 'Billing type for utilities';
COMMENT ON COLUMN properties.land_title_type IS 'Type of land title (freehold, leasehold, etc.)';
COMMENT ON COLUMN properties.ownership_document IS 'Type of ownership document available';
COMMENT ON COLUMN properties.payment_plan_available IS 'Payment plan options for sale';

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN (
  'features',
  'school_distance',
  'hospital_distance',
  'market_distance',
  'public_transport',
  'road_type',
  'min_rent_duration',
  'deposit_amount',
  'utilities_included',
  'billing_type',
  'land_title_type',
  'ownership_document',
  'payment_plan_available'
)
ORDER BY column_name;

