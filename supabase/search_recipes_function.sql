-- Search function for old ingredients array structure
-- This function searches through the ingredients array field in recipes table
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
-- Uncomment the line below if you want to add this index
-- CREATE INDEX IF NOT EXISTS idx_ingredients_content_search ON ingredients USING gin(to_tsvector('english', content)); 