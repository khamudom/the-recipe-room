# Design System

This directory contains the design system for The Recipe Room application, including design tokens, component styles, and mobile optimization guidelines.

## Structure

- `tokens/` - Design tokens (colors, typography, spacing, etc.)
- `components/` - Reusable component styles
- `utilities/` - Utility classes and helpers

## Usage

Import the design tokens in your CSS files:

```css
@import "../design-system/tokens/colors.css";
```

## Color Palette

The Recipe Room uses a warm, food-inspired color palette that evokes comfort and culinary creativity.

### Primary Colors

- **Primary**: Deep red (#8b0000) - Main brand color
- **Secondary**: Warm orange (#d97706) - Accent color
- **Tertiary**: Golden yellow (#fbbf24) - Highlight color

### Neutral Colors

- **Background**: Warm cream (#fef7ed) - Main background
- **Surface**: Light cream (#fefcf3) - Card backgrounds
- **Text**: Rich brown (#78350f) - Primary text
- **Muted**: Medium brown (#92400e) - Secondary text

### Semantic Colors

- **Success**: Green (#16a34a) - Positive actions
- **Error**: Red (#dc2626) - Errors and warnings
- **Warning**: Amber (#f59e0b) - Cautions
- **Info**: Blue (#3b82f6) - Information

### Additional Accent Colors

- **Purple**: (#667eea) - AI analyzer accents
- **Gold**: (#ffd700) - Special highlights
- **Yellow**: (#f4d03f) - Navigation accents
- **Brown**: (#a0522d) - Form elements
- **Tan**: (#d2b48c) - Borders and backgrounds

## Color Variables

The design system provides semantic color variables that map to your existing color scheme:

```css
/* Primary colors */
--color-primary: #8b0000;
--color-secondary: #d97706;
--color-tertiary: #fbbf24;

/* Text colors */
--color-text-primary: #78350f;
--color-text-secondary: #92400e;
--color-text-muted: #6b7280;

/* Background colors */
--color-background-primary: #fef7ed;
--color-background-secondary: #fefcf3;

/* Border colors */
--color-border-primary: #fbbf24;
--color-border-secondary: #d97706;
```

## Utility Classes

The design system includes utility classes for quick styling:

```css
.color-primary {
  color: var(--color-primary);
}
.bg-primary {
  background-color: var(--color-primary);
}
.border-primary {
  border-color: var(--color-primary);
}
```

## Mobile Optimization

### Hardware Acceleration

For smooth animations and transitions on mobile devices, use hardware acceleration:

```css
.hardware-accelerated {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: transform;
}
```

### Touch Optimizations

Optimize touch interactions for mobile devices:

```css
.touch-optimized {
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
```

### Responsive Breakpoints

The design system uses these breakpoints for responsive design:

```css
/* Mobile first approach */
@media (min-width: 768px) {
  /* Tablet and up */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large desktop */
}
```

## Carousel Styling

### Swiper.js Integration

For carousel components using Swiper.js, use these optimized styles:

```css
.swiper-container {
  width: 100%;
  height: 100%;
  /* Hardware acceleration for smoother animations */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: transform;
}

.swiper-slide {
  /* Prevent layout shifts during animation */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: transform;
}
```

### Carousel Item Sizing

```css
.carousel-item {
  width: calc(100% - 2rem) !important;
  max-width: 400px;
  /* Prevent layout shifts during animation */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: transform;
}
```

## Performance Guidelines

### Animation Performance

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `margin`, `padding` (layout-triggering)
- Use `will-change` sparingly and only when needed
- Prefer CSS animations over JavaScript when possible

### Mobile Performance

- Minimize layout shifts during animations
- Use `contain: layout` for isolated components
- Optimize images for mobile devices
- Consider reducing animation complexity on lower-end devices

### Touch Performance

- Ensure touch targets are at least 44px × 44px
- Provide visual feedback for touch interactions
- Use `touch-action` to control touch behavior
- Test on actual mobile devices, not just browser dev tools

## Accessibility

### Color Contrast

Ensure sufficient color contrast for text readability:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Focus States

Provide clear focus indicators:

```css
.focusable:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Reduced Motion

Respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Component Guidelines

### Consistent Spacing

Use consistent spacing throughout the application:

```css
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}
```

### Typography Scale

Maintain consistent typography hierarchy:

```css
:root {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
}
```

### Border Radius

Use consistent border radius values:

```css
:root {
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
}
```

## Best Practices

1. **Mobile First**: Design for mobile devices first, then enhance for larger screens
2. **Performance**: Optimize for performance, especially on mobile devices
3. **Accessibility**: Ensure all components are accessible to users with disabilities
4. **Consistency**: Maintain consistent spacing, typography, and color usage
5. **Touch Friendly**: Design for touch interactions on mobile devices
6. **Hardware Acceleration**: Use GPU-accelerated properties for smooth animations
7. **Reduced Motion**: Respect user preferences for reduced motion
8. **Testing**: Test on actual devices, not just browser dev tools
