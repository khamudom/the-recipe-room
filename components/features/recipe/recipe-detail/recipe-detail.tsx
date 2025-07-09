"use client";

import React from "react";
import { ArrowLeft, Clock, Users, Edit, Trash2, ChefHat } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { Recipe } from "@/types/recipe";
import styles from "./recipe-detail.module.css";
import Image from "next/image";
import { Button } from "@/components/ui/button/button";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecipeDetail({
  recipe,
  onBack,
  onEdit,
  onDelete,
}: RecipeDetailProps) {
  const { user } = useAuth();
  const isOwner = user && recipe.userId === user.id;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Hero Section */}
        <div className={styles.headerControls}>
          <Button
            onClick={onBack}
            variant="outline"
            iconOnly
            className={styles.backButton}
          >
            <ArrowLeft className={styles.buttonIcon} />
          </Button>
          <h1 className={`${styles.recipeTitle} section-header`}>
            {recipe.title}
          </h1>
        </div>

        {/* Action Buttons */}
        {isOwner && (
          <div className={styles.actionButtons}>
            <Button
              onClick={onEdit}
              variant="outline"
              iconOnly
              className={styles.editButton}
            >
              <Edit className={styles.buttonIcon} />
            </Button>
            <Button
              onClick={onDelete}
              variant="outline"
              iconOnly
              className={styles.deleteButton}
            >
              <Trash2 className={styles.buttonIcon} />
            </Button>
          </div>
        )}

        {/* Recipe Image */}
        {recipe.image && (
          <div className={styles.heroImageContainer}>
            <Image
              src={recipe.image}
              alt={recipe.title}
              width={400}
              height={300}
              className={styles.heroImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              quality={85}
              loading="lazy"
            />
          </div>
        )}

        {/* Recipe Description */}
        <div className={styles.recipeHeader}>
          <div className={styles.titleLine}></div>
          <p className={styles.recipeDescription}>{recipe.description}</p>
        </div>

        {/* Recipe Info */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardContent}>
              <Clock className={styles.infoIcon} />
              <div className={styles.infoLabel}>Prep Time</div>
              <div className={styles.infoValue}>{recipe.prepTime}</div>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardContent}>
              <ChefHat className={styles.infoIcon} />
              <div className={styles.infoLabel}>Cook Time</div>
              <div className={styles.infoValue}>{recipe.cookTime}</div>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardContent}>
              <Users className={styles.infoIcon} />
              <div className={styles.infoLabel}>Servings</div>
              <div className={styles.infoValue}>{recipe.servings}</div>
            </div>
          </div>
        </div>

        {/* Ingredients and Instructions */}
        <div className={styles.mainContent}>
          {/* Ingredients */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.sectionTitle}>Ingredients</h3>
              <div className={styles.sectionLine}></div>
            </div>
            <div className={styles.cardContent}>
              <ul className={styles.ingredientsList}>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className={styles.ingredientItem}>
                    <div className={styles.ingredientBullet}></div>
                    <span className={styles.ingredientText}>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.sectionTitle}>Instructions</h3>
              <div className={styles.sectionLine}></div>
            </div>
            <div className={styles.cardContent}>
              <ol className={styles.instructionsList}>
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className={styles.instructionItem}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <span className={styles.instructionText}>
                      {instruction}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
