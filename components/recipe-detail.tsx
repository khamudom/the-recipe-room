"use client";

import { ArrowLeft, Clock, Users, Edit, Trash2, ChefHat } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import styles from "./recipe-detail.module.css";

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
  return (
    <div className={styles.container}>
      <div className={styles.textureOverlay}></div>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.headerControls}>
          <button onClick={onBack} className={styles.backButton}>
            <ArrowLeft className={styles.buttonIcon} />
            Back to Recipes
          </button>
          <div className={styles.actionButtons}>
            <button onClick={onEdit} className={styles.editButton}>
              <Edit className={styles.buttonIcon} />
              Edit
            </button>
            <button onClick={onDelete} className={styles.deleteButton}>
              <Trash2 className={styles.buttonIcon} />
              Delete
            </button>
          </div>
        </div>

        {/* Recipe Image */}
        {recipe.image && (
          <div className={styles.heroImageContainer}>
            <img
              src={recipe.image || "/placeholder.svg"}
              alt={recipe.title}
              className={styles.heroImage}
            />
          </div>
        )}

        {/* Recipe Header */}
        <div className={styles.recipeHeader}>
          <h1 className={styles.recipeTitle}>{recipe.title}</h1>
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

        {/* Decorative footer */}
        <div className={styles.footer}>
          <div className={styles.footerLine}></div>
          <p className={styles.footerText}>"Made with love in our kitchen"</p>
        </div>
      </div>
    </div>
  );
}
