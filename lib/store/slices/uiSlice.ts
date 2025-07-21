import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the UI state interface
interface UIState {
  // Modal states
  isAboutModalOpen: boolean;
  isProfileModalOpen: boolean;
  isChangePasswordModalOpen: boolean;
  isDeleteAccountModalOpen: boolean;

  // AI Chef chat state
  isAIChefChatOpen: boolean;

  // Sidebar/navigation state
  isSidebarOpen: boolean;

  // Theme state
  theme: "light" | "dark";

  // Loading states
  isLoading: boolean;
  loadingMessage: string;
}

// Initial state
const initialState: UIState = {
  isAboutModalOpen: false,
  isProfileModalOpen: false,
  isChangePasswordModalOpen: false,
  isDeleteAccountModalOpen: false,
  isAIChefChatOpen: false,
  isSidebarOpen: false,
  theme: "light",
  isLoading: false,
  loadingMessage: "",
};

// Create the UI slice
export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Modal actions
    openAboutModal: (state) => {
      state.isAboutModalOpen = true;
    },
    closeAboutModal: (state) => {
      state.isAboutModalOpen = false;
    },
    openProfileModal: (state) => {
      state.isProfileModalOpen = true;
    },
    closeProfileModal: (state) => {
      state.isProfileModalOpen = false;
    },
    openChangePasswordModal: (state) => {
      state.isChangePasswordModalOpen = true;
    },
    closeChangePasswordModal: (state) => {
      state.isChangePasswordModalOpen = false;
    },
    openDeleteAccountModal: (state) => {
      state.isDeleteAccountModalOpen = true;
    },
    closeDeleteAccountModal: (state) => {
      state.isDeleteAccountModalOpen = false;
    },

    // AI Chef chat actions
    openAIChefChat: (state) => {
      state.isAIChefChatOpen = true;
    },
    closeAIChefChat: (state) => {
      state.isAIChefChatOpen = false;
    },

    // Sidebar actions
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },

    // Theme actions
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },

    // Loading actions
    setLoading: (
      state,
      action: PayloadAction<{ isLoading: boolean; message?: string }>
    ) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || "";
    },

    // Close all modals
    closeAllModals: (state) => {
      state.isAboutModalOpen = false;
      state.isProfileModalOpen = false;
      state.isChangePasswordModalOpen = false;
      state.isDeleteAccountModalOpen = false;
    },
  },
});

// Export actions
export const {
  openAboutModal,
  closeAboutModal,
  openProfileModal,
  closeProfileModal,
  openChangePasswordModal,
  closeChangePasswordModal,
  openDeleteAccountModal,
  closeDeleteAccountModal,
  openAIChefChat,
  closeAIChefChat,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  setTheme,
  toggleTheme,
  setLoading,
  closeAllModals,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
