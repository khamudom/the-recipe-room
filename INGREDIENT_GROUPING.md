# Ingredient Grouping Feature

## Overview

The Recipe Room now supports ingredient grouping, allowing users to organize ingredients into logical groups like "Avocado Topping", "Olive Topping", "Main Ingredients", etc. This feature enhances recipe organization and makes complex recipes easier to follow.

## Features

### For Users

- **Grouped Ingredients**: Organize ingredients into named groups
- **Flexible Grouping**: Add, remove, and rename ingredient groups
- **Backward Compatibility**: Existing recipes continue to work without changes
- **Visual Organization**: Clear visual separation between ingredient groups
- **Easy Management**: Add/remove ingredients within groups

### For Developers

- **Database Schema**: New tables for ingredient groups and ingredients
- **API Support**: Full CRUD operations for grouped ingredients
- **Type Safety**: TypeScript interfaces for ingredient groups
- **Migration Support**: Safe database migration with backward compatibility

## Database Changes

### New Tables

#### `ingredient_groups`

- `id`: UUID primary key
- `recipe_id`: Foreign key to recipes table
- `name`: Group name (e.g., "Avocado Topping")
- `sort_order`: Order within recipe
- `created_at`: Timestamp

#### `ingredients`

- `id`: UUID primary key
- `recipe_id`: Foreign key to recipes table
- `group_id`: Foreign key to ingredient_groups table
- `content`: Ingredient text
- `sort_order`: Order within group
- `created_at`: Timestamp

### Row Level Security (RLS)

- Users can only access ingredient groups for their own recipes
- Full CRUD policies implemented for both tables
- Automatic filtering based on user permissions

## TypeScript Interfaces

```typescript
interface IngredientGroup {
  id?: string;
  name: string;
  ingredients: string[];
  sortOrder?: number;
}

interface Recipe {
  // ... existing fields
  ingredients: string[]; // Keep for backward compatibility
  ingredientGroups?: IngredientGroup[]; // New grouped structure
}
```

## Migration

### Running the Migration

1. **Supabase Dashboard**: Run the migration SQL in your Supabase SQL editor
2. **Local Development**: The migration is included in `supabase/migration.sql`

### Migration Safety

- Uses `CREATE TABLE IF NOT EXISTS` for safety
- Maintains backward compatibility with existing recipes
- No data loss for existing recipes

## Usage Examples

### Creating a Recipe with Groups

```typescript
const recipe = {
  title: "Avocado Toast with Toppings",
  ingredients: ["8 large eggs"], // Backward compatibility
  ingredientGroups: [
    {
      name: "Avocado Topping",
      ingredients: [
        "1 ripe avocado",
        "1/2 teaspoon curry powder",
        "1/2 teaspoon lemon juice",
        "1/4 teaspoon kosher salt",
      ],
    },
    {
      name: "Olive Topping",
      ingredients: [
        "1/2 cup mixed pitted olives",
        "2 tablespoons chopped fresh basil",
        "2 teaspoons olive oil",
        "1/2 teaspoon grated orange zest",
      ],
    },
  ],
  // ... other recipe fields
};
```

### Displaying Grouped Ingredients

The recipe detail component automatically detects and displays grouped ingredients:

```tsx
// Automatically renders grouped or flat ingredients
{
  renderIngredients();
}
```

## API Changes

### Database Functions Updated

- `createRecipe()`: Now saves ingredient groups
- `updateRecipe()`: Updates ingredient groups
- `getRecipe()`: Fetches ingredient groups
- `getRecipes()`: Fetches ingredient groups for all recipes
- `deleteRecipe()`: Cascades deletion to ingredient groups

### New Functions

- `getIngredientGroups()`: Fetch groups for a recipe
- `saveIngredientGroups()`: Save/update ingredient groups

## UI Components

### Recipe Form

- **Group Management**: Add/remove ingredient groups
- **Group Naming**: Editable group names
- **Ingredient Management**: Add/remove ingredients within groups
- **Visual Design**: Styled group containers with headers

### Recipe Detail

- **Group Display**: Shows grouped ingredients with headers
- **Fallback Support**: Displays flat ingredients for old recipes
- **Responsive Design**: Works on all screen sizes

## CSS Classes

### Recipe Form

- `.ingredientGroup`: Container for each ingredient group
- `.groupHeader`: Header with group name and remove button
- `.groupNameInput`: Input for editing group name
- `.addGroupButton`: Button to add new ingredient groups

### Recipe Detail

- `.ingredientGroups`: Container for all ingredient groups
- `.ingredientGroup`: Individual group container
- `.groupTitle`: Styled group title with decorative line

## Backward Compatibility

### Existing Recipes

- Continue to work without modification
- Display as flat ingredient lists
- Can be edited to add groups

### Data Migration

- No automatic migration of existing recipes
- Users can manually add groups when editing
- Old `ingredients` array preserved for compatibility

## Future Enhancements

### Potential Features

- **Drag & Drop**: Reorder ingredients and groups
- **Templates**: Predefined group templates
- **Bulk Operations**: Add multiple ingredients at once
- **Import/Export**: Support for grouped ingredients in imports

### Performance Optimizations

- **Caching**: Cache ingredient groups for better performance
- **Lazy Loading**: Load groups on demand for large recipes
- **Batch Operations**: Optimize database queries

## Testing

### Manual Testing

1. Create a new recipe with ingredient groups
2. Edit an existing recipe to add groups
3. Verify groups display correctly in recipe detail
4. Test backward compatibility with old recipes

### Database Testing

1. Verify RLS policies work correctly
2. Test cascade deletion
3. Confirm data integrity with foreign keys

## Troubleshooting

### Common Issues

- **Groups not saving**: Check RLS policies and user permissions
- **Display issues**: Verify CSS classes are applied correctly
- **Migration errors**: Ensure tables don't already exist

### Debug Steps

1. Check browser console for errors
2. Verify database schema is correct
3. Test API endpoints directly
4. Check user authentication status
