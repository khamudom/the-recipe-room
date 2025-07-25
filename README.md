# The Recipe Room 🍳

A recipe management application built with Next.js 15, React, and Supabase. Store, organize, and discover your favorite recipes with an intuitive interface that makes cooking more enjoyable.

🌐 **[Live Demo](https://www.thereciperoom.net/)**

## ✨ Features

- **User Authentication**: Secure sign up, sign in, and password reset with Supabase Auth
- **Recipe Management**: Create, edit, and delete recipes with detailed information
- **AI Recipe Analysis**: Upload a photo of a recipe and let AI extract all the details automatically using OpenAI GPT-4 Vision
- **AI Chef Assistant**: Chat with Chef Gusto, your virtual cooking assistant powered by OpenAI GPT-4
- **Rich Recipe Details**: Include ingredients, instructions, prep time, cook time, and servings
- **Category Organization**: Organize recipes by categories (Appetizer, Breakfast, Lunch, Dinner, Side Dish, Dessert, Snack, Beverage)
- **Search Functionality**: Full-text search recipes by title, description, ingredients, or category
- **Featured Recipes**: Admins can create featured recipes visible to all users
- **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- **Database Storage**: Recipes are securely stored in Supabase with Row Level Security
- **Image Support**: Add images to your recipes (with placeholder support)
- **Modern UI**: Clean, intuitive interface with smooth animations and transitions
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Advanced State Management**: React Query integration for efficient data fetching and caching
- **Lottie Animations**: Beautiful loading animations and micro-interactions
- **Performance Optimizations**: Intelligent caching, preloading, and optimized rendering
- **Development Tools**: Enhanced debugging capabilities in development mode
- **Mobile Carousel**: Smooth, touch-friendly carousel for featured recipes on mobile devices
- **Progressive Web App**: Installable app with offline support and automatic updates

## 🚀 New Features & Improvements

### Enhanced Mobile Experience

The application now provides an exceptional mobile experience with:

- **Swiper.js Carousel**: Professional carousel implementation for featured recipes
- **Touch & Mouse Support**: Smooth drag/swipe functionality on both touch and mouse devices
- **Optimized Performance**: Hardware-accelerated animations and smooth scrolling
- **Responsive Layouts**: Adaptive grid/carousel layouts based on screen size
- **Mobile-First Design**: Optimized interactions for mobile devices

### React Query Integration

The application now uses **TanStack React Query** for advanced state management:

- **Intelligent Caching**: Automatic caching of recipe data with configurable stale times
- **Background Updates**: Seamless data synchronization across components
- **Optimistic Updates**: Instant UI updates with automatic rollback on errors
- **Error Handling**: Built-in error states and retry mechanisms
- **Loading States**: Consistent loading indicators throughout the app

### Enhanced Loading Experience

- **Lottie Animations**: Beautiful, smooth loading animations using Lottie
- **Animation Caching**: Preloaded animations for instant display
- **Loading Skeletons**: Elegant skeleton loaders for better perceived performance
- **Progressive Loading**: Smart loading states that adapt to different scenarios

### Robust Error Handling

- **Error Boundaries**: Comprehensive error catching and recovery
- **Graceful Degradation**: App continues to function even when features fail
- **User-Friendly Messages**: Clear, actionable error messages
- **Development Debugging**: Detailed error information in development mode

### Performance Optimizations

- **Query Optimization**: Efficient data fetching with React Query
- **Component Memoization**: Optimized re-rendering for better performance
- **Image Optimization**: Next.js Image component for optimized image loading
- **Code Splitting**: Automatic code splitting for faster initial loads
- **Hardware Acceleration**: GPU-accelerated animations and transitions

### Development Experience

- **Supabase Debugging**: Development-only Supabase client exposure for debugging
- **Enhanced Logging**: Better error tracking and debugging information
- **Type Safety**: Comprehensive TypeScript coverage throughout the application

## 🤖 AI Features

### AI Recipe Analysis

The Recipe Room includes an AI-powered feature that can automatically extract recipe information from images using OpenAI GPT-4 Vision!

#### How It Works

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

#### Supported Image Types

- 📖 Cookbook pages
- 📝 Handwritten recipe cards
- 💻 Screenshots from websites
- 📱 Photos of recipe cards
- 🖨️ Printed recipes

#### Tips for Best Results

- Ensure the recipe text is clearly visible and well-lit
- Try to capture the entire recipe in one image
- Handwritten recipes work best when written clearly
- Printed recipes from books or websites work great

### AI Chef Assistant

Chat with Chef Gusto, your virtual cooking assistant! Get help with:

- Cooking techniques and step-by-step instructions
- Ingredient substitutions and measurements
- Wine pairings and drink recommendations
- Food safety and best practices
- Meal planning and creative suggestions
- Global cuisines and food science

## 📖 How to Use

### Getting Started

1. **Sign Up**: Create an account to start managing your recipes
2. **Browse Featured Recipes**: View recipes shared by the community
3. **Create Your First Recipe**: Add your own recipes manually or using AI analysis

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
- **Browse by Category**: Click on category cards to view all recipes in that category

### AI Chef Assistant

- Click the floating chef button to open the chat interface
- Ask any cooking-related questions
- Get personalized advice and recommendations
- Close the chat when you're done

### Mobile Experience

- **Swipe Through Recipes**: On mobile, swipe left/right through featured recipes
- **Touch-Friendly**: All interactions optimized for touch devices
- **Responsive Design**: Automatic layout adjustments for different screen sizes
- **Smooth Animations**: Hardware-accelerated transitions

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type safety
- **Styling**: CSS Modules - Scoped styling
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icons
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL database with real-time features
- **Authentication**: Supabase Auth - Secure user authentication
- **AI Integration**: [OpenAI GPT-4](https://openai.com/) - Recipe analysis and chef assistant
- **State Management**: [TanStack React Query](https://tanstack.com/query) - Advanced data fetching and caching
- **Carousel**: [Swiper.js](https://swiperjs.com/) - Professional carousel and touch slider
- **Animations**: [Lottie React](https://lottiefiles.com/) - Beautiful loading animations
- **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown) - Rich text rendering
- **Deployment**: Ready for Vercel, Netlify, or any Next.js hosting platform

## 📁 Project Structure

```
the-recipe-room/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── analyze-recipe/ # AI recipe analysis endpoint
│   │   ├── chef/          # AI chef assistant endpoint
│   │   └── recipes/       # Recipe CRUD operations
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign in page
│   │   ├── signup/        # Sign up page
│   │   └── reset-password/ # Password reset page
│   ├── category/          # Category browsing pages
│   ├── recipe/            # Recipe detail and edit pages
│   ├── search/            # Search results page
│   ├── add/               # Add new recipe page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application page
├── components/            # Reusable components
│   ├── ai-chef/           # AI chef assistant components
│   ├── ai-recipe-analyzer/ # AI recipe analysis component
│   ├── auth-form/         # Authentication form components
│   ├── recipe-card/       # Recipe card component
│   ├── recipe-detail/     # Recipe detail view
│   ├── recipe-form/       # Recipe creation/editing form
│   ├── search-controls/   # Search and navigation controls
│   ├── categories-section/ # Category browsing section
│   ├── featured-recipes/  # Featured recipes section with Swiper carousel
│   ├── loading-skeleton/  # Loading skeleton components
│   ├── loading-spinner/   # Lottie-based loading animations
│   ├── error-boundary/    # Error boundary components
│   ├── lottie-preloader/  # Animation preloading utilities
│   ├── dev/               # Development-only components
│   └── *.module.css       # Component-specific styles
├── lib/                   # Utility libraries
│   ├── auth-context.tsx   # Authentication context
│   ├── database.ts        # Database operations
│   ├── supabase.ts        # Supabase client configuration
│   ├── constants.ts       # Application constants
│   └── lottie-cache.ts    # Lottie animation caching
├── hooks/                 # Custom React hooks
│   ├── use-recipes.ts     # Legacy recipe data management hook
│   └── use-recipes-query.ts # React Query-based recipe hooks
├── types/                 # TypeScript type definitions
│   └── recipe.ts          # Recipe interface
├── supabase/              # Database schema and setup
│   └── schema.sql         # PostgreSQL schema
├── public/                # Static assets
│   ├── assets/            # Images and animations
│   │   └── lottie/        # Lottie animation files
│   └── favicon.svg        # App icon
├── middleware.ts          # Next.js middleware for auth
└── package.json           # Dependencies and scripts
```

## 🔐 Authentication & Security

The Recipe Room uses Supabase for secure authentication and data storage:

- **User Registration**: Email/password signup with email verification
- **User Login**: Secure authentication with session management
- **Password Reset**: Secure password reset via email
- **Row Level Security**: Database policies ensure users can only access their own recipes
- **Featured Recipes**: Admins can create recipes visible to all users
- **Protected Routes**: Authentication required for recipe management

## 🤖 AI Integration

The application integrates with OpenAI's GPT-4 for two main features:

### Recipe Analysis (GPT-4 Vision)

- Analyzes recipe images to extract structured data
- Supports various image formats and sources
- Returns validated JSON with recipe information
- Handles errors gracefully with user-friendly messages

### AI Chef Assistant (GPT-4)

- Provides cooking advice and techniques
- Answers questions about ingredients and substitutions
- Offers meal planning suggestions
- Explains cooking methods and food science

## 📱 Mobile Experience

The Recipe Room is optimized for mobile devices with:

- **Touch-Friendly Interface**: All interactions designed for touch
- **Swiper.js Carousel**: Professional carousel for featured recipes
- **Responsive Design**: Adaptive layouts for all screen sizes
- **Smooth Animations**: Hardware-accelerated transitions
- **Progressive Web App**: Installable with offline support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/the-recipe-room.git
   cd the-recipe-room
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_ADMIN_USER_ID=your_admin_user_id
   ```

4. **Set up the database**
   ```bash
   # Run the schema.sql file in your Supabase SQL editor
   # Or use the Supabase CLI
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

The Recipe Room is ready for deployment on Vercel, Netlify, or any Next.js hosting platform.

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy automatically on every push

### Environment Variables

Make sure to set these environment variables in production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_ADMIN_USER_ID`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [OpenAI](https://openai.com/) for the AI capabilities
- [Swiper.js](https://swiperjs.com/) for the carousel functionality
- [Lottie](https://lottiefiles.com/) for the beautiful animations
- [TanStack](https://tanstack.com/) for React Query
- [Lucide](https://lucide.dev/) for the beautiful icons
