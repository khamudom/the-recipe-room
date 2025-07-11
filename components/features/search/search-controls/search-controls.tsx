"use client";

import { Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import styles from "./search-controls.module.css";
import { useCallback } from "react";
import { Button } from "@/components/ui/button/button";

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddRecipe: () => void;
}

export function SearchControls({
  searchTerm,
  onSearchChange,
  onAddRecipe,
}: SearchControlsProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch) {
        router.push(`/search?q=${encodeURIComponent(trimmedSearch)}`);
        onSearchChange(""); // Reset the input after search
      }
    },
    [router, searchTerm, onSearchChange]
  );

  const handleClearSearch = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <div className={styles.controls}>
      <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
        <div className={styles.inputWrapper}>
          <input
            placeholder="Search recipes, ingredients, or categories..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
            type="search"
            aria-label="Search recipes"
          />
          {searchTerm && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className={styles.buttonIcon} aria-hidden="true" />
            </button>
          )}
          <button
            type="submit"
            className={styles.searchButton}
            aria-label="Search recipes"
          >
            <Search className={styles.buttonIcon} aria-hidden="true" />
          </button>
        </div>
      </form>
      {user ? (
        <Button
          onClick={onAddRecipe}
          className={styles.addButton}
          aria-label="Add new recipe"
        >
          <Plus className={styles.buttonIcon} aria-hidden="true" />
          Add Recipe
        </Button>
      ) : (
        <Button
          href="/auth/signin"
          className={styles.addButton}
          aria-label="Sign in to add recipe"
        >
          <Plus className={styles.buttonIcon} aria-hidden="true" />
          Sign In to Add Recipe
        </Button>
      )}
    </div>
  );
}
