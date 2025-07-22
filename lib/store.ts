import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./store/slices/uiSlice";
import searchReducer from "./store/slices/searchSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    search: searchReducer,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
