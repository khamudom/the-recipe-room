"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchControls } from "@/components/features/search/search-controls/search-controls";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { RecipeCard } from "@/components/features/recipe/recipe-card/recipe-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { useSearchRecipes } from "@/hooks/use-recipes-query";
import type { Recipe } from "@/types/recipe";
import styles from "./search-results.module.css";

export function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.charAt(0).toUpperCase() + rawQuery.slice(1);
  const [searchTerm, setSearchTerm] = useState(query);

  const { data: recipes = [], isLoading, error } = useSearchRecipes(query);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

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
          <p>{error?.message || "Something went wrong with your search"}</p>
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

          <SearchControls
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          {renderResults()}
        </div>
      </div>
    </ErrorBoundary>
  );
}
