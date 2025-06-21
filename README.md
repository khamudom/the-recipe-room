# The Recipe Room 🍳

A beautiful, modern recipe management application built with Next.js and React. Store, organize, and discover your favorite recipes with an intuitive interface that makes cooking more enjoyable.

## ✨ Features

- **Recipe Management**: Create, edit, and delete recipes with detailed information
- **Rich Recipe Details**: Include ingredients, instructions, prep time, cook time, and servings
- **Category Organization**: Organize recipes by categories (Dessert, Main Course, Salad, etc.)
- **Search Functionality**: Search recipes by title, category, or ingredients
- **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- **Local Storage**: Recipes are automatically saved to your browser's local storage
- **Image Support**: Add images to your recipes (with placeholder support)
- **Modern UI**: Clean, intuitive interface with smooth animations and transitions

## 📖 How to Use

### Adding a Recipe

1. Click the "+" button in the top right corner
2. Fill in the recipe details:
   - Title and description
   - Ingredients (one per line)
   - Instructions (one per line)
   - Prep time and cook time
   - Number of servings
   - Category
   - Optional image
3. Click "Save Recipe" to add it to your collection

### Managing Recipes

- **View Recipe**: Click on any recipe card to see full details
- **Edit Recipe**: Click the edit button while viewing a recipe
- **Delete Recipe**: Click the delete button while viewing a recipe
- **Search**: Use the search bar to find recipes by title, category, or ingredients

### Sample Recipes

The app comes with three sample recipes to get you started:

- Grandma's Apple Pie (Dessert)
- Hearty Beef Stew (Main Course)
- Mediterranean Quinoa Salad (Salad)

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type safety
- **Styling**: CSS Modules - Scoped styling
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icons
- **Storage**: Local Storage - Client-side data persistence

## 📁 Project Structure

```
the-recipe-room/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   ├── page.module.css    # Main page styles
│   └── page.tsx           # Main application page
├── components/            # Reusable components
│   ├── recipe-card.tsx    # Recipe card component
│   ├── recipe-detail.tsx  # Recipe detail view
│   ├── recipe-form.tsx    # Recipe creation/editing form
│   └── *.module.css       # Component-specific styles
├── types/                 # TypeScript type definitions
│   └── recipe.ts          # Recipe interface
├── public/                # Static assets
│   ├── favicon.svg        # App icon
│   └── placeholder.svg    # Placeholder image
└── package.json           # Dependencies and scripts
```

## 🎨 Design Features

- **Responsive Layout**: Adapts to different screen sizes
- **Card-based UI**: Clean recipe cards with hover effects
- **Typography**: Readable fonts and proper hierarchy
- **Color Scheme**: Warm, food-friendly color palette
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Proper semantic HTML and keyboard navigation

## 📝 Recipe Data Structure

Each recipe follows this structure:

```typescript
interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  category: string;
  image?: string; // Base64 encoded image or URL
  createdAt: string;
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by the joy of cooking and sharing recipes

---

**Happy Cooking! 👨‍🍳👩‍🍳**
