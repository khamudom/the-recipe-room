"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RecipeForm } from "@/components/recipe-form/recipe-form";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import ProtectedRoute from "@/components/protected-route/protected-route";
import { useRecipes } from "@/hooks/use-recipes";
import type { Recipe } from "@/types/recipe";

export default function AddRecipePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addRecipe } = useRecipes();

  const handleAddRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "createdAt" | "userId">) => {
      try {
        setIsSubmitting(true);
        await addRecipe(recipe);
        router.push("/");
      } catch (error) {
        console.error("Error creating recipe:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [addRecipe, router]
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
          isSubmitting={isSubmitting}
        />
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
