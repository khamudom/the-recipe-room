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

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import { RecipeCard } from "@/components/recipe-card/recipe-card";
import { LoadingSpinner } from "@/components/loading-spinner/loading-spinner";
import { ArrowLeft } from "lucide-react";
import { database } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = decodeURIComponent(params.category as string);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRecipeClick = useCallback(
    (recipe: Recipe) => {
      const currentPath = `/category/${encodeURIComponent(category)}`;
      router.push(
        `/recipe/${recipe.id}?from=${encodeURIComponent(currentPath)}`
      );
    },
    [router, category]
  );

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await database.getRecipesByCategory(supabase, category);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes by category:", error);
        setError(ERROR_MESSAGES.LOAD_RECIPES);
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [category]);

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <ErrorBoundary>
      
      <div className={styles.container}>
        <div className={styles.textureOverlay}></div>
        <div className={styles.content}>
          <div className={styles.header}>
            <button onClick={handleBack} className={styles.backButton}>
              <ArrowLeft className={styles.buttonIcon} />
            </button>
            <h1 className={styles.mainTitle}>{category} Recipes</h1>
          </div>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>Error Loading Recipes</h3>
              <p className={styles.emptyText}>{error}</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className={styles.emptyState}>
              <h3 className={styles.emptyTitle}>No recipes found</h3>
              <p className={styles.emptyText}>
                There are no recipes in this category yet.
              </p>
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
