/**
 * Category Page Component
 *
 * This page displays all recipes belonging to a specific category.
 * It's a dynamic route that accepts a category parameter from the URL.
 *
 * Usage:
 * - Accessed via: /category/[category-name]
 * - Examples: /category/breakfast, /category/dinner, /category/dessert
 *
 * Features:
 * - Fetches recipes filtered by the specified category from the database
 * - Displays recipes in a grid layout using RecipeCard components
 * - Shows loading state while fetching data
 * - Handles empty states when no recipes are found in the category
 * - Uses the same styling as the main page for consistency
 *
 * This page is part of the recipe browsing experience, allowing users
 * to explore recipes by category after selecting a category from the
 * categories section on the main page.
 */

"use client";

import { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { RecipeCard } from "@/components/features/recipe/recipe-card/recipe-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { ArrowLeft } from "lucide-react";
import { useRecipesByCategoryWithUser } from "@/hooks/use-recipes-query";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = decodeURIComponent(params.category as string);

  const {
    data: recipes = [],
    isLoading,
    error,
  } = useRecipesByCategoryWithUser(category);

  const handleRecipeClick = useCallback(
    (recipe: Recipe) => {
      const currentPath = `/category/${encodeURIComponent(category)}`;
      router.push(
        `/recipe/${recipe.id}?from=${encodeURIComponent(currentPath)}`
      );
    },
    [router, category]
  );

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <button onClick={handleBack} className={styles.backButton}>
              <ArrowLeft className={styles.buttonIcon} />
            </button>
            <h1 className={`${styles.mainTitle} section-header`}>
              {category} Recipes
            </h1>
          </div>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>Error Loading Recipes</h3>
              <p className={styles.emptyText}>{error.message}</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>No recipes found</h3>
              <p>There are no recipes in this category yet.</p>
            </div>
          ) : (
            <div className={styles.recipeGrid}>
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
