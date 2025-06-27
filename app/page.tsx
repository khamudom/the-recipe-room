"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeDetail } from "@/components/recipe-detail";
import { database } from "@/lib/database";
import { useAuth } from "@/lib/auth-context";
import ProtectedRoute from "@/components/protected-route";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

const CATEGORIES = [
  "Appetizer",
  "Main Course",
  "Side Dish",
  "Dessert",
  "Beverage",
  "Breakfast",
  "Snack",
];

export default function RecipeBook() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const { user } = useAuth();
  const recipesRef = useRef<Recipe[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);

  // Update ref when recipes change
  useEffect(() => {
    recipesRef.current = recipes;
  }, [recipes]);

  // Helper function to get appropriate empty state message
  const getEmptyStateMessage = () => {
    if (searchTerm) {
      return "Try adjusting your search terms";
    }
    if (user) {
      return "Start by adding your first recipe! Your recipes will be private to you.";
    }
    return "Sign in to create your own private recipes, or check back later for featured recipes!";
  };

  // Load recipes from database
  useEffect(() => {
    loadRecipes();
  }, [user]);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      // Load recipes based on user authentication status
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

  // Debounced search
  useEffect(() => {
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
        // Fallback to client-side search on current recipes
        const filtered = recipesRef.current.filter(
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
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddRecipe = async (
    recipe: Omit<Recipe, "id" | "createdAt" | "userId">
  ) => {
    try {
      setIsSubmitting(true);
      const newRecipe = await database.createRecipe(recipe);
      setRecipes((prev) => [newRecipe, ...prev]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating recipe:", error);
      setNotification("Failed to create recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRecipe = async (
    recipe: Omit<Recipe, "id" | "createdAt" | "userId">
  ) => {
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
        setNotification("Failed to update recipe. Please try again.");
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
      setNotification("Failed to delete recipe. Please try again.");
    }
  };

  const openEditForm = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
    setSelectedRecipe(null);
  };

  // Fetch featured recipes
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await database.getFeaturedRecipes();
        setFeaturedRecipes(data);
      } catch (error) {
        setFeaturedRecipes([]);
      }
    };
    fetchFeatured();
  }, []);

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
              Add Recipe
            </a>
          )}
        </div>

        {/* Featured Recipes Section */}
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Recipes</h2>
          {featuredRecipes.length === 0 && isLoading ? (
            <div className={styles.featuredLoader}>
              <Loader2 className={styles.spinning} />
            </div>
          ) : featuredRecipes.length > 0 ? (
            <div className={styles.recipeGrid}>
              {featuredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          ) : (
            <div style={{ minHeight: "64px" }}></div> // invisible space if no featured recipes
          )}
        </section>

        {/* Categories Section */}
        <section className={styles.categoriesSection}>
          <h2 className={styles.sectionTitle}>Recipe Categories</h2>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={`/category/${encodeURIComponent(cat)}`}
                className={styles.categoryCard}
              >
                {cat}
              </a>
            ))}
          </div>
        </section>

        {/* Decorative footer */}
        <div className={styles.footer}>
          <div className={styles.footerLine}></div>
          {notification && (
            <div className={styles.notification}>{notification}</div>
          )}
          <p className={styles.footerText}>
            &quot;The secret ingredient is always love&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
