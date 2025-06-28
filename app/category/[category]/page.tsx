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
import { RecipeCard } from "@/components/recipe-card/recipe-card";
import { database } from "@/lib/database";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = decodeURIComponent(params.category as string);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const data = await database.getRecipesByCategory(category);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes by category:", error);
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, [category]);

  return (
    <div className={styles.container}>
      <div className={styles.textureOverlay}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.mainTitle}>{category} Recipes</h1>
        </div>
        {isLoading ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>Loading recipes...</h3>
            <p className={styles.emptyText}>
              Please wait while we fetch recipes for this category.
            </p>
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
  );
}
