/**
 * Redux Store Configuration
 * Main store setup with RTK Query and middleware
 */
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";

// Import API slices
import "./api/attendanceApi";
import "./api/classroomApi";
import "./api/groupApi";
import "./api/markApi";
import "./api/postApi";

// Create the store
export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [baseApi.reducerPath]: baseApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [baseApi.util.getRunningQueriesThunk?.fulfilled?.type],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// See `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export API hooks for convenience
export * from "./api/attendanceApi";
export * from "./api/classroomApi";
export * from "./api/groupApi";
export * from "./api/markApi";
export * from "./api/postApi";
