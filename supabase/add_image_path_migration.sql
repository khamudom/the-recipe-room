-- Migration to add image_path column to recipes table
-- This migration adds the image_path column for Supabase storage integration

-- Add image_path column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'recipes' 
        AND column_name = 'image_path'
    ) THEN
        ALTER TABLE recipes ADD COLUMN image_path TEXT;
    END IF;
END $$;

-- Add index for image_path column for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_image_path ON recipes(image_path) WHERE image_path IS NOT NULL; 