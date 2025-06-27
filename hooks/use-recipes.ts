"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { database } from "@/lib/database";
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

  // Memoized recipe ref for search fallback
  const recipesRef = useMemo(() => recipes, [recipes]);

  const loadRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await database.getRecipes();
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
      const data = await database.getFeaturedRecipes();
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
        const results = await database.searchRecipes(query);
        setRecipes(results);
      } catch (err) {
        console.error("Error searching recipes:", err);
        // Fallback to client-side search
        const filtered = recipesRef.filter(
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
    [loadRecipes, recipesRef]
  );

  const addRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "createdAt" | "userId">) => {
      try {
        const newRecipe = await database.createRecipe(recipe);
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
        const updatedRecipe = await database.updateRecipe(id, recipe);
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
      await database.deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting recipe:", err);
      throw new Error(ERROR_MESSAGES.DELETE_RECIPE);
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
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refreshRecipes,
    refreshFeatured,
  };
}
