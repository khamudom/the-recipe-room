"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { RecipeForm } from "@/components/features/recipe/recipe-form/recipe-form";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { ProtectedRoute } from "@/components/layout/protected-route/protected-route";
import { useCreateRecipe } from "@/hooks/use-recipes-query";
import type { Recipe } from "@/types/recipe";

export default function AddRecipePage() {
  const router = useRouter();

  const createRecipeMutation = useCreateRecipe({
    onSuccess: (newRecipe) => {
      router.replace(`/recipe/${newRecipe.slug}`);
    },
  });

  const handleAddRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "createdAt" | "userId" | "slug">) => {
      try {
        await createRecipeMutation.mutateAsync(recipe);
        // Navigation will be handled by the onSuccess callback
      } catch (error) {
        console.error("Error creating recipe:", error);
        // Error is handled by the mutation hook
      }
    },
    [createRecipeMutation]
  );

  const handleCancel = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <RecipeForm
          recipe={null}
          onSubmit={handleAddRecipe}
          onCancel={handleCancel}
          isSubmitting={createRecipeMutation.isPending}
        />
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
