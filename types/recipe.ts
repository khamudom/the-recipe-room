export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  servings: string;
  category: string;
  image?: string; // Base64 encoded image or URL
  featured?: boolean;
  byAdmin?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AIRecipeAnalysisResult {
  title?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  category?: string;
  image?: string;
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
