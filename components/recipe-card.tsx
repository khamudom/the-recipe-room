"use client";

import { Clock, Users, Tag, Star } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import styles from "./recipe-card.module.css";
import Image from "next/image";

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
