-- Migration to alter points_of_sale and add kam, brands, and categories

-- Add columns if they do not exist
ALTER TABLE points_of_sale ADD COLUMN IF NOT EXISTS kam TEXT;
ALTER TABLE points_of_sale ADD COLUMN IF NOT EXISTS brands TEXT[] DEFAULT '{}';
ALTER TABLE points_of_sale ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}';
-- Direct brand indicators (CL = Casa Loy, TD = TADDEL, TZ = Tierra Zafiro)
ALTER TABLE points_of_sale ADD COLUMN IF NOT EXISTS cl BOOLEAN DEFAULT false;
ALTER TABLE points_of_sale ADD COLUMN IF NOT EXISTS td BOOLEAN DEFAULT false;
ALTER TABLE points_of_sale ADD COLUMN IF NOT EXISTS tz BOOLEAN DEFAULT false;

-- Create index for array columns using GIN or general index for queries
CREATE INDEX IF NOT EXISTS idx_points_of_sale_brands ON points_of_sale USING gin(brands) WHERE brands IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_points_of_sale_categories ON points_of_sale USING gin(categories) WHERE categories IS NOT NULL;

-- Update existing seed records with appropriate values
UPDATE points_of_sale 
SET 
  kam = 'Juan Pérez',
  brands = ARRAY['casa-loy', 'taddel'],
  categories = ARRAY['Blanco', 'Reposado', 'Añejo']
WHERE name = 'Sucursal Providencia';

UPDATE points_of_sale 
SET 
  kam = 'María López',
  brands = ARRAY['casa-loy', 'tierra-zafiro'],
  categories = ARRAY['Blanco', 'Reposado', 'Cristalino']
WHERE name = 'Sucursal Landmark';

UPDATE points_of_sale 
SET 
  kam = 'Juan Pérez',
  brands = ARRAY['casa-loy', 'taddel', 'tierra-zafiro'],
  categories = ARRAY['Blanco', 'Reposado', 'Añejo', 'Extra Añejo']
WHERE name = 'Sucursal Polanco';

UPDATE points_of_sale 
SET 
  kam = 'John Doe',
  brands = ARRAY['taddel'],
  categories = ARRAY['Blanco', 'Añejo']
WHERE name = 'Glendale';

UPDATE points_of_sale 
SET 
  kam = 'John Doe',
  brands = ARRAY['casa-loy', 'tierra-zafiro'],
  categories = ARRAY['Reposado', 'Extra Añejo']
WHERE name = 'San Diego';
