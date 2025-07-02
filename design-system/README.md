# Design System

This directory contains the design system for The Recipe Room application.

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
