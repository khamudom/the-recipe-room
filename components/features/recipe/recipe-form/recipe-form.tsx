/**
 * RecipeForm Component
 *
 * A comprehensive form component for creating and editing recipes. Features include:
 * - Manual recipe entry with all standard fields (title, ingredients, instructions, etc.)
 * - AI-powered recipe extraction from images
 * - Image upload and preview functionality
 * - Dynamic ingredient and instruction management (add/remove fields)
 * - Admin-only featured recipe toggle
 * - Form validation and submission handling
 */

"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  Plus,
  X,
  Upload,
  ImageIcon,
  Loader2,
  Sparkles,
  //Globe,
} from "lucide-react";
// TODO: Import MultiImageAnalysisResponse when we add URL extraction
import type { Recipe, AIRecipeAnalysisResult } from "@/types/recipe";
import { AIRecipeAnalyzer } from "@/components/features/ai-recipe-analyzer/ai-recipe-analyzer";
// import { URLRecipeExtractor } from "@/components/url-recipe-extractor/url-recipe-extractor";
import { useAuth } from "@/lib/auth-context";
import styles from "./recipe-form.module.css";
import Image from "next/image";

interface RecipeFormProps {
  recipe?: Recipe | null;
  onSubmit: (recipe: Omit<Recipe, "id" | "createdAt" | "userId">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function RecipeForm({
  recipe,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RecipeFormProps) {
  const { user } = useAuth();
  const isAdmin = user?.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID;

  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    description: recipe?.description || "",
    ingredients: recipe?.ingredients || [""],
    instructions: recipe?.instructions || [""],
    prepTime: recipe?.prepTime || "",
    cookTime: recipe?.cookTime || "",
    servings: recipe?.servings || "",
    category: recipe?.category || "",
    image: recipe?.image || "",
    featured: recipe?.featured || false,
  });

  const [showAIAnalyzer, setShowAIAnalyzer] = useState(false);
  // const [showURLExtractor, setShowURLExtractor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category) return;

    const filteredIngredients = formData.ingredients.filter((ing) =>
      ing.trim()
    );
    const filteredInstructions = formData.instructions.filter((inst) =>
      inst.trim()
    );

    onSubmit({
      ...formData,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? value : ing
      ),
    }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) =>
        i === index ? value : inst
      ),
    }));
  };

  const handleAIAnalysisComplete = (recipeData: AIRecipeAnalysisResult) => {
    // Deduplicate ingredients (case-insensitive, preserves first occurrence's original casing)
    const seen = new Map<string, string>();
    (recipeData.ingredients || [""]).forEach((ing) => {
      const key = ing.trim().toLowerCase();
      if (key && !seen.has(key)) {
        seen.set(key, ing.trim());
      }
    });
    let dedupedIngredients = Array.from(seen.values());

    // Remove ingredients that are substrings of other ingredients (case-insensitive, with a small length buffer)
    dedupedIngredients = dedupedIngredients.filter((ing, idx, arr) => {
      const ingLower = ing.toLowerCase();
      return !arr.some(
        (other, otherIdx) =>
          otherIdx !== idx &&
          other.toLowerCase().includes(ingLower) &&
          other.length > ing.length + 3 // allow for "olive oil" vs "4 tablespoons olive oil"
      );
    });

    setFormData({
      title: recipeData.title || "",
      description: recipeData.description || "",
      ingredients: dedupedIngredients.length > 0 ? dedupedIngredients : [""],
      instructions: recipeData.instructions || [""],
      prepTime: recipeData.prepTime || "",
      cookTime: recipeData.cookTime || "",
      servings: recipeData.servings || "",
      category: recipeData.category || "",
      image: recipeData.image || formData.image,
      featured: formData.featured, // Preserve the featured setting
    });
    setShowAIAnalyzer(false);
  };

  const handleAIAnalyzerCancel = () => {
    setShowAIAnalyzer(false);
  };

  // const handleURLExtractionComplete = (recipeData: AIRecipeAnalysisResult) => {
  //   setFormData({
  //     title: recipeData.title || "",
  //     description: recipeData.description || "",
  //     ingredients: recipeData.ingredients || [""],
  //     instructions: recipeData.instructions || [""],
  //     prepTime: recipeData.prepTime || "",
  //     cookTime: recipeData.cookTime || "",
  //     servings: recipeData.servings || "",
  //     category: recipeData.category || "",
  //     image: recipeData.image || formData.image,
  //     featured: formData.featured, // Preserve the featured setting
  //   });
  //   setShowURLExtractor(false);
  // };

  // const handleURLExtractorCancel = () => {
  //   setShowURLExtractor(false);
  // };

  // Show AI analyzer if enabled
  if (showAIAnalyzer) {
    return (
      <AIRecipeAnalyzer
        onAnalysisComplete={handleAIAnalysisComplete}
        onCancel={handleAIAnalyzerCancel}
      />
    );
  }

  // Show URL extractor if enabled
  // if (showURLExtractor) {
  //   return (
  //     <URLRecipeExtractor
  //       onExtractionComplete={handleURLExtractionComplete}
  //       onCancel={handleURLExtractorCancel}
  //     />
  //   );
  // }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Hero Section */}
        <div className={styles.header}>
          <button onClick={onCancel} className={styles.cancelSubmitButton}>
            Cancel
          </button>
          <h1 className={`${styles.title} section-header`}>
            {recipe ? "Edit Recipe" : "Add New Recipe"}
          </h1>
          <div className={styles.spacer}></div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Recipe Image */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recipe Photo</h3>
              <div className={styles.cardLine}></div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.imageUploadSection}>
                {formData.image ? (
                  <div className={styles.imagePreviewContainer}>
                    <div className={styles.imagePreviewWrapper}>
                      <Image
                        src={formData.image || "/placeholder.svg"}
                        alt="Recipe preview"
                        fill
                        className={styles.imagePreview}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className={styles.removeImageButton}
                    >
                      <X className={styles.buttonIcon} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <ImageIcon className={styles.uploadIcon} />
                    <p className={styles.uploadText}>No image selected</p>
                  </div>
                )}
                <div className={styles.uploadControls}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={styles.hiddenInput}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={styles.uploadButton}
                  >
                    <Upload className={styles.buttonIcon} />
                    {formData.image ? "Change Image" : "Upload Image"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Option - Only show for new recipes */}
          {!recipe && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>AI Recipe Analysis</h3>
                <div className={styles.cardLine}></div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.aiSection}>
                  <div className={styles.aiDescription}>
                    <Sparkles className={styles.aiIcon} />
                    <div>
                      <h4>Extract Recipe from Image</h4>
                      <p>
                        Upload a photo of a recipe and our AI will automatically
                        extract all the details for you.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAIAnalyzer(true)}
                    className={styles.aiButton}
                  >
                    <Sparkles className={styles.buttonIcon} />
                    Analyze Recipe Image
                  </button>
                </div>

                {/* <div className={styles.aiDivider}></div>
                
                <div className={styles.aiSection}>
                  <div className={styles.aiDescription}>
                    <Globe className={styles.aiIcon} />
                    <div>
                      <h4>Extract Recipe from URL</h4>
                      <p>
                        Enter a recipe webpage URL and our AI will automatically
                        extract all the details for you.
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={true}
                    type="button"
                    onClick={() => setShowURLExtractor(true)}
                    className={styles.aiButton}
                  >
                    <Globe className={styles.buttonIcon} />
                    Extract from URL
                  </button>
                </div> */}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recipe Details</h3>
              <div className={styles.cardLine}></div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="title" className={styles.label}>
                    Recipe Title *
                  </label>
                  <input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter recipe title..."
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="category" className={styles.label}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className={styles.select}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Appetizer">Appetizer</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Side Dish">Side Dish</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Snack">Snack</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="description" className={styles.label}>
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your recipe..."
                  className={styles.textarea}
                />
              </div>

              {/* Admin-only featured recipe toggle */}
              {isAdmin && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Featured</label>
                  <div className={styles.toggleContainer}>
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className={styles.toggleInput}
                    />
                    <label htmlFor="featured" className={styles.toggleLabel}>
                      <span className={styles.toggleText}>
                        {formData.featured ? "⭐ Featured" : "Mark as featured"}
                      </span>
                      <span className={styles.toggleDescription}>
                        Featured recipes appear on the homepage
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <div className={styles.metaGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="prepTime" className={styles.label}>
                    Prep Time
                  </label>
                  <input
                    id="prepTime"
                    value={formData.prepTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        prepTime: e.target.value,
                      }))
                    }
                    placeholder="e.g., 30 minutes"
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="cookTime" className={styles.label}>
                    Cook Time
                  </label>
                  <input
                    id="cookTime"
                    value={formData.cookTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cookTime: e.target.value,
                      }))
                    }
                    placeholder="e.g., 45 minutes"
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="servings" className={styles.label}>
                    Servings
                  </label>
                  <input
                    id="servings"
                    type="text"
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        servings: e.target.value,
                      }))
                    }
                    placeholder="e.g., 4-6 people"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients - Dynamic list with add/remove functionality */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Ingredients</h3>
              <div className={styles.cardLine}></div>
            </div>
            <div className={styles.cardContent}>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className={styles.listItem}>
                  <input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}...`}
                    className={styles.input}
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className={styles.removeButton}
                    >
                      <X className={styles.buttonIcon} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className={styles.addButton}
              >
                <Plus className={styles.buttonIcon} />
                Add Ingredient
              </button>
            </div>
          </div>

          {/* Instructions - Dynamic list with step numbers and add/remove functionality */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Instructions</h3>
              <div className={styles.cardLine}></div>
            </div>
            <div className={styles.cardContent}>
              {formData.instructions.map((instruction, index) => (
                <div key={index} className={styles.listItem}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Step ${index + 1}...`}
                    className={styles.textarea}
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className={styles.removeButton}
                    >
                      <X className={styles.buttonIcon} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addInstruction}
                className={styles.addButton}
              >
                <Plus className={styles.buttonIcon} />
                Add Step
              </button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className={styles.submitButtons}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelSubmitButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className={styles.loadingTextContainer}>
                  <Loader2
                    className={`${styles.buttonIcon} ${styles.spinning}`}
                  />
                  {recipe ? "Updating..." : "Saving..."}
                </div>
              ) : recipe ? (
                "Update Recipe"
              ) : (
                "Save Recipe"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
