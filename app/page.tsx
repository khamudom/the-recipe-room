"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header/header";
import { SearchControls } from "@/components/search-controls/search-controls";
import { FeaturedRecipes } from "@/components/featured-recipes/featured-recipes";
import { CategoriesSection } from "@/components/categories-section/categories-section";
import { Footer } from "@/components/footer/footer";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import { useRecipes } from "@/hooks/use-recipes";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

export default function RecipeBook() {
  const router = useRouter();
  const [notification, setNotification] = useState<string | null>(null);

  const {
    featuredRecipes,
    isLoading,
    isFeaturedLoading,
    error,
    searchRecipes,
  } = useRecipes();

  const { searchTerm, handleSearchChange } = useDebouncedSearch({
    onSearch: searchRecipes,
  });

  const handleRecipeClick = useCallback(
    (recipe: Recipe) => {
      router.push(`/recipe/${recipe.id}`);
    },
    [router]
  );

  const handleAddRecipeClick = useCallback(() => {
    router.push("/add");
  }, [router]);

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
