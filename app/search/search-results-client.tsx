"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchControls } from "@/components/features/search/search-controls/search-controls";
import { ErrorBoundary } from "@/components/ui/error-boundary/error-boundary";
import { RecipeCard } from "@/components/features/recipe/recipe-card/recipe-card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton/loading-skeleton";
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
      router.push(`/recipe/${recipe.id}`);
    },
    [router]
  );

  const handleAddRecipeClick = useCallback(() => {
    router.push("/add");
  }, [router]);

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.textureOverlay}></div>
        <div className={styles.content}>
          <div className={styles.searchHeader}>
            <h1 className="page-header">Search Results for {query}</h1>
          </div>

          <SearchControls
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onAddRecipe={handleAddRecipeClick}
          />

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSkeleton count={1} />
            </div>
          ) : error ? (
            <div className={styles.noResults}>
              <h2>Search Error</h2>
              <p>{error.message}</p>
            </div>
          ) : recipes.length > 0 ? (
            <div className={styles.resultsGrid}>
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <h2>No recipes found</h2>
              <p>
                {query
                  ? `No recipes found for "${query}". Try searching for different keywords.`
                  : "Enter a search term to find recipes."}
              </p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
