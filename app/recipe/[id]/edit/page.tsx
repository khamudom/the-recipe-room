"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form/recipe-form";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import { ProtectedRoute } from "@/components/protected-route/protected-route";
import { useRecipes } from "@/hooks/use-recipes";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { Recipe } from "@/types/recipe";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRecipe, updateRecipe } = useRecipes();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const fetchedRecipe = await getRecipe(recipeId);
        if (!fetchedRecipe) {
          setError("Recipe not found");
          return;
        }
        setRecipe(fetchedRecipe);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError(ERROR_MESSAGES.FETCH_RECIPE);
      } finally {
        setIsLoading(false);
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId, getRecipe]);

  const handleUpdateRecipe = useCallback(
    async (updatedRecipe: Omit<Recipe, "id" | "createdAt" | "userId">) => {
      try {
        setIsSubmitting(true);
        await updateRecipe(recipeId, updatedRecipe);
        router.push(`/recipe/${recipeId}`);
      } catch (error) {
        console.error("Error updating recipe:", error);
        setError(ERROR_MESSAGES.UPDATE_RECIPE);
      } finally {
        setIsSubmitting(false);
      }
    },
    [recipeId, updateRecipe, router]
  );

  const handleCancel = useCallback(() => {
    router.push(`/recipe/${recipeId}`);
  }, [recipeId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading recipe...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || "Recipe not found"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <RecipeForm
          recipe={recipe}
          onSubmit={handleUpdateRecipe}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
