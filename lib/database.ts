import type { Recipe } from "@/types/recipe";
import { supabase } from "./supabase";

export const database = {
  // Get all recipes
  async getRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch recipes");
    return data.map(normalizeRecipe);
  },

  // Get featured recipes
  async getFeaturedRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch featured recipes");
    return data.map(normalizeRecipe);
  },

  // Get a single recipe by ID
  async getRecipe(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error("Failed to fetch recipe");
    }
    return data ? normalizeRecipe(data) : null;
  },

  // Create a new recipe
  async createRecipe(
    recipe: Omit<Recipe, "id" | "createdAt" | "userId">
  ): Promise<Recipe> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { prepTime, cookTime, ...rest } = recipe;

    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          ...rest,
          user_id: user.id,
          prep_time: prepTime,
          cook_time: cookTime,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase create recipe error:", error);
      throw new Error("Failed to create recipe");
    }
    return normalizeRecipe(data);
  },

  // Update a recipe
  async updateRecipe(
    id: string,
    updates: Partial<Omit<Recipe, "id" | "createdAt" | "userId">>
  ): Promise<Recipe> {
    const { prepTime, cookTime, ...rest } = updates;
    const { data, error } = await supabase
      .from("recipes")
      .update({
        ...rest,
        ...(prepTime !== undefined && { prep_time: prepTime }),
        ...(cookTime !== undefined && { cook_time: cookTime }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update recipe error:", error);
      throw new Error("Failed to update recipe");
    }
    return normalizeRecipe(data);
  },

  // Delete a recipe
  async deleteRecipe(id: string): Promise<void> {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete recipe error:", error);
      throw new Error("Failed to delete recipe");
    }
  },

  // Search recipes by title or description
  async searchRecipes(query: string): Promise<Recipe[]> {
    const { data, error } = await supabase.rpc("search_recipes", {
      search_term: query,
    });
    if (error) {
      console.error("Supabase search recipes error:", error);
      throw new Error("Failed to search recipes");
    }
    return data.map(normalizeRecipe);
  },

  // Get recipes by category
  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch recipes by category");
    return data.map(normalizeRecipe);
  },
};

const normalizeRecipe = (recipe: any): Recipe => ({
  ...recipe,
  userId: recipe.user_id,
  prepTime: recipe.prep_time,
  cookTime: recipe.cook_time,
  createdAt: recipe.created_at,
  updatedAt: recipe.updated_at,
});
