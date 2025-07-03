# FeaturedRecipes Component

The `FeaturedRecipes` component displays up to 3 recipes that have the `featured: true` property set.

## Props

- `recipes: Recipe[]` - The full list of recipes to choose from
- `isLoading: boolean` - Loading state
- `onRecipeClick: (recipe: Recipe) => void` - Click handler for recipes
- `maxRecipes?: number` - Maximum number of recipes to show (defaults to 3)

## Usage Examples

### 1. Show 3 Featured Recipes (Default)

```tsx
<FeaturedRecipes
  recipes={allRecipes}
  isLoading={isLoading}
  onRecipeClick={handleRecipeClick}
/>
```

### 2. Show Only 1 Featured Recipe

```tsx
<FeaturedRecipes
  recipes={allRecipes}
  isLoading={isLoading}
  onRecipeClick={handleRecipeClick}
  maxRecipes={1}
/>
```

### 3. Show 6 Featured Recipes

```tsx
<FeaturedRecipes
  recipes={allRecipes}
  isLoading={isLoading}
  onRecipeClick={handleRecipeClick}
  maxRecipes={6}
/>
```

## How to Mark Recipes as Featured

### Option 1: Using the Recipe Form (Admin Only)

**Only admin users can mark recipes as featured.** When creating or editing a recipe as an admin:

1. Go to **Add New Recipe** or **Edit Recipe**
2. Look for the "Featured Recipe" section (only visible to admins)
3. Check the toggle to mark it as featured
4. Save the recipe

The toggle will show:

- **"Mark as featured"** when unchecked
- **"⭐ Featured"** when checked

**Note:** Regular users will not see the featured toggle in the form.

### Option 2: Programmatically (Admin Only)

You can also mark recipes as featured programmatically, but only admin users can do this:

```tsx
// When updating a recipe (admin only)
await updateRecipe(recipeId, {
  featured: true, // This makes it appear in featured recipes
});
```

## Recipe Visibility Rules

The system has two types of recipes that are visible to all users:

### 1. Featured Recipes (`featured: true`)

- Can be marked by admin users using the toggle
- Appear in the FeaturedRecipes component
- Visible to all users (signed in or not)

### 2. Admin-Created Recipes (`byAdmin: true`)

- Automatically set when an admin creates any recipe
- Visible to all users (signed in or not)
- Don't need to be featured to be publicly visible
- Can also be featured for extra prominence

### 3. User Recipes (`byAdmin: false`)

- Only visible to the user who created them
- Can be featured by admin users
- When featured, become visible to all users

## How It Works

- Shows the first 3 recipes (or your specified max) that have `featured: true`
- Recipes are displayed in the order they appear in the recipes array
- If no recipes are featured, the section will be empty
- The component automatically handles loading states and empty states
- Only admin users can create or update featured recipes
- Admin-created recipes are automatically visible to all users

## Admin Setup

To enable the featured toggle for admin users, set the `NEXT_PUBLIC_ADMIN_USER_ID` environment variable:

```env
NEXT_PUBLIC_ADMIN_USER_ID=your_admin_user_id
```

## Database Migration

If you're updating an existing database, run the migration script:

```sql
-- Add by_admin column to existing recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS by_admin BOOLEAN DEFAULT FALSE;

-- Update existing admin recipes (replace with your admin user ID)
UPDATE recipes SET by_admin = true WHERE user_id = 'your-admin-user-id-here';
```

## Best Practices

1. **Admin-only access** - Only admins should be able to mark recipes as featured
2. **Limit featured recipes** - Don't mark too many recipes as featured to keep the homepage clean
3. **Regular updates** - Consider rotating featured recipes periodically to keep content fresh
4. **Quality control** - Use featured recipes to highlight your best content
5. **Admin content** - Admin-created recipes are automatically public, so use this for official content
