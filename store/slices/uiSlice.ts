/**
 * UI Slice
 * Manages global UI state including loading states, errors, and notifications
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}

interface UIState {
  // Loading states
  isLoading: boolean;
  loadingMessage?: string;

  // Error states
  error: string | null;
  errorDetails?: any;

  // Notifications
  notifications: Notification[];

  // Modal states
  modals: {
    [key: string]: boolean;
  };

  // Sidebar state
  sidebarOpen: boolean;

  // Theme
  theme: "light" | "dark" | "system";

  // Layout preferences
  layout: {
    compactMode: boolean;
    showSidebar: boolean;
  };
}

const initialState: UIState = {
  isLoading: false,
  error: null,
  notifications: [],
  modals: {},
  sidebarOpen: true,
  theme: "system",
  layout: {
    compactMode: false,
    showSidebar: true,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Loading actions
    setLoading: (
      state,
      action: PayloadAction<{ isLoading: boolean; message?: string }>,
    ) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message;
    },

    // Error actions
    setError: (
      state,
      action: PayloadAction<{ message: string; details?: any }>,
    ) => {
      state.error = action.payload.message;
      state.errorDetails = action.payload.details;
    },

    clearError: (state) => {
      state.error = null;
      state.errorDetails = undefined;
    },

    // Notification actions
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "timestamp">>,
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modal actions
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },

    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },

    closeAllModals: (state) => {
      state.modals = {};
    },

    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    // Theme actions
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload;
    },

    // Layout actions
    setCompactMode: (state, action: PayloadAction<boolean>) => {
      state.layout.compactMode = action.payload;
    },

    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.layout.showSidebar = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setCompactMode,
  setShowSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectIsLoading = (state: { ui: UIState }) => state.ui.isLoading;
export const selectLoadingMessage = (state: { ui: UIState }) =>
  state.ui.loadingMessage;
export const selectError = (state: { ui: UIState }) => state.ui.error;
export const selectErrorDetails = (state: { ui: UIState }) =>
  state.ui.errorDetails;
export const selectNotifications = (state: { ui: UIState }) =>
  state.ui.notifications;
export const selectModals = (state: { ui: UIState }) => state.ui.modals;
export const selectSidebarOpen = (state: { ui: UIState }) =>
  state.ui.sidebarOpen;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectLayout = (state: { ui: UIState }) => state.ui.layout;
