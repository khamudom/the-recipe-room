"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/store-hooks";
import { setQuery, clearQuery } from "@/lib/store/slices/searchSlice";
import { searchRecipes } from "@/lib/store/slices/searchThunks";
import { SearchControls } from "@/components/features/search/search-controls/search-controls";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { RecipeCard } from "@/components/features/recipe/recipe-card/recipe-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import type { Recipe } from "@/types/recipe";
import styles from "./search-results.module.css";

export function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);

  // Get search state from Redux
  const {
    query,
    results: recipes,
    isLoading,
    error,
  } = useAppSelector((state) => state.search);

  // Initialize search from URL params only once
  useEffect(() => {
    if (!hasInitialized.current) {
      const rawQuery = searchParams.get("q") || "";
      const formattedQuery =
        rawQuery.charAt(0).toUpperCase() + rawQuery.slice(1);

      if (formattedQuery) {
        dispatch(setQuery(formattedQuery));
        dispatch(searchRecipes(formattedQuery));
      }
      hasInitialized.current = true;
    }
  }, [searchParams, dispatch]);

  // Clear search when navigating away from search page
  useEffect(() => {
    return () => {
      // Only clear if we're not on a search page anymore
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/search")) {
        dispatch(clearQuery());
      }
    };
  }, [dispatch]);

  const handleRecipeClick = useCallback(
    (recipe: Recipe) => {
      router.push(`/recipe/${recipe.slug}`);
    },
    [router]
  );

  const renderContent = () => {
    if (recipes.length > 0) {
      return (
        <div className={styles.resultsGrid}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => handleRecipeClick(recipe)}
            />
          ))}
        </div>
      );
    }

    return (
      <div className={styles.noResults}>
        <h2>No recipes found</h2>
        <p>
          {query
            ? `No recipes found for "${query}". Try searching for different keywords.`
            : "Enter a search term to find recipes."}
        </p>
      </div>
    );
  };

  const renderResults = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            marginTop: "30%",
          }}
        >
          <LoadingSpinner />
        </div>
      );
    }

    // Show error state
    if (error) {
      return (
        <div className={styles.noResults}>
          <h2>Search Error</h2>
          <p>{error || "Something went wrong with your search"}</p>
        </div>
      );
    }

    // Show content
    return renderContent();
  };

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.searchHeader}>
            <h1 className="section-header">Search Results for {query}</h1>
          </div>

          <SearchControls />

          {renderResults()}
        </div>
      </div>
    </ErrorBoundary>
  );
}
