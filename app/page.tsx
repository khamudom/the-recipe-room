"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/layout/hero/hero";
import { SearchControls } from "@/components/features/search/search-controls/search-controls";
import { FeaturedRecipes } from "@/components/features/featured-recipes/featured-recipes";
import { CategoriesSection } from "@/components/features/categories-section/categories-section";
import { Footer } from "@/components/layout/footer/footer";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton/loading-skeleton";
import { useFeaturedRecipes } from "@/hooks/use-recipes-query";
import { Card } from "@/components/ui/card/card";
import { Button } from "@/components/ui/button/button";
import type { Recipe } from "@/types/recipe";
import styles from "./home.module.css";

export default function RecipeBook() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: featuredRecipes = [],
    isLoading: isFeaturedLoading,
    error: featuredError,
  } = useFeaturedRecipes();

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

  // Show loading state only if we have no cached data and are loading
  if (isFeaturedLoading && featuredRecipes.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loadingContainer}>
            <LoadingSkeleton count={3} />
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's a critical error
  if (featuredError) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <HeroSection />
          <Card className={styles.errorStateCard}>
            <p>Failed to load featured recipes. Please try again.</p>
            <Button onClick={handleRetry}>Try Again</Button>
          </Card>
        </div>
      </div>
    );
  }

  // Main page layout
  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.content}>
          <HeroSection />

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
