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

  const renderRecipeCards = () => {
    return featuredRecipes.map((recipe) => (
      <RecipeCard
        key={recipe.id}
        recipe={recipe}
        onClick={() => onRecipeClick(recipe)}
      />
    ));
  };

  return (
    <section className={styles.featuredSection}>
      <h2 className={`${styles.sectionTitle} section-header`}>Featured</h2>
      <div className={styles.decorativeLine}></div>
      {isLoading ? (
        <LoadingSkeleton count={maxRecipes} type="recipe" />
      ) : featuredRecipes.length > 0 ? (
        <>
          {/* Desktop Grid Layout */}
          <div className={styles.recipeGrid}>{renderRecipeCards()}</div>

          {/* Mobile Carousel Layout */}
          <div className={styles.recipeCarousel}>
            {featuredRecipes.map((recipe) => (
              <div key={recipe.id} className={styles.recipeCarouselItem}>
                <RecipeCard
                  recipe={recipe}
                  onClick={() => onRecipeClick(recipe)}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ minHeight: "64px" }}></div>
      )}
    </section>
  );
}
