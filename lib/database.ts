/**
 * Database Operations Layer
 *
 * This file provides a centralized interface for all database operations related to recipes.
 * It abstracts the Supabase client interactions and provides a clean API for the application
 * to perform CRUD operations on recipes.
 *
 * Key Features:
 * - Recipe CRUD operations (Create, Read, Update, Delete)
 * - Search functionality with fallback mechanisms
 * - Category-based filtering
 * - Admin-specific operations for featured recipes
 * - Automatic data normalization between database and application formats
 * - Row Level Security (RLS) policy enforcement
 *
 * Authentication & Authorization:
 * - Uses Supabase RLS policies for automatic filtering
 * - Featured recipes are visible to everyone
 * - User recipes are only visible to the owner
 * - Admin users can create featured recipes
 *
 * Usage:
 * - Import the database object and use its methods
 * - Pass the Supabase client instance to each method
 * - All methods return normalized Recipe objects
 */

import type { Recipe } from "@/types/recipe";
import { SupabaseClient } from "@supabase/supabase-js";

export const database = {
  // Get recipes based on user authentication status
  // RLS policies automatically filter based on user permissions
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
  // Requires authentication and filters by user_id
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

  // Get featured recipes (visible to all users)
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
  // Returns null if recipe doesn't exist or user doesn't have access
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
      if (error.code === "PGRST116") return null; // No rows returned
      throw new Error("Failed to fetch recipe");
    }
    return data ? normalizeRecipe(data) : null;
  },

  // Create a new recipe
  // Automatically sets user_id and handles admin permissions
  async createRecipe(
    supabase: SupabaseClient,
    recipe: Omit<Recipe, "id" | "createdAt" | "userId">
  ): Promise<Recipe> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { prepTime, cookTime, featured, ...rest } = recipe;

    // Check if user is admin for featured recipe creation
    const isAdmin = user.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID;
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          ...rest,
          user_id: user.id,
          prep_time: prepTime,
          cook_time: cookTime,
          featured: isAdmin && featured ? true : false,
          by_admin: isAdmin, // Mark if created by admin
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
  // Only allows updates to user's own recipes or admin updates
  async updateRecipe(
    supabase: SupabaseClient,
    id: string,
    updates: Partial<Omit<Recipe, "id" | "createdAt" | "userId">>
  ): Promise<Recipe> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { prepTime, cookTime, featured, ...rest } = updates;
    const isAdmin = user.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID;

    const { data, error } = await supabase
      .from("recipes")
      .update({
        ...rest,
        ...(prepTime !== undefined && { prep_time: prepTime }),
        ...(cookTime !== undefined && { cook_time: cookTime }),
        ...(featured !== undefined && isAdmin && { featured }),
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
  // RLS policies ensure users can only delete their own recipes
  async deleteRecipe(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) {
      console.error("Supabase delete recipe error:", error);
      throw new Error("Failed to delete recipe");
    }
  },

  // Search recipes by title, description, category, or ingredients
  // Uses RPC function with fallback to manual search
  async searchRecipes(
    supabase: SupabaseClient,
    query: string
  ): Promise<Recipe[]> {
    // Try the optimized RPC function first for better performance
    const { data, error } = await supabase.rpc("search_recipes", {
      search_term: query,
    });

    if (!error && data) {
      return data.map(normalizeRecipe);
    }

    // Log the error for debugging
    console.error(
      "Supabase search recipes RPC error:",
      error,
      "Falling back to ilike search.",
      { query }
    );

    // Fallback: Perform a performant ilike/or query
    // Only show public/featured/admin recipes to anonymous users
    let fallbackQuery = supabase
      .from("recipes")
      .select("*")
      .or(
        [
          `title.ilike.%${query}%`,
          `description.ilike.%${query}%`,
          `category.ilike.%${query}%`,
          `ingredients.cs.{${query}}`, // Try to match ingredients array
        ].join(",")
      )
      .order("created_at", { ascending: false });

    // If not authenticated, only show featured/admin recipes
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      fallbackQuery = fallbackQuery.or("featured.eq.true,by_admin.eq.true");
    }

    const { data: fallbackData, error: fallbackError } = await fallbackQuery;
    if (fallbackError) {
      console.error("Supabase search recipes fallback error:", fallbackError);
      throw new Error("Failed to search recipes (fallback)");
    }
    return fallbackData.map(normalizeRecipe);
  },

  // Get recipes by category
  // RLS policies automatically filter based on user permissions
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
          by_admin: true, // Admin-created recipes are visible to everyone
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

// Helper function to normalize database records to application format
// Converts snake_case database fields to camelCase application fields
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
  byAdmin: recipe.by_admin as boolean,
  createdAt: recipe.created_at as string,
  updatedAt: recipe.updated_at as string,
});
