"use client";

import { Plus, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import styles from "./search-controls.module.css";

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddRecipe: () => void;
  isSubmitting?: boolean;
}

export function SearchControls({
  searchTerm,
  onSearchChange,
  onAddRecipe,
  isSubmitting = false,
}: SearchControlsProps) {
  const { user } = useAuth();

  return (
    <div className={styles.controls}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input
          placeholder="Search recipes, ingredients, or categories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      {user ? (
        <button
          onClick={onAddRecipe}
          className={styles.addButton}
          disabled={isSubmitting}
        >
          <Plus className={styles.buttonIcon} />
          Add New Recipe
        </button>
      ) : (
        <a href="/auth/signin" className={styles.addButton}>
          <Plus className={styles.buttonIcon} />
          Add Recipe
        </a>
      )}
    </div>
  );
}
