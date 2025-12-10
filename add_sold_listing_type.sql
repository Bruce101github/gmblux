-- Add "sold" as a valid listing_type option in Supabase
-- This script ensures the database accepts "sold" as a listing_type value

-- Note: If your properties table has a CHECK constraint on listing_type,
-- you may need to drop and recreate it. If it's just a TEXT column without constraints,
-- this script will work as-is.

-- Check if there's a constraint on listing_type
-- Run this first to see if there's a constraint:
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'properties'::regclass 
-- AND conname LIKE '%listing_type%';

-- If there's a CHECK constraint, you'll need to drop it first:
-- ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_listing_type_check;

-- Then add a new constraint that includes "sold":
-- ALTER TABLE properties ADD CONSTRAINT properties_listing_type_check 
-- CHECK (listing_type IN ('rent', 'sale', 'sold'));

-- However, if listing_type is just a TEXT column without constraints,
-- you can simply start using "sold" as a value - no migration needed!

-- To verify the column type and constraints:
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'properties' 
AND column_name = 'listing_type';

-- If you want to add a constraint to ensure data integrity:
-- ALTER TABLE properties 
-- ADD CONSTRAINT properties_listing_type_check 
-- CHECK (listing_type IN ('rent', 'sale', 'sold'));

-- Note: If the constraint already exists with only 'rent' and 'sale',
-- you'll need to drop it first:
-- ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_listing_type_check;
-- Then add the new one with 'sold' included.
