-- Add featured_order column to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS featured_order INTEGER;

-- Create index for better performance when sorting featured recipes
CREATE INDEX IF NOT EXISTS idx_recipes_featured_order ON recipes(featured_order) WHERE featured = true;