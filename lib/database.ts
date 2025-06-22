import type { Recipe } from "@/types/recipe";

export const database = {
  // Get all recipes
  async getRecipes(): Promise<Recipe[]> {
    const response = await fetch("/api/recipes");
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }
    return response.json();
  },

  // Get a single recipe by ID
  async getRecipe(id: string): Promise<Recipe | null> {
    const response = await fetch(`/api/recipes/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch recipe");
    }
    return response.json();
  },

  // Create a new recipe
  async createRecipe(
    recipe: Omit<Recipe, "id" | "createdAt">
  ): Promise<Recipe> {
    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      throw new Error("Failed to create recipe");
    }
    return response.json();
  },

  // Update a recipe
  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    const response = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update recipe");
    }
    return response.json();
  },

  // Delete a recipe
  async deleteRecipe(id: string): Promise<void> {
    const response = await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete recipe");
    }
  },

  // Search recipes by title or description
  async searchRecipes(query: string): Promise<Recipe[]> {
    const response = await fetch(`/api/recipes?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error("Failed to search recipes");
    }
    return response.json();
  },

  // Get recipes by category
  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    const response = await fetch(
      `/api/recipes?category=${encodeURIComponent(category)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch recipes by category");
    }
    return response.json();
  },
};
