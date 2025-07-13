"use client";

import { RecipeCard } from "../recipe/recipe-card/recipe-card";
import { LoadingSkeleton } from "../../ui/loading-skeleton/loading-skeleton";
import type { Recipe } from "@/types/recipe";
import styles from "./featured-recipes.module.css";

interface FeaturedRecipesProps {
  recipes: Recipe[];
  isLoading: boolean;
  onRecipeClick: (recipe: Recipe) => void;
  /**
   * Option to set maximum number of featured recipes to display.
   * Defaults to 3 if not provided.
   */
  maxRecipes?: number;
}

export function FeaturedRecipes({
  recipes,
  isLoading,
  onRecipeClick,
  maxRecipes = 3,
}: FeaturedRecipesProps) {
  // Filter recipes that have featured=true and limit by maxRecipes
  const featuredRecipes = recipes
    .filter((recipe) => recipe.featured)
    .slice(0, maxRecipes);

  return (
    <section className={styles.featuredSection}>
      <h2 className={`${styles.sectionTitle} section-header`}>Featured</h2>
      <div className={styles.decorativeLine}></div>
      {isLoading ? (
        <LoadingSkeleton count={maxRecipes} type="recipe" />
      ) : featuredRecipes.length > 0 ? (
        <div className={styles.recipeGrid}>
          {featuredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => onRecipeClick(recipe)}
            />
          ))}
        </div>
      ) : (
        <div style={{ minHeight: "64px" }}></div>
      )}
    </section>
  );
}
