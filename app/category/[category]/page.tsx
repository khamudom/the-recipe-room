"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RecipeCard } from "@/components/recipe-card";
import { database } from "@/lib/database";
import type { Recipe } from "@/types/recipe";
import styles from "../../page.module.css";

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent(params.category as string);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
              <RecipeCard key={recipe.id} recipe={recipe} onClick={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
