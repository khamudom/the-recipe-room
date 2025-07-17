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
  by_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ingredient groups table
CREATE TABLE IF NOT EXISTS ingredient_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  group_id UUID REFERENCES ingredient_groups(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for ingredient groups and ingredients
CREATE INDEX IF NOT EXISTS idx_ingredient_groups_recipe_id ON ingredient_groups(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ingredient_groups_sort_order ON ingredient_groups(sort_order);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_group_id ON ingredients(group_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_sort_order ON ingredients(sort_order);

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE ingredient_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- Create policies for ingredient_groups
CREATE POLICY "Allow users to view ingredient groups for their recipes" ON ingredient_groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredient_groups.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to insert ingredient groups for their recipes" ON ingredient_groups
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredient_groups.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to update ingredient groups for their recipes" ON ingredient_groups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredient_groups.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to delete ingredient groups for their recipes" ON ingredient_groups
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredient_groups.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

-- Create policies for ingredients
CREATE POLICY "Allow users to view ingredients for their recipes" ON ingredients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to insert ingredients for their recipes" ON ingredients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to update ingredients for their recipes" ON ingredients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to delete ingredients for their recipes" ON ingredients
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND recipes.user_id = auth.uid()
    )
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

CREATE POLICY "Allow all users to view admin-created recipes" ON recipes
  FOR SELECT USING (by_admin = true);

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
  by_admin BOOLEAN,
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
      -- For anonymous users, search featured recipes and admin-created recipes
      auth.uid() IS NULL AND (recipes.featured = TRUE OR recipes.by_admin = TRUE) AND (
        to_tsvector('english', recipes.title || ' ' || recipes.description || ' ' || array_to_string(recipes.ingredients, ' ')) @@ websearch_to_tsquery('english', search_term)
        OR
        recipes.category ILIKE '%' || search_term || '%'
      )
    );
END;
$$ LANGUAGE plpgsql;

-- Create a function to get category recipe counts
CREATE OR REPLACE FUNCTION category_recipe_counts()
RETURNS TABLE (
  category TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    recipes.category,
    COUNT(*)::BIGINT
  FROM recipes
  WHERE
    -- For authenticated users, count their own recipes
    (auth.uid() = recipes.user_id)
    OR 
    -- For anonymous users, count featured recipes and admin-created recipes
    (auth.uid() IS NULL AND (recipes.featured = TRUE OR recipes.by_admin = TRUE))
  GROUP BY recipes.category
  ORDER BY recipes.category;
END;
$$ LANGUAGE plpgsql; 