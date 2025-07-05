"use client";

import { useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { RecipeDetail } from "@/components/features/recipe/recipe-detail/recipe-detail";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { useRecipe, useDeleteRecipe } from "@/hooks/use-recipes-query";

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const recipeId = params.id as string;
  const from = searchParams.get("from");

  const { data: recipe, isLoading, error } = useRecipe(recipeId);

  const deleteRecipeMutation = useDeleteRecipe();

  const handleEdit = useCallback(() => {
    if (recipe) {
      router.push(`/recipe/${recipe.id}/edit`);
    }
  }, [recipe, router]);

  const handleDelete = useCallback(async () => {
    if (recipe && confirm("Are you sure you want to delete this recipe?")) {
      try {
        await deleteRecipeMutation.mutateAsync(recipe.id);
        router.push("/");
      } catch (err) {
        console.error("Error deleting recipe:", err);
        // Error is handled by the mutation hook
      }
    }
  }, [recipe, deleteRecipeMutation, router]);

  const handleBack = useCallback(() => {
    if (from) {
      router.push(from);
    } else {
      router.push("/");
    }
  }, [router, from]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          width: "100%",
        }}
      >
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div>
        <div>
          <p>{error?.message || "Recipe not found"}</p>
          <button onClick={handleBack}>Back to Recipes</button>
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
