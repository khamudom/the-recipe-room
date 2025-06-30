"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { RecipeDetail } from "@/components/recipe-detail/recipe-detail";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import { LoadingAnimation } from "@/components/loading-animation/loading-animation";
import { useRecipes } from "@/hooks/use-recipes";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { Recipe } from "@/types/recipe";

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const recipeId = params.id as string;
  const from = searchParams.get("from");

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getRecipe, deleteRecipe } = useRecipes();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const fetchedRecipe = await getRecipe(recipeId);
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

  const handleEdit = useCallback(() => {
    if (recipe) {
      router.push(`/recipe/${recipe.id}/edit`);
    }
  }, [recipe, router]);

  const handleDelete = useCallback(async () => {
    if (recipe && confirm("Are you sure you want to delete this recipe?")) {
      try {
        await deleteRecipe(recipe.id);
        router.push("/");
      } catch (err) {
        console.error("Error deleting recipe:", err);
        setError(ERROR_MESSAGES.DELETE_RECIPE);
      }
    }
  }, [recipe, deleteRecipe, router]);

  const handleBack = useCallback(() => {
    if (from) {
      router.push(from);
    } else {
      router.push("/");
    }
  }, [router, from]);

  if (isLoading) {
    return <LoadingAnimation text="Loading recipe..." />;
  }

  if (error || !recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || "Recipe not found"}
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <RecipeDetail
        recipe={recipe}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </ErrorBoundary>
  );
}
