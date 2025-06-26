# Recipe Privacy System

This document explains how recipe privacy and visibility works in The Recipe Room application.

## Overview

The application has two types of recipes with different visibility rules:

1. **Featured Recipes** (`featured = true`) - Visible to everyone
2. **User Recipes** (`featured = false`) - Visible only to the creator

## Database Schema

The `recipes` table has the following key fields:

- `user_id` - References the user who created the recipe
- `featured` - Boolean flag indicating if the recipe is featured (public)

## Row Level Security (RLS) Policies

The database uses RLS policies to enforce privacy:

### For SELECT operations:

- **"Allow all users to view featured recipes"** - Everyone can see featured recipes
- **"Allow authenticated users to view their own recipes"** - Users can only see their own recipes

### For INSERT operations:

- **"Allow authenticated users to insert their own recipes"** - Users can only create recipes for themselves

### For UPDATE operations:

- **"Allow authenticated users to update their own recipes"** - Users can only update their own recipes

### For DELETE operations:

- **"Allow authenticated users to delete their own recipes"** - Users can only delete their own recipes

## User Experience

### For Unauthenticated Users:

- Can only see featured recipes
- Cannot create, edit, or delete any recipes
- See message: "Sign in to create your own private recipes, or check back later for featured recipes!"

### For Authenticated Users:

- Can see featured recipes (public)
- Can see their own recipes (private)
- Can create new recipes (automatically private)
- Can edit and delete their own recipes
- See "My Recipe" badge on their own recipes
- See "Featured" badge on featured recipes

## Visual Indicators

- **Featured Recipe Badge** (red) - Shows on featured recipes visible to everyone
- **My Recipe Badge** (green) - Shows on user's own private recipes

## API Behavior

### GET /api/recipes

- Returns recipes based on user authentication status
- RLS policies automatically filter results
- Additional filters (search, category, featured) are applied after RLS filtering

### POST /api/recipes

- Requires authentication
- Sets `user_id` to current user
- Sets `featured = false` by default (private recipe)

## Database Functions

### `database.getRecipes()`

- Returns recipes based on authentication status
- RLS policies handle filtering automatically

### `database.getUserRecipes()`

- Returns only the current user's recipes
- Requires authentication

### `database.getFeaturedRecipes()`

- Returns only featured recipes
- Available to everyone

### `database.createRecipe()`

- Creates a private recipe for the current user
- Sets `featured = false`

### `database.createFeaturedRecipe()` (Admin function)

- Creates a featured recipe visible to everyone
- Should only be used by developers/admins
- Sets `featured = true`

## Security

- All recipe operations are protected by RLS policies
- Users cannot access other users' recipes
- Featured recipes are the only public content
- Authentication is required for all write operations

## Testing the System

1. **Create a recipe while signed in** - Should be private to that user
2. **Sign out** - Should only see featured recipes
3. **Sign in as different user** - Should not see other users' recipes
4. **Create featured recipe** - Should be visible to everyone

## Developer Notes

- The system relies on Supabase RLS policies for security
- Client-side filtering is not used for privacy (RLS handles it)
- Featured recipes should be created using `database.createFeaturedRecipe()`
- User recipes are automatically private when created through normal flow
