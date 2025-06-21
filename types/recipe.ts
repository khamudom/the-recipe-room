export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: string
  cookTime: string
  servings: number
  category: string
  image?: string // Base64 encoded image or URL
  createdAt: string
}
