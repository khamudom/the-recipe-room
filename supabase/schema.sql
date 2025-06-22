-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  prep_time TEXT NOT NULL,
  cook_time TEXT NOT NULL,
  servings INTEGER NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_recipes_description ON recipes USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can modify this based on your auth requirements)
CREATE POLICY "Allow all operations on recipes" ON recipes
  FOR ALL USING (true);

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