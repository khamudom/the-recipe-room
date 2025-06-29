"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header/header";
import { SearchControls } from "@/components/search-controls/search-controls";
import { Footer } from "@/components/footer/footer";
import { ErrorBoundary } from "@/components/error-boundary/error-boundary";
import { RecipeCard } from "@/components/recipe-card/recipe-card";
import { LoadingSkeleton } from "@/components/loading-skeleton/loading-skeleton";
import { database } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { Recipe } from "@/types/recipe";
import styles from "./page.module.css";

export function SearchResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch search results when query changes
  useEffect(() => {
    if (!query) {
      setRecipes([]);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await database.searchRecipes(supabase, query);
        setRecipes(results);
      } catch (err) {
        console.error("Search error:", err);
        setError(ERROR_MESSAGES.SEARCH_RECIPES);
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

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
          <Header />

          <SearchControls
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onAddRecipe={handleAddRecipeClick}
          />

          <main className={styles.main}>
            <div className={styles.searchHeader}>
              <h1>Search Results</h1>
              {query && (
                <p className={styles.searchQuery}>
                  Results for &ldquo;{query}&rdquo;
                </p>
              )}
            </div>

            {isLoading ? (
              <div className={styles.loadingContainer}>
                <LoadingSkeleton count={1} />
              </div>
            ) : error ? (
              <div className={styles.noResults}>
                <h2>Search Error</h2>
                <p>{error}</p>
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
          </main>

          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
}
