"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/layout/hero/hero";
import { SearchControls } from "@/components/features/search/search-controls/search-controls";
import { FeaturedRecipes } from "@/components/features/featured-recipes/featured-recipes";
import { CategoriesSection } from "@/components/features/categories-section/categories-section";
import { Footer } from "@/components/layout/footer/footer";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton/loading-skeleton";
import { useFeaturedRecipes } from "@/hooks/use-recipes-query";
import { usePageTransition } from "@/hooks/use-page-transition";
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

  const { isTransitioning } = usePageTransition({
    onTransitionStart: () => {
      // When transition starts, if we're going to categories, prepare the scroll
      if (window.location.hash === "#categories") {
        // Set a flag to scroll after transition
        sessionStorage.setItem("scrollToCategories", "true");
      }
    },
    onTransitionEnd: () => {
      // When transition ends, check if we need to scroll to categories
      if (sessionStorage.getItem("scrollToCategories") === "true") {
        sessionStorage.removeItem("scrollToCategories");

        // Use multiple attempts to ensure it works on mobile
        const attemptScroll = (attempts = 0) => {
          const categoriesSection = document.getElementById("categories");
          if (categoriesSection && attempts < 5) {
            const elementTop = categoriesSection.offsetTop;
            const headerOffset = 80;
            const offsetPosition = elementTop - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "auto",
            });

            // Remove the hash from URL
            window.history.replaceState(null, "", window.location.pathname);

            // Verify scroll worked, if not, try again
            setTimeout(() => {
              if (window.scrollY < offsetPosition - 50) {
                attemptScroll(attempts + 1);
              }
            }, 100);
          }
        };

        // Start the scroll attempt
        setTimeout(attemptScroll, 50);
      }
    },
  });

  // Handle scrolling to categories section when coming from category page (fallback for direct navigation)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#categories" &&
      !isTransitioning &&
      !sessionStorage.getItem("scrollToCategories")
    ) {
      const scrollToCategories = () => {
        const categoriesSection = document.getElementById("categories");
        if (categoriesSection) {
          const elementTop = categoriesSection.offsetTop;
          const headerOffset = 80;
          const offsetPosition = elementTop - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "auto",
          });

          window.history.replaceState(null, "", window.location.pathname);
        }
      };

      const timer = setTimeout(scrollToCategories, 100);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

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

  const renderContent = () => {
    // Show loading state only if we have no cached data and are loading
    if (isFeaturedLoading && featuredRecipes.length === 0) {
      return (
        <div className={styles.loadingContainer}>
          <LoadingSkeleton count={3} />
        </div>
      );
    }

    // Show error state if there's a critical error
    if (featuredError) {
      return (
        <Card className={styles.errorStateCard}>
          <p>Failed to load featured recipes. Please try again.</p>
          <Button onClick={handleRetry}>Try Again</Button>
        </Card>
      );
    }

    // Main content
    return (
      <>
        <FeaturedRecipes
          recipes={featuredRecipes}
          isLoading={isFeaturedLoading}
          onRecipeClick={handleRecipeClick}
        />

        <CategoriesSection />
      </>
    );
  };

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

          {renderContent()}

          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}
