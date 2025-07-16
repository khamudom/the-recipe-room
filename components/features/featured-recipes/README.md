# FeaturedRecipes Component

The `FeaturedRecipes` component displays featured recipes with a responsive layout that adapts to different screen sizes. On desktop, it shows a grid layout, while on mobile devices (≤767px), it displays a smooth, touch-friendly carousel powered by Swiper.js.

## Features

- **Responsive Design**: Automatic layout switching between grid (desktop) and carousel (mobile)
- **Swiper.js Carousel**: Professional carousel implementation for mobile devices
- **Touch & Mouse Support**: Smooth drag/swipe functionality on both touch and mouse devices
- **Optimized Performance**: Hardware-accelerated animations and smooth scrolling
- **Loading States**: Elegant skeleton loaders during data fetching
- **Empty States**: Graceful handling when no featured recipes are available

## Props

- `recipes: Recipe[]` - The full list of recipes to choose from
- `isLoading: boolean` - Loading state
- `onRecipeClick: (recipe: Recipe) => void` - Click handler for recipes
- `maxRecipes?: number` - Maximum number of recipes to show (defaults to 3 for desktop, 6 for mobile)

## Usage Examples

### 1. Show Default Featured Recipes

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

## Layout Behavior

### Desktop (≥768px)
- **Grid Layout**: Displays recipes in a responsive 3-column grid
- **Default Count**: Shows up to 3 featured recipes
- **No Carousel**: Carousel is hidden on desktop for better performance

### Mobile (<768px)
- **Carousel Layout**: Swiper.js-powered carousel with smooth animations
- **Default Count**: Shows up to 6 featured recipes
- **Touch Support**: Swipe left/right to navigate through recipes
- **Mouse Support**: Click and drag with mouse for desktop users testing mobile view
- **Smooth Scrolling**: Hardware-accelerated animations and momentum-based scrolling

## Swiper.js Configuration

The mobile carousel uses Swiper.js with the following optimized settings:

```tsx
<Swiper
  modules={[Mousewheel, FreeMode]}
  spaceBetween={24}
  slidesPerView="auto"
  freeMode={{
    enabled: true,
    sticky: true,
    momentumBounce: false,
    momentumRatio: 0.4,
    momentumVelocityRatio: 0.4,
    minimumVelocity: 0.02,
  }}
  mousewheel={{
    forceToAxis: true,
    sensitivity: 1,
  }}
  grabCursor={true}
  resistance={true}
  resistanceRatio={0.85}
  threshold={10}
  shortSwipes={true}
  longSwipes={true}
  longSwipesRatio={0.5}
  longSwipesMs={300}
  followFinger={true}
/>
```

### Key Features:
- **Free Mode**: Smooth, momentum-based scrolling
- **Touch & Mouse**: Works on both touch devices and mouse
- **Resistance**: Prevents overswiping at edges
- **Threshold**: Requires intentional movement to trigger swipes
- **Hardware Acceleration**: GPU-accelerated animations for smooth performance

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

## Mobile Experience

### Touch Interactions
- **Swipe Left/Right**: Navigate through recipes
- **Smooth Momentum**: Natural momentum-based scrolling
- **Edge Resistance**: Prevents accidental overswiping
- **Visual Feedback**: Grab cursor and smooth animations

### Mouse Interactions (Desktop Testing Mobile)
- **Click & Drag**: Drag horizontally to scroll through recipes
- **Grab Cursor**: Visual feedback when hovering over draggable area
- **Smooth Scrolling**: Hardware-accelerated animations

### Performance Optimizations
- **Hardware Acceleration**: GPU-accelerated transforms
- **Touch Optimizations**: `-webkit-overflow-scrolling: touch` for iOS
- **Layout Stability**: Prevents layout shifts during animations
- **Memory Management**: Efficient event handling and cleanup

## How It Works

- Shows the first N recipes (based on maxRecipes prop) that have `featured: true`
- Recipes are displayed in the order they appear in the recipes array
- If no recipes are featured, the section will be empty with appropriate spacing
- The component automatically handles loading states and empty states
- Only admin users can create or update featured recipes
- Admin-created recipes are automatically visible to all users
- Responsive layout automatically switches based on screen size

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

## Dependencies

The component requires the following dependencies:

```json
{
  "swiper": "^latest",
  "react": "^18.0.0",
  "next": "^15.0.0"
}
```

## CSS Classes

The component uses the following CSS classes:

- `.featuredSection` - Main container
- `.sectionTitle` - Section header styling
- `.decorativeLine` - Decorative line under the title
- `.recipeGrid` - Desktop grid layout
- `.recipeCarousel` - Mobile carousel container
- `.swiperContainer` - Swiper.js container
- `.recipeCarouselItem` - Individual carousel items

## Best Practices

1. **Admin-only access** - Only admins should be able to mark recipes as featured
2. **Limit featured recipes** - Don't mark too many recipes as featured to keep the homepage clean
3. **Regular updates** - Consider rotating featured recipes periodically to keep content fresh
4. **Quality control** - Use featured recipes to highlight your best content
5. **Admin content** - Admin-created recipes are automatically public, so use this for official content
6. **Mobile optimization** - Test the carousel on various mobile devices and screen sizes
7. **Performance** - Monitor carousel performance on lower-end devices
8. **Accessibility** - Ensure the carousel is accessible to users with disabilities

## Troubleshooting

### Carousel Not Working on Mobile
- Ensure Swiper.js is properly installed: `npm install swiper`
- Check that CSS imports are included in your component
- Verify that the component is only rendered on mobile screens

### Performance Issues
- Monitor for memory leaks in event listeners
- Ensure hardware acceleration is enabled
- Consider reducing the number of featured recipes if performance is poor

### Touch Issues
- Test on actual mobile devices, not just browser dev tools
- Ensure touch events are not being prevented by other elements
- Check that the carousel container has proper touch event handling
