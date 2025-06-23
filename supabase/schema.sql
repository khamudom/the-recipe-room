-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  prep_time TEXT,
  cook_time TEXT,
  servings INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL,
  image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_recipes_search ON recipes USING gin (to_tsvector('english', title || ' ' || description || ' ' || array_to_string(ingredients, ' ')));
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_featured ON recipes(featured);

-- Enable Row Level Security (RLS)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Remove existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view all recipes" ON recipes;
DROP POLICY IF EXISTS "Users can insert their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can update their own recipes" ON recipes;
DROP POLICY IF EXISTS "Users can delete their own recipes" ON recipes;

-- Create policies for recipes
CREATE POLICY "Allow all users to view featured recipes" ON recipes
  FOR SELECT USING (featured = true);

CREATE POLICY "Allow authenticated users to view their own recipes" ON recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to insert their own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to delete their own recipes" ON recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to search recipes
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
  servings INTEGER,
  category TEXT,
  image TEXT,
  featured BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM recipes
  WHERE
    (
      -- For authenticated users, search their own recipes
      auth.uid() = recipes.user_id AND (
        to_tsvector('english', recipes.title || ' ' || recipes.description || ' ' || array_to_string(recipes.ingredients, ' ')) @@ websearch_to_tsquery('english', search_term)
        OR
        recipes.category ILIKE '%' || search_term || '%'
      )
    ) OR (
      -- For anonymous users, search only featured recipes
      auth.uid() IS NULL AND recipes.featured = TRUE AND (
        to_tsvector('english', recipes.title || ' ' || recipes.description || ' ' || array_to_string(recipes.ingredients, ' ')) @@ websearch_to_tsquery('english', search_term)
        OR
        recipes.category ILIKE '%' || search_term || '%'
      )
    );
END;
$$ LANGUAGE plpgsql; 