# Page Transition System

A mobile-optimized page transition system for The Recipe Room app that provides smooth sliding animations between pages.

## Features

- **Mobile-only transitions**: Animations only apply on mobile devices (≤768px) for better performance
- **Smart navigation detection**: Automatically detects back/forward navigation and applies appropriate transitions
- **Multiple transition types**: Support for slide, fade, and slide-from-left animations
- **Accessibility**: Respects `prefers-reduced-motion` user preference
- **Performance optimized**: Uses CSS transforms and `will-change` for smooth animations

## Components

### PageTransition

The main wrapper component that handles page transitions.

```tsx
import { PageTransition } from "@/components/ui/page-transition/page-transition";

<PageTransition transitionType="slide">
  <main>{children}</main>
</PageTransition>;
```

**Props:**

- `children`: React nodes to wrap
- `transitionType`: "slide" | "fade" | "slideFromLeft" (default: "slide")

### usePageTransition Hook

A custom hook for programmatic control of page transitions.

```tsx
import { usePageTransition } from "@/hooks/use-page-transition";

const { navigateWithTransition, isTransitioning, transitionType } =
  usePageTransition({
    onTransitionStart: () => console.log("Transition started"),
    onTransitionEnd: () => console.log("Transition ended"),
    transitionType: "slide",
  });

// Navigate with custom transition
navigateWithTransition("/recipe/123", "fade");
```

**Options:**

- `onTransitionStart`: Callback when transition starts
- `onTransitionEnd`: Callback when transition ends
- `transitionType`: Default transition type

**Returns:**

- `isTransitioning`: Boolean indicating if a transition is active
- `transitionType`: Current transition type
- `navigateWithTransition`: Function to navigate with custom transition

## Transition Types

### Slide (Default)

- Slides in from the right
- Used for forward navigation
- Smooth horizontal movement

### Slide From Left

- Slides in from the left
- Automatically used for back navigation
- Provides visual feedback for navigation direction

### Fade

- Fades in with slight scale effect
- Good for modal-like transitions
- Subtle and elegant

## Usage Examples

### Basic Implementation

```tsx
// In layout.tsx
import { PageTransition } from "@/components/ui/page-transition/page-transition";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navigation />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
      </body>
    </html>
  );
}
```

### Custom Navigation

```tsx
// In a component
import { usePageTransition } from "@/hooks/use-page-transition";

export function MyComponent() {
  const { navigateWithTransition, isTransitioning } = usePageTransition();

  const handleRecipeClick = (recipeId: string) => {
    navigateWithTransition(`/recipe/${recipeId}`, "slide");
  };

  return (
    <button onClick={() => handleRecipeClick("123")} disabled={isTransitioning}>
      View Recipe
    </button>
  );
}
```

### Conditional Transitions

```tsx
const { navigateWithTransition } = usePageTransition();

const handleNavigation = (path: string, isModal: boolean) => {
  const transitionType = isModal ? "fade" : "slide";
  navigateWithTransition(path, transitionType);
};
```

## CSS Customization

The transition system uses CSS custom properties for easy customization:

```css
:root {
  --transition-duration: 0.3s;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Mobile Optimization

- Transitions only apply on screens ≤768px
- Uses `-webkit-overflow-scrolling: touch` for smooth scrolling
- Prevents horizontal scroll during transitions
- Optimized for touch interactions

## Accessibility

- Respects `prefers-reduced-motion` media query
- Disables all animations for users who prefer reduced motion
- Maintains functionality without animations

## Performance Considerations

- Uses CSS transforms instead of layout properties
- `will-change` property for GPU acceleration
- Transitions disabled on desktop for better performance
- Minimal JavaScript overhead

## Browser Support

- Modern browsers with CSS transforms support
- Graceful degradation for older browsers
- Touch-friendly on mobile devices
