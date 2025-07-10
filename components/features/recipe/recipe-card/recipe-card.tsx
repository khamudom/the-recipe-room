"use client";

import React from "react";
import { Clock, Users, Tag, Star, User, ChefHat } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import { useAuth } from "@/lib/auth-context";
import styles from "./recipe-card.module.css";
import Image from "next/image";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export const RecipeCard = React.memo(function RecipeCard({
  recipe,
  onClick,
}: RecipeCardProps) {
  const { user } = useAuth();
  const isMyRecipe = user && recipe.userId === user.id;

  return (
    <button
      className={styles.card}
      onClick={onClick}
      aria-label={`View recipe: ${recipe.title}`}
      type="button"
    >
      <div>
        {/* Recipe Image */}
        <div className={styles.imageContainer}>
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className={styles.recipeImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className={styles.placeholderImage}>
              <Image
                src="/placeholder.svg"
                alt="Recipe placeholder"
                width={48}
                height={48}
                className={styles.placeholderIcon}
              />
              <p className={styles.placeholderText}>No image</p>
            </div>
          )}
          <div className={styles.categoryTag}>
            <Tag className={styles.tagIcon} />
            <span className={styles.categoryText}>{recipe.category}</span>
          </div>
          {recipe.featured && (
            <div className={styles.featuredBadge}>
              <Star className={styles.featuredIcon} />
              <span className={styles.featuredText}>Featured</span>
            </div>
          )}
          {isMyRecipe && !recipe.featured && (
            <div className={styles.myRecipeBadge}>
              <User className={styles.myRecipeIcon} />
              <span className={styles.myRecipeText}>My Recipe</span>
            </div>
          )}
        </div>

        <div className={styles.header}>
          <h3 className={`${styles.title} card-title`}>{recipe.title}</h3>
          <p className={styles.description}>{recipe.description}</p>
        </div>
      </div>

      <div className={`${styles.metaInfo} card-meta`}>
        <div className={styles.metaItem}>
          <Clock className={styles.metaIcon} />
          <span>{recipe.prepTime}</span>
        </div>
        <div className={styles.metaItem}>
          <ChefHat className={styles.metaIcon} />
          <span>{recipe.cookTime}</span>
        </div>
        <div className={styles.metaItem}>
          <Users className={styles.metaIcon} />
          <span>{recipe.servings} servings</span>
        </div>
      </div>
    </button>
  );
});
