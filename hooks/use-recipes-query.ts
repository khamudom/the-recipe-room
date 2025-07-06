"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { database } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";

// Query keys for React Query
export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (filters: string) => [...recipeKeys.lists(), { filters }] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  featured: () => [...recipeKeys.all, "featured"] as const,
  search: (query: string) => [...recipeKeys.all, "search", query] as const,
  category: (category: string) =>
    [...recipeKeys.all, "category", category] as const,
};

// Hook to get all recipes
export function useRecipes() {
  return useQuery({
    queryKey: recipeKeys.lists(),
    queryFn: () => database.getRecipes(supabase),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to get featured recipes
export function useFeaturedRecipes() {
  return useQuery({
    queryKey: recipeKeys.featured(),
    queryFn: () => database.getFeaturedRecipes(supabase),
    staleTime: 10 * 60 * 1000, // 10 minutes - featured recipes don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
  });
}

// Hook to get a single recipe
export function useRecipe(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => database.getRecipe(supabase, id),
    enabled: !!id, // Only run if id exists
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to search recipes
export function useSearchRecipes(query: string) {
  return useQuery({
    queryKey: recipeKeys.search(query),
    queryFn: () => database.searchRecipes(supabase, query),
    enabled: !!query.trim(), // Only run if query exists and is not empty
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000,
  });
}

// Hook to get recipes by category
export function useRecipesByCategory(category: string) {
  return useQuery({
    queryKey: recipeKeys.category(category),
    queryFn: () => database.getRecipesByCategory(supabase, category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// User-aware recipes by category hook for correct cache per user
export function useRecipesByCategoryWithUser(category: string) {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) setUserId(user?.id ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) setUserId(session?.user?.id ?? null);
      }
    );
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return useQuery({
    queryKey: ["recipes", "category", category, userId],
    queryFn: () => database.getRecipesByCategory(supabase, category),
    enabled: !!category && userId !== undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to create a recipe
export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: Omit<Recipe, "id" | "createdAt" | "userId">) =>
      database.createRecipe(supabase, recipe),
    onSuccess: (newRecipe) => {
      // Invalidate and refetch recipes lists
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.featured() });

      // Add the new recipe to the cache
      queryClient.setQueryData(recipeKeys.detail(newRecipe.id), newRecipe);
    },
    onError: (error) => {
      console.error("Error creating recipe:", error);
      throw new Error(ERROR_MESSAGES.CREATE_RECIPE);
    },
  });
}

// Hook to update a recipe
export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      recipe,
    }: {
      id: string;
      recipe: Partial<Omit<Recipe, "id" | "createdAt" | "userId">>;
    }) => database.updateRecipe(supabase, id, recipe),
    onSuccess: (updatedRecipe) => {
      // Invalidate and refetch recipes lists
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.featured() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.details() });
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
      // Update the recipe in cache
      queryClient.setQueryData(
        recipeKeys.detail(updatedRecipe.id),
        updatedRecipe
      );
    },
    onError: (error) => {
      console.error("Error updating recipe:", error);
      throw new Error(ERROR_MESSAGES.UPDATE_RECIPE);
    },
  });
}

// Hook to delete a recipe
export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => database.deleteRecipe(supabase, id),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch recipes lists
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.featured() });
      // Invalidate all user-aware queries
      queryClient.invalidateQueries({ queryKey: ["recipes"] });

      // Remove the recipe from cache
      queryClient.removeQueries({ queryKey: recipeKeys.detail(deletedId) });
    },
    onError: (error) => {
      console.error("Error deleting recipe:", error);
      throw new Error(ERROR_MESSAGES.DELETE_RECIPE);
    },
  });
}

// User-aware recipes hook for correct cache per user
export function useRecipesWithUser() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) setUserId(user?.id ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) setUserId(session?.user?.id ?? null);
      }
    );
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return useQuery({
    queryKey: ["recipes", userId],
    queryFn: () => database.getRecipes(supabase),
    enabled: userId !== undefined, // Only run when userId is known
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
