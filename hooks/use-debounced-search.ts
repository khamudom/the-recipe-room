"use client";

import { useState, useEffect, useCallback } from "react";
import { SEARCH_DEBOUNCE_DELAY } from "@/lib/constants";

interface UseDebouncedSearchOptions {
  delay?: number;
  onSearch: (query: string) => void;
}

export function useDebouncedSearch({
  delay = SEARCH_DEBOUNCE_DELAY,
  onSearch,
}: UseDebouncedSearchOptions) {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useCallback(
    (query: string) => {
      const timeoutId = setTimeout(() => {
        onSearch(query);
      }, delay);

      return () => clearTimeout(timeoutId);
    },
    [delay, onSearch]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchTerm);
    return cleanup;
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  return {
    searchTerm,
    handleSearchChange,
  };
}
