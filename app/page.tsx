"use client";

import { useState, useEffect } from "react";
import { Plus, Search, BookOpen, ChefHat } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeDetail } from "@/components/recipe-detail";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

const sampleRecipes: Recipe[] = [
  {
    id: "1",
    title: "Grandma's Apple Pie",
    description: "A classic apple pie recipe passed down through generations",
    ingredients: [
      "6 cups sliced apples",
      "3/4 cup sugar",
      "2 tbsp flour",
      "1 tsp cinnamon",
      "1/4 tsp nutmeg",
      "2 pie crusts",
    ],
    instructions: [
      "Preheat oven to 425°F",
      "Mix apples with sugar, flour, and spices",
      "Place filling in bottom crust",
      "Cover with top crust and seal edges",
      "Bake for 45-50 minutes until golden",
    ],
    prepTime: "30 minutes",
    cookTime: "50 minutes",
    servings: 8,
    category: "Dessert",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Hearty Beef Stew",
    description: "A warming, comforting stew perfect for cold evenings",
    ingredients: [
      "2 lbs beef chuck, cubed",
      "4 carrots, sliced",
      "3 potatoes, cubed",
      "1 onion, diced",
      "2 cups beef broth",
      "2 tbsp tomato paste",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Brown beef in a large pot",
      "Add onions and cook until soft",
      "Add remaining ingredients",
      "Simmer for 2 hours until tender",
      "Season to taste and serve hot",
    ],
    prepTime: "20 minutes",
    cookTime: "2 hours",
    servings: 6,
    category: "Main Course",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Mediterranean Quinoa Salad",
    description:
      "A fresh and healthy salad bursting with Mediterranean flavors",
    ingredients: [
      "1 cup quinoa, rinsed",
      "2 cups water",
      "1 cucumber, diced",
      "1 cup cherry tomatoes, halved",
      "1/2 cup kalamata olives, pitted and sliced",
      "1/4 cup red onion, finely diced",
      "1/2 cup feta cheese, crumbled",
      "2 tbsp extra virgin olive oil",
      "1 tbsp lemon juice",
      "1 tsp dried oregano",
      "Salt and pepper to taste",
    ],
    instructions: [
      "Cook quinoa according to package instructions, then let cool",
      "In a large bowl, combine cooled quinoa with cucumber, tomatoes, olives, and red onion",
      "In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper",
      "Pour dressing over salad and toss gently to combine",
      "Sprinkle feta cheese on top and serve chilled",
    ],
    prepTime: "15 minutes",
    cookTime: "15 minutes",
    servings: 4,
    category: "Salad",
    image: "/placeholder.svg?height=200&width=300",
    createdAt: new Date().toISOString(),
  },
];

export default function RecipeBook() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    setRecipes(sampleRecipes);
  }, []);

  useEffect(() => {
    if (
      recipes.length > 0 ||
      localStorage.getItem("recipe-room-recipes") !== null
    ) {
      localStorage.setItem("recipe-room-recipes", JSON.stringify(recipes));
    }
  }, [recipes]);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleAddRecipe = (recipe: Omit<Recipe, "id" | "createdAt">) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setRecipes((prev) => [newRecipe, ...prev]);
    setIsFormOpen(false);
  };

  const handleEditRecipe = (recipe: Omit<Recipe, "id" | "createdAt">) => {
    if (editingRecipe) {
      const updatedRecipe: Recipe = {
        ...recipe,
        id: editingRecipe.id,
        createdAt: editingRecipe.createdAt,
      };
      setRecipes((prev) =>
        prev.map((r) => (r.id === editingRecipe.id ? updatedRecipe : r))
      );
      setEditingRecipe(null);
      setIsFormOpen(false);
      setSelectedRecipe(updatedRecipe);
    }
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    setSelectedRecipe(null);
  };

  const openEditForm = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
    setSelectedRecipe(null);
  };

  if (isFormOpen) {
    return (
      <RecipeForm
        recipe={editingRecipe}
        onSubmit={editingRecipe ? handleEditRecipe : handleAddRecipe}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingRecipe(null);
        }}
      />
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
            <BookOpen className={styles.headerIcon} />
            <h1 className={styles.mainTitle}>The Recipe Room</h1>
            <ChefHat className={styles.headerIcon} />
          </div>
          <div className={styles.decorativeLine}></div>
          <p className={styles.subtitle}>
            Treasured recipes from our kitchen to yours
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
          <button
            onClick={() => setIsFormOpen(true)}
            className={styles.addButton}
          >
            <Plus className={styles.buttonIcon} />
            Add New Recipe
          </button>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <div className={styles.emptyState}>
            <ChefHat className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No recipes found</h3>
            <p className={styles.emptyText}>
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by adding your first recipe!"}
            </p>
          </div>
        ) : (
          <div className={styles.recipeGrid}>
            {filteredRecipes.map((recipe) => (
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
