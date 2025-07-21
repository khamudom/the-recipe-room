-- Create instruction groups table
CREATE TABLE IF NOT EXISTS instruction_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create instructions table
CREATE TABLE IF NOT EXISTS instructions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  group_id UUID REFERENCES instruction_groups(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for instruction groups and instructions
CREATE INDEX IF NOT EXISTS idx_instruction_groups_recipe_id ON instruction_groups(recipe_id);
CREATE INDEX IF NOT EXISTS idx_instruction_groups_sort_order ON instruction_groups(sort_order);
CREATE INDEX IF NOT EXISTS idx_instructions_recipe_id ON instructions(recipe_id);
CREATE INDEX IF NOT EXISTS idx_instructions_group_id ON instructions(group_id);
CREATE INDEX IF NOT EXISTS idx_instructions_sort_order ON instructions(sort_order);

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE instruction_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;

-- Create policies for instruction_groups
CREATE POLICY "Allow users to view instruction groups for their recipes" ON instruction_groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instruction_groups.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to insert instruction groups for their recipes" ON instruction_groups
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instruction_groups.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to update instruction groups for their recipes" ON instruction_groups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instruction_groups.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to delete instruction groups for their recipes" ON instruction_groups
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instruction_groups.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

-- Create policies for instructions
CREATE POLICY "Allow users to view instructions for their recipes" ON instructions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instructions.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to insert instructions for their recipes" ON instructions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instructions.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to update instructions for their recipes" ON instructions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instructions.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow users to delete instructions for their recipes" ON instructions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instructions.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  ); 