/**
 * Redux Store Configuration
 * Main store setup with RTK Query and middleware
 */
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Import existing slices
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/classroom/dashboardSlice";
import inboxReducer from "./slices/inboxSlice";
import userRoleReducer from "./slices/userRoleSlice";

// Import new slices
import uiReducer from "./slices/uiSlice";

// Import API slices
import { baseApi } from "./api/baseApi";

// Import API slices to ensure they're injected
import "./api/attendanceApi";
import "./api/classroomApi";
import "./api/groupApi";
import "./api/markApi";
import "./api/postApi";

export const store = configureStore({
  reducer: {
    // Existing slices
    userRole: userRoleReducer,
    dashboard: dashboardReducer,
    inbox: inboxReducer,
    auth: authReducer,

    // New slices
    ui: uiReducer,

    // API slice
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          // RTK Query actions
          "api/executeQuery/pending",
          "api/executeQuery/fulfilled",
          "api/executeQuery/rejected",
          "api/executeMutation/pending",
          "api/executeMutation/fulfilled",
          "api/executeMutation/rejected",
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: [
          "api.queries",
          "api.mutations",
          "api.subscriptions",
          "items.dates",
        ],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production" && {
    name: "MAJOR Platform Store",
    trace: true,
    traceLimit: 25,
  },
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Initialize auth state from localStorage on store creation
if (typeof window !== "undefined") {
  // Check for existing auth data and restore it
  const token = localStorage.getItem("auth_token");
  const userData = localStorage.getItem("user_data");

  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      store.dispatch({
        type: "auth/setAuthState",
        payload: { user, token },
      });
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    }
  }
}

export const makeStore = () => store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
