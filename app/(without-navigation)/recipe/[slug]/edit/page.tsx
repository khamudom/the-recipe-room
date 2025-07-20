"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { RecipeForm } from "@/components/features/recipe/recipe-form/recipe-form";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { ProtectedRoute } from "@/components/layout/protected-route/protected-route";
import { useRecipeBySlug, useUpdateRecipe } from "@/hooks/use-recipes-query";
import type { Recipe } from "@/types/recipe";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const recipeSlug = params.slug as string;

  const { data: recipe, isLoading, error } = useRecipeBySlug(recipeSlug);

  const updateRecipeMutation = useUpdateRecipe();

  const handleUpdateRecipe = useCallback(
    async (
      updatedRecipe: Omit<Recipe, "id" | "createdAt" | "userId" | "slug">
    ) => {
      try {
        if (!recipe) return;
        await updateRecipeMutation.mutateAsync({
          id: recipe.id,
          recipe: updatedRecipe,
        });
        router.push(`/recipe/${recipe.slug}`);
      } catch (error) {
        console.error("Error updating recipe:", error);
        // Error is handled by the mutation hook
      }
    },
    [recipe, updateRecipeMutation, router]
  );

  const handleCancel = useCallback(() => {
    if (recipe) {
      router.push(`/recipe/${recipe.slug}`);
    } else {
      router.push("/");
    }
  }, [recipe, router]);

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
            {error?.message || "Recipe not found"}
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
          isSubmitting={updateRecipeMutation.isPending}
        />
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
