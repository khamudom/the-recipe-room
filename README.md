# The Recipe Room 🍳

A beautiful, modern recipe management application built with Next.js and React. Store, organize, and discover your favorite recipes with an intuitive interface that makes cooking more enjoyable.

## ✨ Features

- **Recipe Management**: Create, edit, and delete recipes with detailed information
- **AI Recipe Analysis**: Upload a photo of a recipe and let AI extract all the details automatically
- **Rich Recipe Details**: Include ingredients, instructions, prep time, cook time, and servings
- **Category Organization**: Organize recipes by categories (Dessert, Main Course, Salad, etc.)
- **Search Functionality**: Search recipes by title, category, or ingredients
- **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- **Local Storage**: Recipes are automatically saved to your browser's local storage
- **Image Support**: Add images to your recipes (with placeholder support)
- **Modern UI**: Clean, intuitive interface with smooth animations and transitions

## 🤖 AI Recipe Analysis

The Recipe Room now includes an AI-powered feature that can automatically extract recipe information from images!

### How It Works

1. **Upload Recipe Image**: Take a photo of a recipe from a cookbook, handwritten note, or any recipe image
2. **AI Analysis**: Our AI analyzes the image and extracts:
   - Recipe title
   - Description
   - Ingredients list
   - Step-by-step instructions
   - Prep and cook times
   - Number of servings
   - Recipe category
3. **Review & Edit**: Review the extracted information and make any adjustments
4. **Save Recipe**: Save the recipe to your collection

### Supported Image Types

- 📖 Cookbook pages
- 📝 Handwritten recipe cards
- 💻 Screenshots from websites
- 📱 Photos of recipe cards
- 🖨️ Printed recipes

### Tips for Best Results

- Ensure the recipe text is clearly visible and well-lit
- Try to capture the entire recipe in one image
- Handwritten recipes work best when written clearly
- Printed recipes from books or websites work great

## 📖 How to Use

### Adding a Recipe

#### Manual Entry

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

#### AI-Powered Entry

1. Click the "+" button in the top right corner
2. Click "Analyze Recipe Image" in the AI Recipe Analysis section
3. Upload a photo of your recipe
4. Click "Analyze Recipe" and wait for AI processing
5. Review the extracted information and make any adjustments
6. Click "Save Recipe" to add it to your collection

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
- **AI Integration**: Mock AI service (easily replaceable with real AI services)

## 📁 Project Structure

```
the-recipe-room/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── analyze-recipe/ # AI recipe analysis endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   ├── page.module.css    # Main page styles
│   └── page.tsx           # Main application page
├── components/            # Reusable components
│   ├── ai-recipe-analyzer/ # AI recipe analysis component
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

## 🤖 AI Integration

The current implementation uses a mock AI service that simulates recipe analysis. To integrate with real AI services, see the [AI Integration Guide](AI_INTEGRATION_GUIDE.md) for detailed instructions on:

- OpenAI GPT-4 Vision API
- Google Cloud Vision API
- Azure Computer Vision
- AWS Textract
- Cost considerations and security best practices

## 🎨 Design Features

- **Responsive Layout**: Adapts to different screen sizes
- **Card-based UI**: Clean recipe cards with hover effects
- **Typography**: Readable fonts and proper hierarchy
- **Color Scheme**: Warm, food-friendly color palette
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Proper semantic HTML and keyboard navigation
- **AI Interface**: Beautiful gradient design for AI analysis feature

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/the-recipe-room.git
cd the-recipe-room
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing the AI Feature

1. Start the development server
2. Navigate to the "Add Recipe" page
3. Click "Analyze Recipe Image"
4. Upload any image (the mock AI will return a sample recipe)
5. Review and save the extracted recipe

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by the joy of cooking and sharing recipes
- AI integration inspired by modern recipe management needs

---

**Happy Cooking! 👨‍🍳👩‍🍳**
