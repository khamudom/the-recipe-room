"use client";

import type React from "react";
import { useState, useRef } from "react";
import { ArrowLeft, Plus, X, Upload, ImageIcon, Loader2 } from "lucide-react";
import type { Recipe } from "@/types/recipe";
import styles from "./recipe-form.module.css";

interface RecipeFormProps {
  recipe?: Recipe | null;
  onSubmit: (recipe: Omit<Recipe, "id" | "createdAt">) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function RecipeForm({
  recipe,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RecipeFormProps) {
  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    description: recipe?.description || "",
    ingredients: recipe?.ingredients || [""],
    instructions: recipe?.instructions || [""],
    prepTime: recipe?.prepTime || "",
    cookTime: recipe?.cookTime || "",
    servings: recipe?.servings || 1,
    category: recipe?.category || "",
    image: recipe?.image || "",
  });

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

  return (
    <div className={styles.container}>
      <div className={styles.textureOverlay}></div>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={onCancel} className={styles.cancelButton}>
            <ArrowLeft className={styles.buttonIcon} />
            Cancel
          </button>
          <h1 className={styles.title}>
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
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Recipe preview"
                      className={styles.imagePreview}
                    />
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
                    <option value="Main Course">Main Course</option>
                    <option value="Side Dish">Side Dish</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Snack">Snack</option>
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
                    type="number"
                    min="1"
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        servings: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
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

          {/* Instructions */}
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
                <>
                  <Loader2
                    className={`${styles.buttonIcon} ${styles.spinning}`}
                  />
                  {recipe ? "Updating..." : "Saving..."}
                </>
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
