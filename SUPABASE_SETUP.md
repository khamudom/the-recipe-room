# Supabase Setup Guide

## Environment Variables

Make sure your `.env.local` file contains the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/schema.sql` into the editor
4. Run the SQL to create the recipes table and indexes

## Features Added

- **Supabase Client**: Configured with environment variables
- **Database Service**: Complete CRUD operations for recipes
- **Database Schema**: Optimized table structure with indexes
- **Type Safety**: Full TypeScript support

## Available Database Functions

- `getRecipes()` - Get all recipes
- `getRecipe(id)` - Get a single recipe by ID
- `createRecipe(recipe)` - Create a new recipe
- `updateRecipe(id, updates)` - Update an existing recipe
- `deleteRecipe(id)` - Delete a recipe
- `searchRecipes(query)` - Search recipes by title or description
- `getRecipesByCategory(category)` - Get recipes by category

## Usage Example

```typescript
import { database } from "@/lib/database";

// Get all recipes
const recipes = await database.getRecipes();

// Create a new recipe
const newRecipe = await database.createRecipe({
  title: "Pasta Carbonara",
  description: "Classic Italian pasta dish",
  ingredients: ["pasta", "eggs", "bacon", "cheese"],
  instructions: ["Boil pasta", "Cook bacon", "Mix with eggs"],
  prepTime: "10 minutes",
  cookTime: "15 minutes",
  servings: 4,
  category: "Italian",
});
```
