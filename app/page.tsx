"use client";

import { useState, useCallback, useMemo } from "react";
import { RecipeForm } from "@/components/recipe-form/recipe-form";
import { RecipeDetail } from "@/components/recipe-detail/recipe-detail";
import { Header } from "@/components/header/header";
import { SearchControls } from "@/components/search-controls/search-controls";
import { FeaturedRecipes } from "@/components/featured-recipes/featured-recipes";
import { CategoriesSection } from "@/components/categories-section/categories-section";
import { Footer } from "@/components/footer/footer";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import ProtectedRoute from "@/components/protected-route/protected-route";
import { useRecipes } from "@/hooks/use-recipes";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

export default function RecipeBook() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const {
    featuredRecipes,
    isLoading,
    isFeaturedLoading,
    error,
    searchRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  } = useRecipes();

  const { searchTerm, handleSearchChange } = useDebouncedSearch({
    onSearch: searchRecipes,
  });

  // Memoized handlers to prevent unnecessary re-renders
  const handleAddRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "createdAt" | "userId">) => {
      try {
        setIsSubmitting(true);
        await addRecipe(recipe);
        setIsFormOpen(false);
        setNotification("Recipe created successfully!");
      } catch (error) {
        console.error("Error creating recipe:", error);
        setNotification(ERROR_MESSAGES.CREATE_RECIPE);
      } finally {
        setIsSubmitting(false);
      }
    },
    [addRecipe]
  );

  const handleEditRecipe = useCallback(
    async (recipe: Omit<Recipe, "id" | "createdAt" | "userId">) => {
      if (editingRecipe) {
        try {
          setIsSubmitting(true);
          const updatedRecipe = await updateRecipe(editingRecipe.id, recipe);
          setEditingRecipe(null);
          setIsFormOpen(false);
          setSelectedRecipe(updatedRecipe);
          setNotification("Recipe updated successfully!");
        } catch (error) {
          console.error("Error updating recipe:", error);
          setNotification(ERROR_MESSAGES.UPDATE_RECIPE);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [editingRecipe, updateRecipe]
  );

  const handleDeleteRecipe = useCallback(
    async (id: string) => {
      try {
        await deleteRecipe(id);
        setSelectedRecipe(null);
        setNotification("Recipe deleted successfully!");
      } catch (error) {
        console.error("Error deleting recipe:", error);
        setNotification(ERROR_MESSAGES.DELETE_RECIPE);
      }
    },
    [deleteRecipe]
  );

  const openEditForm = useCallback((recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
    setSelectedRecipe(null);
  }, []);

  const handleRecipeClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleAddRecipeClick = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleBackToRecipes = useCallback(() => {
    setSelectedRecipe(null);
    setEditingRecipe(null);
    setIsFormOpen(false);
  }, []);

  // Clear notification after 5 seconds
  useMemo(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Show form if open
  if (isFormOpen) {
    return (
      <ProtectedRoute>
        <ErrorBoundary>
          <RecipeForm
            recipe={editingRecipe}
            onSubmit={editingRecipe ? handleEditRecipe : handleAddRecipe}
            onCancel={handleBackToRecipes}
            isSubmitting={isSubmitting}
          />
        </ErrorBoundary>
      </ProtectedRoute>
    );
  }

  // Show recipe detail if selected
  if (selectedRecipe) {
    return (
      <ErrorBoundary>
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={handleBackToRecipes}
          onEdit={() => openEditForm(selectedRecipe)}
          onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
        />
      </ErrorBoundary>
    );
  }

  // Show error state if there's a critical error
  if (error && !isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.textureOverlay}></div>
        <div className={styles.content}>
          <Header />
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  // Main page layout
  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.textureOverlay}></div>
        <div className={styles.content}>
          <Header />

          <SearchControls
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onAddRecipe={handleAddRecipeClick}
            isSubmitting={isSubmitting}
          />

          <FeaturedRecipes
            recipes={featuredRecipes}
            isLoading={isFeaturedLoading}
            onRecipeClick={handleRecipeClick}
          />

          <CategoriesSection />

          <Footer notification={notification} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
