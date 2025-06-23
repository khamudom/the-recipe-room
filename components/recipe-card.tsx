"use client";

import { Clock, Users, Tag, ImageIcon, Star } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import styles from "./recipe-card.module.css";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      {/* Recipe Image */}
      <div className={styles.imageContainer}>
        {recipe.image ? (
          <img
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.title}
            className={styles.recipeImage}
          />
        ) : (
          <div className={styles.placeholderImage}>
            <ImageIcon className={styles.placeholderIcon} />
            <span className={styles.placeholderText}>No Image</span>
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
      </div>

      <div className={styles.header}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <p className={styles.description}>{recipe.description}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            <Clock className={styles.metaIcon} />
            <span>{recipe.prepTime}</span>
          </div>
          <div className={styles.metaItem}>
            <Users className={styles.metaIcon} />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className={styles.decorativeBorder}>
          <div className={styles.decorativeLine}></div>
        </div>
      </div>
    </div>
  );
}
