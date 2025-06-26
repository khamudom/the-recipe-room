# Supabase Authentication Setup

This guide will help you set up Supabase authentication for The Recipe Room.

## Prerequisites

- A Supabase project (create one at [supabase.com](https://supabase.com))
- Your Supabase project URL and anon key

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_USER_ID=your_admin_user_uuid
```

## Database Setup

1. Run the updated schema in your Supabase SQL editor:

```sql
-- Create recipes table with user_id
CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_recipes_description ON recipes USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view all recipes" ON recipes
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" ON recipes
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
```

## Authentication Features

### What's Included

1. **User Registration**: Users can create accounts with email and password
2. **User Login**: Secure authentication with email/password
3. **User Logout**: Secure session termination
4. **Protected Routes**: Recipe creation, editing, and deletion require authentication
5. **User Ownership**: Users can only edit/delete their own recipes
6. **Public Recipe Viewing**: Anyone can view recipes, but only owners can modify them

### Authentication Flow

1. **Unauthenticated Users**:

   - Can view all recipes
   - See "Sign In to Add Recipe" button
   - Redirected to sign-in page when trying to create/edit recipes

2. **Authenticated Users**:
   - Can view all recipes
   - Can create new recipes (automatically associated with their account)
   - Can edit/delete only their own recipes
   - See their email in the navigation
   - Can sign out

### Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Server-side Authentication**: All API routes verify user authentication
- **Client-side Protection**: UI components check user permissions
- **Secure Cookie Management**: Proper session handling with middleware

## Usage

1. **Sign Up**: Visit `/auth/signup` to create a new account
2. **Sign In**: Visit `/auth/signin` to log in to your account
3. **Add Recipes**: Once authenticated, click "Add New Recipe" to create recipes
4. **Manage Recipes**: Edit or delete your recipes from the recipe detail view

## Troubleshooting

### Common Issues

1. **"Authentication required" errors**: Make sure you're signed in
2. **Can't edit/delete recipes**: You can only modify your own recipes
3. **Session issues**: Try signing out and signing back in

### Development

- The authentication state is managed through React Context
- All API routes use server-side authentication
- Middleware handles cookie management and redirects
- RLS policies ensure database-level security

## Next Steps

Consider adding these features:

- Password reset functionality
- Email verification
- Social authentication (Google, GitHub, etc.)
- User profiles
- Recipe sharing between users
