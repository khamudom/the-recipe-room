/**
 * RecipeForm Component
 *
 * A comprehensive form component for creating and editing recipes. Features include:
 * - Manual recipe entry with all standard fields (title, ingredients, instructions, etc.)
 * - AI-powered recipe extraction from images
 * - Image upload and preview functionality
 * - Dynamic ingredient and instruction management (add/remove fields)
 * - Ingredient grouping functionality
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
  ArrowLeft,
  FolderPlus,
  //Globe,
} from "lucide-react";
// TODO: Import MultiImageAnalysisResponse when we add URL extraction
import type {
  Recipe,
  AIRecipeAnalysisResult,
  IngredientGroup,
  InstructionGroup,
} from "@/types/recipe";
import { AIRecipeAnalyzer } from "@/components/features/ai-recipe-analyzer/ai-recipe-analyzer";
// import { URLRecipeExtractor } from "@/components/url-recipe-extractor/url-recipe-extractor";
import { useAuth } from "@/lib/auth-context";
import styles from "./recipe-form.module.css";
import Image from "next/image";
import { Button } from "@/components/ui/button/button";
import {
  uploadImageToSupabase,
  deleteImageFromSupabase,
  isBase64Image,
} from "@/lib/image-upload";

interface RecipeFormProps {
  recipe?: Recipe | null;
  onSubmit: (
    recipe: Omit<Recipe, "id" | "createdAt" | "userId" | "slug">
  ) => void;
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

  // Initialize ingredient groups from existing recipe or create default structure
  const initializeIngredientGroups = (): IngredientGroup[] => {
    if (recipe?.ingredientGroups && recipe.ingredientGroups.length > 0) {
      return recipe.ingredientGroups;
    }

    // If recipe has old ingredients array, convert to a default group
    if (recipe?.ingredients && recipe.ingredients.length > 0) {
      return [
        {
          name: "Ingredients",
          ingredients: recipe.ingredients.filter((ing) => ing.trim()),
          sortOrder: 0,
        },
      ];
    }

    // Default empty group
    return [
      {
        name: "Ingredients",
        ingredients: [""],
        sortOrder: 0,
      },
    ];
  };

  // Initialize instruction groups from existing recipe or create default structure
  const initializeInstructionGroups = (): InstructionGroup[] => {
    if (recipe?.instructionGroups && recipe.instructionGroups.length > 0) {
      return recipe.instructionGroups;
    }

    // If recipe has old instructions array, convert to a default group
    if (recipe?.instructions && recipe.instructions.length > 0) {
      return [
        {
          name: "Instructions",
          instructions: recipe.instructions.filter((inst) => inst.trim()),
          sortOrder: 0,
        },
      ];
    }

    // Default empty group
    return [
      {
        name: "Instructions",
        instructions: [""],
        sortOrder: 0,
      },
    ];
  };

  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    description: recipe?.description || "",
    ingredients: recipe?.ingredients || [""], // Keep for backward compatibility
    ingredientGroups: initializeIngredientGroups(),
    instructions: recipe?.instructions || [""], // Keep for backward compatibility
    instructionGroups: initializeInstructionGroups(),
    prepTime: recipe?.prepTime || "",
    cookTime: recipe?.cookTime || "",
    servings: recipe?.servings || "",
    category: recipe?.category || "",
    image: recipe?.image || "",
    imagePath: recipe?.imagePath || "",
    featured: recipe?.featured || false,
    featuredOrder: recipe?.featuredOrder || undefined,
  });

  const [showAIAnalyzer, setShowAIAnalyzer] = useState(false);
  // const [showURLExtractor, setShowURLExtractor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category) return;

    // Filter out empty ingredients from all groups
    const filteredGroups = formData.ingredientGroups
      .map((group) => ({
        ...group,
        ingredients: group.ingredients.filter((ing) => ing.trim()),
      }))
      .filter((group) => group.ingredients.length > 0);

    const filteredInstructions = formData.instructions.filter((inst) =>
      inst.trim()
    );

    // Filter out empty instructions from all groups
    const filteredInstructionGroups = formData.instructionGroups
      .map((group) => ({
        ...group,
        instructions: group.instructions.filter((inst) => inst.trim()),
      }))
      .filter((group) => group.instructions.length > 0);

    // Flatten ingredients for backward compatibility
    const flattenedIngredients = filteredGroups.flatMap(
      (group) => group.ingredients
    );

    // Flatten instructions for backward compatibility
    const flattenedInstructions = filteredInstructionGroups.flatMap(
      (group) => group.instructions
    );

    onSubmit({
      ...formData,
      ingredients: flattenedIngredients,
      ingredientGroups: filteredGroups,
      instructions: flattenedInstructions,
      instructionGroups: filteredInstructionGroups,
    });
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      alert("Image file size must be less than 20MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Delete old image from storage if it exists
      if (formData.imagePath && !isBase64Image(formData.image)) {
        await deleteImageFromSupabase(formData.imagePath);
      }

      // Upload new image to Supabase storage
      const uploadResult = await uploadImageToSupabase(file);

      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      setFormData((prev) => ({
        ...prev,
        image: uploadResult.url,
        imagePath: uploadResult.path,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = async () => {
    try {
      // Delete image from storage if it exists and is not base64
      if (formData.imagePath && !isBase64Image(formData.image)) {
        await deleteImageFromSupabase(formData.imagePath);
      }

      setFormData((prev) => ({ ...prev, image: "", imagePath: "" }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error removing image:", error);
      // Still remove from form even if storage deletion fails
      setFormData((prev) => ({ ...prev, image: "", imagePath: "" }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Ingredient group management
  const addIngredientGroup = () => {
    setFormData((prev) => ({
      ...prev,
      ingredientGroups: [
        ...prev.ingredientGroups,
        {
          name: `Group ${prev.ingredientGroups.length + 1}`,
          ingredients: [""],
          sortOrder: prev.ingredientGroups.length,
        },
      ],
    }));
  };

  const removeIngredientGroup = (groupIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredientGroups: prev.ingredientGroups.filter(
        (_, i) => i !== groupIndex
      ),
    }));
  };

  const updateIngredientGroupName = (groupIndex: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredientGroups: prev.ingredientGroups.map((group, i) =>
        i === groupIndex ? { ...group, name } : group
      ),
    }));
  };

  const addIngredientToGroup = (groupIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredientGroups: prev.ingredientGroups.map((group, i) =>
        i === groupIndex
          ? { ...group, ingredients: [...group.ingredients, ""] }
          : group
      ),
    }));
  };

  const removeIngredientFromGroup = (
    groupIndex: number,
    ingredientIndex: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      ingredientGroups: prev.ingredientGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              ingredients: group.ingredients.filter(
                (_, j) => j !== ingredientIndex
              ),
            }
          : group
      ),
    }));
  };

  const updateIngredientInGroup = (
    groupIndex: number,
    ingredientIndex: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      ingredientGroups: prev.ingredientGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              ingredients: group.ingredients.map((ing, j) =>
                j === ingredientIndex ? value : ing
              ),
            }
          : group
      ),
    }));
  };

  // Instruction group management
  const addInstructionGroup = () => {
    setFormData((prev) => ({
      ...prev,
      instructionGroups: [
        ...prev.instructionGroups,
        {
          name: `Group ${prev.instructionGroups.length + 1}`,
          instructions: [""],
          sortOrder: prev.instructionGroups.length,
        },
      ],
    }));
  };

  const removeInstructionGroup = (groupIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      instructionGroups: prev.instructionGroups.filter(
        (_, i) => i !== groupIndex
      ),
    }));
  };

  const updateInstructionGroupName = (groupIndex: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      instructionGroups: prev.instructionGroups.map((group, i) =>
        i === groupIndex ? { ...group, name } : group
      ),
    }));
  };

  const addInstructionToGroup = (groupIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      instructionGroups: prev.instructionGroups.map((group, i) =>
        i === groupIndex
          ? { ...group, instructions: [...group.instructions, ""] }
          : group
      ),
    }));
  };

  const removeInstructionFromGroup = (
    groupIndex: number,
    instructionIndex: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      instructionGroups: prev.instructionGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              instructions: group.instructions.filter(
                (_, j) => j !== instructionIndex
              ),
            }
          : group
      ),
    }));
  };

  const updateInstructionInGroup = (
    groupIndex: number,
    instructionIndex: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      instructionGroups: prev.instructionGroups.map((group, i) =>
        i === groupIndex
          ? {
              ...group,
              instructions: group.instructions.map((inst, j) =>
                j === instructionIndex ? value : inst
              ),
            }
          : group
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
    // Handle both old ingredients array and new ingredient groups
    let ingredientGroups: IngredientGroup[] = [];

    if (recipeData.ingredientGroups && recipeData.ingredientGroups.length > 0) {
      ingredientGroups = recipeData.ingredientGroups;
    } else if (recipeData.ingredients && recipeData.ingredients.length > 0) {
      // Convert old ingredients array to a default group
      const dedupedIngredients = deduplicateIngredients(recipeData.ingredients);
      ingredientGroups = [
        {
          name: "Ingredients",
          ingredients: dedupedIngredients,
          sortOrder: 0,
        },
      ];
    } else {
      ingredientGroups = [
        {
          name: "Ingredients",
          ingredients: [""],
          sortOrder: 0,
        },
      ];
    }

    // Handle both old instructions array and new instruction groups
    let instructionGroups: InstructionGroup[] = [];

    if (
      recipeData.instructionGroups &&
      recipeData.instructionGroups.length > 0
    ) {
      instructionGroups = recipeData.instructionGroups;
    } else if (recipeData.instructions && recipeData.instructions.length > 0) {
      // Convert old instructions array to a default group
      instructionGroups = [
        {
          name: "Instructions",
          instructions: recipeData.instructions.filter((inst) => inst.trim()),
          sortOrder: 0,
        },
      ];
    } else {
      instructionGroups = [
        {
          name: "Instructions",
          instructions: [""],
          sortOrder: 0,
        },
      ];
    }

    setFormData({
      title: recipeData.title || "",
      description: recipeData.description || "",
      ingredients: recipeData.ingredients || [""],
      ingredientGroups,
      instructions: recipeData.instructions || [""],
      instructionGroups,
      prepTime: recipeData.prepTime || "",
      cookTime: recipeData.cookTime || "",
      servings: recipeData.servings || "",
      category: recipeData.category || "",
      image: recipeData.image || formData.image,
      imagePath: recipeData.imagePath || formData.imagePath, // Use AI result or preserve existing
      featured: formData.featured, // Preserve the featured setting
      featuredOrder: formData.featuredOrder, // Preserve the featured order
    });
    setShowAIAnalyzer(false);
  };

  const deduplicateIngredients = (ingredients: string[]): string[] => {
    // Deduplicate ingredients (case-insensitive, preserves first occurrence's original casing)
    const seen = new Map<string, string>();
    ingredients.forEach((ing) => {
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

    return dedupedIngredients;
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

  const CardLine = () => {
    return <div className={styles.decorativeLine}></div>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Hero Section */}
        <div className={styles.header}>
          <Button onClick={onCancel} variant="ghost" iconOnly>
            <ArrowLeft />
          </Button>
          <h1 className={`${styles.title} section-header`}>
            {recipe ? "Edit Recipe" : "Add New Recipe"}
          </h1>
          <div className={styles.spacer}></div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* AI Analysis Option - Only show for new recipes */}
          {!recipe && (
            <div className={`${styles.card} ${styles.aiCard}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>AI Recipe Analysis</h3>
                <CardLine />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.aiSection}>
                  <div className={styles.aiDescription}>
                    <Sparkles className={styles.aiIcon} />
                    <div>
                      <h4>Try AI Recipe Analysis</h4>
                      <p>
                        Upload a photo of your recipe and let our AI extract all
                        the details automatically. Perfect for handwritten
                        recipes, cookbook pages, or recipe cards!
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => setShowAIAnalyzer(true)}>
                    <Sparkles className={styles.buttonIcon} />
                    Analyze Recipe Image
                  </Button>
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

          {/* Recipe Image */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recipe Photo</h3>
              <CardLine />
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
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? (
                      <Loader2 className={styles.buttonIcon} />
                    ) : (
                      <Upload className={styles.buttonIcon} />
                    )}
                    {isUploadingImage
                      ? "Uploading..."
                      : formData.image
                      ? "Change Image"
                      : "Upload Image"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recipe Details</h3>
              <CardLine />
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

              {/* Admin-only featured order input */}
              {isAdmin && formData.featured && (
                <div className={styles.inputGroup}>
                  <label htmlFor="featuredOrder" className={styles.label}>
                    Featured Order
                  </label>
                  <input
                    id="featuredOrder"
                    type="number"
                    min="1"
                    value={formData.featuredOrder || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featuredOrder: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="e.g., 1 (first), 2 (second), etc."
                    className={styles.input}
                  />
                  <span className={styles.helpText}>
                    Lower numbers appear first. Leave empty for default order.
                  </span>
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

          {/* Ingredients - Grouped with add/remove functionality */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Ingredients</h3>
              <CardLine />
            </div>
            <div className={styles.cardContent}>
              {formData.ingredientGroups.map((group, groupIndex) => (
                <div key={groupIndex} className={styles.ingredientGroup}>
                  <div className={styles.groupHeader}>
                    <input
                      value={group.name}
                      onChange={(e) =>
                        updateIngredientGroupName(groupIndex, e.target.value)
                      }
                      placeholder="Group name (e.g., 'Avocado Topping')"
                      className={styles.groupNameInput}
                    />
                    {formData.ingredientGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredientGroup(groupIndex)}
                        className={styles.removeGroupButton}
                      >
                        <X className={styles.buttonIcon} />
                      </button>
                    )}
                  </div>

                  {group.ingredients.map((ingredient, ingredientIndex) => (
                    <div key={ingredientIndex} className={styles.listItem}>
                      <input
                        value={ingredient}
                        onChange={(e) =>
                          updateIngredientInGroup(
                            groupIndex,
                            ingredientIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Ingredient ${ingredientIndex + 1}...`}
                        className={styles.input}
                      />
                      {group.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeIngredientFromGroup(
                              groupIndex,
                              ingredientIndex
                            )
                          }
                          className={styles.removeButton}
                        >
                          <X className={styles.buttonIcon} />
                        </button>
                      )}
                    </div>
                  ))}

                  <Button
                    onClick={() => addIngredientToGroup(groupIndex)}
                    variant="outline"
                    className={styles.addIngredientButton}
                  >
                    <Plus className={styles.buttonIcon} />
                    Add Ingredient
                  </Button>
                </div>
              ))}

              <Button
                onClick={addIngredientGroup}
                variant="outline"
                className={styles.addGroupButton}
              >
                <FolderPlus className={styles.buttonIcon} />
                Add Ingredient Group
              </Button>
            </div>
          </div>

          {/* Instructions - Grouped with add/remove functionality */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Instructions</h3>
              <CardLine />
            </div>
            <div className={styles.cardContent}>
              {formData.instructionGroups.map((group, groupIndex) => (
                <div key={groupIndex} className={styles.ingredientGroup}>
                  <div className={styles.groupHeader}>
                    <input
                      value={group.name}
                      onChange={(e) =>
                        updateInstructionGroupName(groupIndex, e.target.value)
                      }
                      placeholder="Group name (e.g., 'Preheat & Prep')"
                      className={styles.groupNameInput}
                    />
                    {formData.instructionGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstructionGroup(groupIndex)}
                        className={styles.removeGroupButton}
                      >
                        <X className={styles.buttonIcon} />
                      </button>
                    )}
                  </div>

                  {group.instructions.map((instruction, instructionIndex) => (
                    <div key={instructionIndex} className={styles.listItem}>
                      <div className={styles.stepNumber}>
                        {instructionIndex + 1}
                      </div>
                      <textarea
                        value={instruction}
                        onChange={(e) =>
                          updateInstructionInGroup(
                            groupIndex,
                            instructionIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Step ${instructionIndex + 1}...`}
                        className={styles.textarea}
                      />
                      {group.instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeInstructionFromGroup(
                              groupIndex,
                              instructionIndex
                            )
                          }
                          className={styles.removeButton}
                        >
                          <X className={styles.buttonIcon} />
                        </button>
                      )}
                    </div>
                  ))}

                  <Button
                    onClick={() => addInstructionToGroup(groupIndex)}
                    variant="outline"
                    className={styles.addIngredientButton}
                  >
                    <Plus className={styles.buttonIcon} />
                    Add Step
                  </Button>
                </div>
              ))}

              <Button
                onClick={addInstructionGroup}
                variant="outline"
                className={styles.addGroupButton}
              >
                <FolderPlus className={styles.buttonIcon} />
                Add Instruction Group
              </Button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className={styles.submitButtons}>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
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
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
