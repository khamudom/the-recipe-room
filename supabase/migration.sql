-- Migration: Add ingredient grouping support
-- This migration adds support for ingredient groups while maintaining backward compatibility

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