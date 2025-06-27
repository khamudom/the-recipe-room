"use client";

import { RecipeCard } from "../recipe-card/recipe-card";
import { LoadingSkeleton } from "../loading-skeleton/loading-skeleton";
import type { Recipe } from "@/types/recipe";
import styles from "./featured-recipes.module.css";

interface FeaturedRecipesProps {
  recipes: Recipe[];
  isLoading: boolean;
  onRecipeClick: (recipe: Recipe) => void;
}

export function FeaturedRecipes({
  recipes,
  isLoading,
  onRecipeClick,
}: FeaturedRecipesProps) {
  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.sectionTitle}>Featured Recipes</h2>
      {isLoading ? (
        <LoadingSkeleton count={3} type="recipe" />
      ) : recipes.length > 0 ? (
        <div className={styles.recipeGrid}>
          {recipes.map((recipe) => (
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
