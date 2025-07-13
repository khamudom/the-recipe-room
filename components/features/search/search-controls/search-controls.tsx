"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./search-controls.module.css";
import { useCallback } from "react";

interface SearchControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchControls({
  searchTerm,
  onSearchChange,
}: SearchControlsProps) {
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

  return (
    <div className={styles.controls}>
      <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
        <div className={styles.inputWrapper}>
          <input
            placeholder="Search for recipes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
