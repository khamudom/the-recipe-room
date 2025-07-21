export interface IngredientGroup {
  id?: string;
  name: string;
  ingredients: string[];
  sortOrder?: number;
}

export interface InstructionGroup {
  id?: string;
  name: string;
  instructions: string[];
  sortOrder?: number;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description: string;
  ingredients: string[]; // Keep for backward compatibility
  ingredientGroups?: IngredientGroup[]; // Grouped ingredients structure
  instructions: string[]; // Keep for backward compatibility
  instructionGroups?: InstructionGroup[]; // Grouped instructions structure
  prepTime?: string;
  cookTime?: string;
  servings: string;
  category: string;
  image?: string; // Image URL (Supabase storage URL or base64 for backward compatibility)
  imagePath?: string; // Supabase storage path for the image
  featured?: boolean;
  featuredOrder?: number;
  byAdmin?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AIRecipeAnalysisResult {
  title?: string;
  description?: string;
  ingredients?: string[];
  ingredientGroups?: IngredientGroup[];
  instructions?: string[];
  instructionGroups?: InstructionGroup[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  category?: string;
  image?: string;
  imagePath?: string;
}

export interface MultiImageAnalysisRequest {
  imageData: string | string[];
}

export interface MultiImageAnalysisResponse {
  recipe: AIRecipeAnalysisResult;
  confidence: number;
  processingTime: number;
  imageCount?: number;
}
