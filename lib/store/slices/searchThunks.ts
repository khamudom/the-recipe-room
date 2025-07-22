import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoading, setError, setResults } from "./searchSlice";

// Async thunk for searching recipes
export const searchRecipes = createAsyncThunk(
  "search/searchRecipes",
  async (query: string, { dispatch }) => {
    if (!query.trim()) {
      dispatch(setResults([]));
      return [];
    }

    try {
      dispatch(setLoading(true));

      // Use the existing search API endpoint
      const response = await fetch(
        `/api/recipes?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const recipes = await response.json();
      dispatch(setResults(recipes));
      return recipes;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Search failed";
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Async thunk for clearing search
export const clearSearch = createAsyncThunk(
  "search/clearSearch",
  async (_, { dispatch }) => {
    dispatch(setResults([]));
    dispatch(setError(""));
    return [];
  }
);
