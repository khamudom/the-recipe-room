# Redux Implementation Guide

## What is Redux? 🤔

Redux is a predictable state management library for JavaScript applications. It helps manage **global state** - data that needs to be shared across multiple components in your app.

## Why Redux in This App? 🎯

### Before Redux:

- **React Query**: Managed server state (recipes, user data from API)
- **React Context**: Managed auth state
- **Local State**: Managed UI state (modals, forms, etc.)

### After Redux:

- **React Query**: Still manages server state (recipes, user data)
- **React Context**: Still manages auth state
- **Redux**: Manages client-side UI state (modals, theme, loading states, navigation)

## Redux Architecture in This App 🏗️

### Store Structure

```
lib/store/
├── store.ts              # Main store configuration
├── hooks.ts              # Typed hooks for components
└── slices/
    └── uiSlice.ts        # UI state management
```

### UI State Managed by Redux

- **Modal States**: About modal, profile modals, etc.
- **AI Chef Chat**: Open/close state
- **Theme**: Light/dark mode
- **Loading States**: Global loading indicators
- **Navigation**: Sidebar state, etc.

## How to Use Redux in Components 🔧

### 1. Reading State

```typescript
import { useAppSelector } from "@/lib/store/store-hooks";

function MyComponent() {
  const theme = useAppSelector((state) => state.ui.theme);
  const isLoading = useAppSelector((state) => state.ui.isLoading);

  return <div>Current theme: {theme}</div>;
}
```

### 2. Dispatching Actions

```typescript
import { useAppDispatch } from "@/lib/store/store-hooks";
import { toggleTheme, setLoading } from "@/lib/store/slices/uiSlice";

function MyComponent() {
  const dispatch = useAppDispatch();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLoading = () => {
    dispatch(setLoading({ isLoading: true, message: "Loading..." }));
  };

  return <button onClick={handleThemeToggle}>Toggle Theme</button>;
}
```

## Benefits of This Redux Implementation ✅

### 1. **Predictable State Management**

- All UI state changes go through Redux actions
- State changes are traceable and debuggable
- No more prop drilling for shared state

### 2. **Developer Experience**

- Redux DevTools integration for debugging
- TypeScript support with typed hooks
- Clear separation of concerns

### 3. **Scalability**

- Easy to add new UI state
- Centralized state logic
- Reusable actions and selectors

### 4. **Performance**

- Components only re-render when their specific state changes
- Efficient state updates with Redux Toolkit

## Redux vs Other State Management

| State Type   | Before Redux  | After Redux      |
| ------------ | ------------- | ---------------- |
| Server State | React Query   | React Query ✅   |
| Auth State   | React Context | React Context ✅ |
| UI State     | Local State   | Redux ✅         |
| Form State   | Local State   | Redux ✅         |

## Redux DevTools 🔧

The app includes Redux DevTools integration for development:

1. Install the [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
2. Open your browser's developer tools
3. Go to the "Redux" tab
4. See all state changes in real-time!

## Demo Component

The `ReduxDemo` component (only visible in development) showcases:

- Theme management
- Loading state management
- Modal state management
- Real-time state inspection

## Future Enhancements 🚀

### Potential Redux Slices to Add:

1. **User Preferences Slice**

   - Recipe display preferences
   - Search history
   - Favorite categories

2. **Navigation Slice**

   - Current route state
   - Breadcrumb navigation
   - Sidebar state

3. **Form Slice**

   - Multi-step form state
   - Form validation state
   - Draft saving

4. **Notification Slice**
   - Toast notifications
   - Error messages
   - Success confirmations

## Key Redux Concepts Demonstrated 📚

### 1. **Store**

- Centralized state container
- Configured with Redux Toolkit

### 2. **Slices**

- Modular state management
- Actions and reducers in one file
- Immutable state updates

### 3. **Actions**

- Describe what happened
- Carry data to the store
- Triggered by user interactions

### 4. **Reducers**

- Pure functions that update state
- Handle actions and return new state
- Immutable updates with Redux Toolkit

### 5. **Selectors**

- Extract specific data from state
- Memoized for performance
- Used in components via `useAppSelector`

## Code Examples 📝

### Creating a New Slice

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MyState {
  value: number;
  isLoading: boolean;
}

const initialState: MyState = {
  value: 0,
  isLoading: false,
};

export const mySlice = createSlice({
  name: "my",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { increment, setLoading } = mySlice.actions;
export default mySlice.reducer;
```

### Using in Components

```typescript
import { useAppSelector, useAppDispatch } from "@/lib/store/store-hooks";
import { increment, setLoading } from "@/lib/store/slices/mySlice";

function MyComponent() {
  const value = useAppSelector((state) => state.my.value);
  const isLoading = useAppSelector((state) => state.my.isLoading);
  const dispatch = useAppDispatch();

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(setLoading(true))}>Set Loading</button>
    </div>
  );
}
```

## Conclusion 🎉

This Redux implementation provides:

- **Clean separation** between server and client state
- **Predictable state management** for UI interactions
- **Excellent developer experience** with DevTools
- **Type safety** with TypeScript
- **Scalable architecture** for future features

The combination of React Query (server state) + Redux (client state) + React Context (auth state) creates a robust, maintainable state management solution perfect for modern React applications.
