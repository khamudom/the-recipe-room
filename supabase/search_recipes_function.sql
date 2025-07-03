CREATE OR REPLACE FUNCTION search_recipes(search_term TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  ingredients TEXT[],
  instructions TEXT[],
  prep_time TEXT,
  cook_time TEXT,
  servings TEXT,
  category TEXT,
  image TEXT,
  featured BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  by_admin BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM recipes
  WHERE
    (
      auth.uid() = recipes.user_id
      OR recipes.featured = TRUE
      OR recipes.by_admin = TRUE
    )
    AND (
      to_tsvector('english', recipes.title || ' ' || recipes.description || ' ' || array_to_string(recipes.ingredients, ' '))
        @@ websearch_to_tsquery('english', search_term)
      OR
      recipes.category ILIKE '%' || search_term || '%'
    );
END;
$$ LANGUAGE plpgsql; 