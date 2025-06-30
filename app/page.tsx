"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header/header";
import { SearchControls } from "@/components/search-controls/search-controls";
import { FeaturedRecipes } from "@/components/featured-recipes/featured-recipes";
import { CategoriesSection } from "@/components/categories-section/categories-section";
import { Footer } from "@/components/footer/footer";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import { LoadingSkeleton } from "@/components/loading-skeleton/loading-skeleton";
import { useRecipes } from "@/hooks/use-recipes";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

export default function RecipeBook() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const { featuredRecipes, isLoading, isFeaturedLoading, error } = useRecipes();

  const handleRecipeClick = useCallback(
    (recipe: Recipe) => {
      router.push(`/recipe/${recipe.id}`);
    },
    [router]
  );

  const handleAddRecipeClick = useCallback(() => {
    router.push("/add");
  }, [router]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Show loading state for initial page load
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.textureOverlay}></div>
        <div className={styles.content}>
          <Header />
          <div className={styles.loadingContainer}>
            <LoadingSkeleton count={3} />
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's a critical error
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.textureOverlay}></div>
        <div className={styles.content}>
          <Header />
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={handleRetry}>Try Again</button>
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

          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}
