"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/store-hooks";
import { setQuery } from "@/lib/store/slices/searchSlice";
import { searchRecipes } from "@/lib/store/slices/searchThunks";
import styles from "./search-controls.module.css";
import { useCallback } from "react";

export function SearchControls() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.search.query);

  const handleSearchChange = useCallback(
    (value: string) => {
      dispatch(setQuery(value));
    },
    [dispatch]
  );

  const handleSearchSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch) {
        // Update URL for bookmarking/sharing
        router.push(`/search?q=${encodeURIComponent(trimmedSearch)}`);

        // Perform search via Redux
        await dispatch(searchRecipes(trimmedSearch));
      }
    },
    [router, searchTerm, dispatch]
  );

  return (
    <div className={styles.controls}>
      <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
        <div className={styles.inputWrapper}>
          <input
            placeholder="Search recipes, ingredients, categories"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.searchInput}
            type="search"
            aria-label="Search recipes"
          />
          <button
            type="submit"
            className={styles.searchButton}
            aria-label="Search recipes"
          >
            <Search className={styles.buttonIcon} aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
