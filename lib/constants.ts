export const CATEGORIES = [
  "Appetizer",
  "Main Course",
  "Side Dish",
  "Dessert",
  "Beverage",
  "Breakfast",
  "Snack",
] as const;

export const SEARCH_DEBOUNCE_DELAY = 300;

export const DEFAULT_PAGE_TITLE = "Your Personal Recipe Collection";
export const DEFAULT_PAGE_SUBTITLE =
  "Save your favorites, discover new ones, and build your own recipe room to cook from anytime.";
export const DEFAULT_FOOTER_QUOTE = '"The secret ingredient is always love"';

export const ERROR_MESSAGES = {
  CREATE_RECIPE: "Failed to create recipe. Please try again.",
  UPDATE_RECIPE: "Failed to update recipe. Please try again.",
  DELETE_RECIPE: "Failed to delete recipe. Please try again.",
  LOAD_RECIPES: "Failed to load recipes",
  LOAD_FEATURED: "Failed to load featured recipes",
  SEARCH_RECIPES: "Failed to search recipes",
  FETCH_RECIPE: "Failed to fetch recipe. Please try again.",
} as const;

export const SUCCESS_MESSAGES = {
  RECIPE_CREATED: "Recipe created successfully!",
  RECIPE_UPDATED: "Recipe updated successfully!",
  RECIPE_DELETED: "Recipe deleted successfully!",
} as const;
