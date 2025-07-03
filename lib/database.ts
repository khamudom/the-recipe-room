import type { Recipe } from "@/types/recipe";
import { SupabaseClient } from "@supabase/supabase-js";

export const database = {
  // Get recipes based on user authentication status
  async getRecipes(supabase: SupabaseClient): Promise<Recipe[]> {
    // Let RLS policies handle the filtering automatically
    // Featured recipes are visible to everyone
    // User recipes are only visible to the owner
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch recipes");
    return data.map(normalizeRecipe);
  },

  // Get user's own recipes only
  async getUserRecipes(supabase: SupabaseClient): Promise<Recipe[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch user recipes");
    return data.map(normalizeRecipe);
  },

  // Get featured recipes
  async getFeaturedRecipes(supabase: SupabaseClient): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch featured recipes");
    return data.map(normalizeRecipe);
  },

  // Get a single recipe by ID
  async getRecipe(
    supabase: SupabaseClient,
    id: string
  ): Promise<Recipe | null> {
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
    supabase: SupabaseClient,
    recipe: Omit<Recipe, "id" | "createdAt" | "userId">
  ): Promise<Recipe> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { prepTime, cookTime, ...rest } = recipe;

    const isAdmin = user.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID;
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          ...rest,
          user_id: user.id,
          prep_time: prepTime,
          cook_time: cookTime,
          featured: isAdmin,
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
    supabase: SupabaseClient,
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
  async deleteRecipe(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete recipe error:", error);
      throw new Error("Failed to delete recipe");
    }
  },

  // Search recipes by title or description
  async searchRecipes(
    supabase: SupabaseClient,
    query: string
  ): Promise<Recipe[]> {
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
  async getRecipesByCategory(
    supabase: SupabaseClient,
    category: string
  ): Promise<Recipe[]> {
    // Let RLS policies handle the filtering automatically
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch recipes by category");
    return data.map(normalizeRecipe);
  },

  // Admin function: Create a featured recipe (visible to everyone)
  // This should only be used by developers/admins
  async createFeaturedRecipe(
    supabase: SupabaseClient,
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
          featured: true, // Featured recipes are visible to everyone
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase create featured recipe error:", error);
      throw new Error("Failed to create featured recipe");
    }
    return normalizeRecipe(data);
  },
};

const normalizeRecipe = (recipe: Record<string, unknown>): Recipe => ({
  id: recipe.id as string,
  userId: recipe.user_id as string,
  title: recipe.title as string,
  description: recipe.description as string,
  ingredients: recipe.ingredients as string[],
  instructions: recipe.instructions as string[],
  prepTime: recipe.prep_time as string,
  cookTime: recipe.cook_time as string,
  servings: recipe.servings as string,
  category: recipe.category as string,
  image: recipe.image as string,
  featured: recipe.featured as boolean,
  createdAt: recipe.created_at as string,
  updatedAt: recipe.updated_at as string,
});
