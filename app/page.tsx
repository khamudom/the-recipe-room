"use client";

import { useState, useEffect } from "react";
import { Plus, Search, BookOpen, ChefHat, Loader2, Star } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeDetail } from "@/components/recipe-detail";
import { database } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/protected-route";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

export default function RecipeBook() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Load recipes from database
  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      // Load all recipes for all users
      const data = await database.getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error("Error loading recipes:", error);
      // Fallback to empty array if database is not available
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Search recipes
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadRecipes();
      return;
    }

    try {
      setIsLoading(true);
      const results = await database.searchRecipes(query);
      setRecipes(results);
    } catch (error) {
      console.error("Error searching recipes:", error);
      // Fallback to client-side search
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase()) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(query.toLowerCase())
          ) ||
          recipe.category.toLowerCase().includes(query.toLowerCase())
      );
      setRecipes(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddRecipe = async (recipe: Omit<Recipe, "id" | "createdAt">) => {
    try {
      setIsSubmitting(true);
      const newRecipe = await database.createRecipe(recipe);
      setRecipes((prev) => [newRecipe, ...prev]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRecipe = async (recipe: Omit<Recipe, "id" | "createdAt">) => {
    if (editingRecipe) {
      try {
        setIsSubmitting(true);
        const updatedRecipe = await database.updateRecipe(
          editingRecipe.id,
          recipe
        );
        setRecipes((prev) =>
          prev.map((r) => (r.id === editingRecipe.id ? updatedRecipe : r))
        );
        setEditingRecipe(null);
        setIsFormOpen(false);
        setSelectedRecipe(updatedRecipe);
      } catch (error) {
        console.error("Error updating recipe:", error);
        alert("Failed to update recipe. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await database.deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      setSelectedRecipe(null);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    }
  };

  const openEditForm = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
    setSelectedRecipe(null);
  };

  if (isFormOpen) {
    return (
      <ProtectedRoute>
        <RecipeForm
          recipe={editingRecipe}
          onSubmit={editingRecipe ? handleEditRecipe : handleAddRecipe}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingRecipe(null);
          }}
          isSubmitting={isSubmitting}
        />
      </ProtectedRoute>
    );
  }

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        onEdit={() => openEditForm(selectedRecipe)}
        onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.textureOverlay}></div>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>Welcome to the Kitchen</h1>
          </div>
          <div className={styles.decorativeLine}></div>
          <p className={styles.subtitle}>
            Where every meal begins and memories are made
          </p>
        </div>

        {/* Search and Add Recipe */}
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              placeholder="Search recipes, ingredients, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          {user ? (
            <button
              onClick={() => setIsFormOpen(true)}
              className={styles.addButton}
              disabled={isSubmitting}
            >
              <Plus className={styles.buttonIcon} />
              Add New Recipe
            </button>
          ) : (
            <a href="/auth/signin" className={styles.addButton}>
              <Plus className={styles.buttonIcon} />
              Sign In to Add Recipe
            </a>
          )}
        </div>

        {/* Recipe Grid */}
        {isLoading ? (
          <div className={styles.emptyState}>
            <Loader2 className={`${styles.emptyIcon} ${styles.spinning}`} />
            <h3 className={styles.emptyTitle}>Loading recipes...</h3>
            <p className={styles.emptyText}>
              Please wait while we fetch your recipes
            </p>
          </div>
        ) : recipes.length === 0 ? (
          <div className={styles.emptyState}>
            <ChefHat className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>
              {searchTerm
                ? "No recipes found"
                : user
                ? "No recipes yet"
                : "No featured recipes"}
            </h3>
            <p className={styles.emptyText}>
              {searchTerm
                ? "Try adjusting your search terms"
                : user
                ? "Start by adding your first recipe!"
                : "Check back later for featured recipes!"}
            </p>
          </div>
        ) : (
          <div className={styles.recipeGrid}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        )}

        {/* Decorative footer */}
        <div className={styles.footer}>
          <div className={styles.footerLine}></div>
          <p className={styles.footerText}>
            "The secret ingredient is always love"
          </p>
        </div>
      </div>
    </div>
  );
}
