import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Recipe } from "@/types/recipe";

// Define the search state interface
interface SearchState {
  // Search query
  query: string;

  // Search results
  results: Recipe[];

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Search filters (for future use)
  filters: {
    category: string | null;
    difficulty: string | null;
    cookingTime: string | null;
  };

  // Pagination (for future use)
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Initial state
const initialState: SearchState = {
  query: "",
  results: [],
  isLoading: false,
  error: null,
  filters: {
    category: null,
    difficulty: null,
    cookingTime: null,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
};

// Create the search slice
export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // Set search query
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },

    // Clear search query
    clearQuery: (state) => {
      state.query = "";
      state.results = [];
      state.error = null;
    },

    // Set search results
    setResults: (state, action: PayloadAction<Recipe[]>) => {
      state.results = action.payload;
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Set error state
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set filters
    setFilter: (
      state,
      action: PayloadAction<{
        key: keyof SearchState["filters"];
        value: string | null;
      }>
    ) => {
      state.filters[action.payload.key] = action.payload.value;
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filters = {
        category: null,
        difficulty: null,
        cookingTime: null,
      };
    },

    // Set pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },

    // Reset search state
    resetSearch: (state) => {
      state.query = "";
      state.results = [];
      state.isLoading = false;
      state.error = null;
      state.filters = {
        category: null,
        difficulty: null,
        cookingTime: null,
      };
      state.pagination = {
        page: 1,
        limit: 12,
        total: 0,
      };
    },
  },
});

// Export actions
export const {
  setQuery,
  clearQuery,
  setResults,
  setLoading,
  setError,
  clearError,
  setFilter,
  clearFilters,
  setPage,
  resetSearch,
} = searchSlice.actions;

// Export reducer
export default searchSlice.reducer;
