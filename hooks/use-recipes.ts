"use client";

import { useState, useEffect, useCallback } from "react";
import { database } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { Recipe } from "@/types/recipe";

interface UseRecipesReturn {
  recipes: Recipe[];
  featuredRecipes: Recipe[];
  isLoading: boolean;
  isFeaturedLoading: boolean;
  error: string | null;
  featuredError: string | null;
  searchRecipes: (query: string) => Promise<void>;
  getRecipe: (id: string) => Promise<Recipe | null>;
  addRecipe: (
    recipe: Omit<Recipe, "id" | "createdAt" | "userId">
  ) => Promise<void>;
  updateRecipe: (
    id: string,
    recipe: Omit<Recipe, "id" | "createdAt" | "userId">
  ) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<void>;
  refreshRecipes: () => Promise<void>;
  refreshFeatured: () => Promise<void>;
}

export function useRecipes(): UseRecipesReturn {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  const loadRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await database.getRecipes(supabase);
      setRecipes(data);
    } catch (err) {
      console.error("Error loading recipes:", err);
      setError(ERROR_MESSAGES.LOAD_RECIPES);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFeaturedRecipes = useCallback(async () => {
    try {
      setIsFeaturedLoading(true);
      setFeaturedError(null);
      const data = await database.getFeaturedRecipes(supabase);
      setFeaturedRecipes(data);
    } catch (err) {
      console.error("Error loading featured recipes:", err);
      setFeaturedError(ERROR_MESSAGES.LOAD_FEATURED);
      setFeaturedRecipes([]);
    } finally {
      setIsFeaturedLoading(false);
    }
  }, []);

  const searchRecipes = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        await loadRecipes();
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const results = await database.searchRecipes(supabase, query);
        setRecipes(results);
      } catch (err) {
        console.error("Error searching recipes:", err);
        setError(ERROR_MESSAGES.SEARCH_RECIPES);
        // Fallback to client-side search using current recipes
        const filtered = recipes.filter(
          (recipe) =>
            recipe.title.toLowerCase().includes(query.toLowerCase()) ||
            recipe.description.toLowerCase().includes(query.toLowerCase()) ||
            recipe.ingredients.some((ingredient) =>
              ingredient.toLowerCase().includes(query.toLowerCase())
            ) ||
            recipe.category.toLowerCase().includes(query.toLowerCase())
        );
        setRecipes(filtered);
      } finally {
        setIsLoading(false);
      }
    },
    [loadRecipes, recipes]
  );

  const addRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "createdAt" | "userId">) => {
      try {
        const newRecipe = await database.createRecipe(supabase, recipe);
        setRecipes((prev) => [newRecipe, ...prev]);
      } catch (err) {
        console.error("Error creating recipe:", err);
        throw new Error(ERROR_MESSAGES.CREATE_RECIPE);
      }
    },
    []
  );

  const updateRecipe = useCallback(
    async (
      id: string,
      recipe: Omit<Recipe, "id" | "createdAt" | "userId">
    ): Promise<Recipe> => {
      try {
        const updatedRecipe = await database.updateRecipe(supabase, id, recipe);
        setRecipes((prev) =>
          prev.map((r) => (r.id === id ? updatedRecipe : r))
        );
        return updatedRecipe;
      } catch (err) {
        console.error("Error updating recipe:", err);
        throw new Error(ERROR_MESSAGES.UPDATE_RECIPE);
      }
    },
    []
  );

  const deleteRecipe = useCallback(async (id: string) => {
    try {
      await database.deleteRecipe(supabase, id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting recipe:", err);
      throw new Error(ERROR_MESSAGES.DELETE_RECIPE);
    }
  }, []);

  const getRecipe = useCallback(async (id: string) => {
    try {
      return await database.getRecipe(supabase, id);
    } catch (err) {
      console.error("Error getting recipe:", err);
      throw new Error(ERROR_MESSAGES.FETCH_RECIPE);
    }
  }, []);

  const refreshRecipes = useCallback(() => loadRecipes(), [loadRecipes]);
  const refreshFeatured = useCallback(
    () => loadFeaturedRecipes(),
    [loadFeaturedRecipes]
  );

  // Load initial data
  useEffect(() => {
    loadRecipes();
    loadFeaturedRecipes();
  }, [loadRecipes, loadFeaturedRecipes]);

  return {
    recipes,
    featuredRecipes,
    isLoading,
    isFeaturedLoading,
    error,
    featuredError,
    searchRecipes,
    getRecipe,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refreshRecipes,
    refreshFeatured,
  };
}
