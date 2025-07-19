-- Migration: Fix search functionality for ingredient grouping
-- This migration fixes the search regression that occurred when ingredient grouping was implemented
-- Date: 2025-01-XX

-- Drop the broken search function
DROP FUNCTION IF EXISTS search_recipes(TEXT);

-- Create the working search function for old ingredients array
CREATE OR REPLACE FUNCTION search_old_ingredients(search_term TEXT)
RETURNS TABLE (
  id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id
  FROM recipes r
  WHERE
    r.ingredients IS NOT NULL
    AND array_to_string(r.ingredients, ' ') ILIKE '%' || search_term || '%'
    AND (
      auth.uid() = r.user_id
      OR r.featured = TRUE
      OR r.by_admin = TRUE
    );
END;
$$ LANGUAGE plpgsql;

-- Optional: Add index for better ingredient content search performance
-- Uncomment if you have many recipes and want better search performance
-- CREATE INDEX IF NOT EXISTS idx_ingredients_content_search ON ingredients USING gin(to_tsvector('english', content));

-- Note: The application now uses a comprehensive fallback search approach that:
-- 1. Searches title, description, and category via direct query
-- 2. Searches old ingredients array via search_old_ingredients RPC function
-- 3. Searches new grouped ingredients via direct ingredients table query
-- 4. Combines all results and removes duplicates
-- 5. Applies proper RLS filtering for both authenticated and anonymous users 