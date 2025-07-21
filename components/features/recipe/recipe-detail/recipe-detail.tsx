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

  // Helper function to render ingredients (grouped or flat)
  const renderIngredients = () => {
    if (recipe.ingredientGroups && recipe.ingredientGroups.length > 0) {
      return (
        <div className={styles.ingredientGroups}>
          {recipe.ingredientGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={styles.ingredientGroup}>
              <h4 className={styles.groupTitle}>{group.name}</h4>
              <ul className={styles.ingredientsList}>
                {group.ingredients.map((ingredient, index) => (
                  <li key={index} className={styles.ingredientItem}>
                    <div className={styles.ingredientBullet}></div>
                    <span className={styles.ingredientText}>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }

    // Fallback to old ingredients array
    return (
      <ul className={styles.ingredientsList}>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className={styles.ingredientItem}>
            <div className={styles.ingredientBullet}></div>
            <span className={styles.ingredientText}>{ingredient}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Helper function to render instructions (grouped or flat)
  const renderInstructions = () => {
    if (recipe.instructionGroups && recipe.instructionGroups.length > 0) {
      return (
        <div className={styles.instructionGroups}>
          {recipe.instructionGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={styles.instructionGroup}>
              <h4 className={styles.groupTitle}>{group.name}</h4>
              <ol className={styles.instructionsList}>
                {group.instructions.map((instruction, index) => (
                  <li key={index} className={styles.instructionItem}>
                    <div className={styles.stepNumber}>{index + 1}</div>
                    <span className={styles.instructionText}>
                      {instruction}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      );
    }

    // Fallback to old instructions array
    return (
      <ol className={styles.instructionsList}>
        {recipe.instructions.map((instruction, index) => (
          <li key={index} className={styles.instructionItem}>
            <div className={styles.stepNumber}>{index + 1}</div>
            <span className={styles.instructionText}>{instruction}</span>
          </li>
        ))}
      </ol>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Hero Section */}
        <div className={`${styles.headerControls} glass-morphism-bottom`}>
          <div className={styles.headerControlsContent}>
            <Button onClick={onBack} variant="ghost" iconOnly>
              <ArrowLeft className={styles.buttonIcon} />
            </Button>
            <h1 className={`${styles.recipeTitle} section-header`}>
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwner && (
          <div className={styles.actionButtons}>
            <Button onClick={onEdit} variant="outline" iconOnly>
              <Edit className={styles.buttonIcon} />
            </Button>
            <Button onClick={onDelete} variant="outline" iconOnly>
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
          <div className={styles.infoCard} style={{ padding: "1rem" }}>
            <p className={styles.recipeDescription}>{recipe.description}</p>
          </div>
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
            <div className={styles.cardContent}>{renderIngredients()}</div>
          </div>

          {/* Instructions */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.sectionTitle}>Instructions</h3>
              <div className={styles.sectionLine}></div>
            </div>
            <div className={styles.cardContent}>{renderInstructions()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
