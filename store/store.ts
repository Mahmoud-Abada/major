/**
 * Redux Store Configuration
 * Main store setup with classroom management slices
 */
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";

// Import classroom management slices
import dashboardReducer from "./slices/classroom/dashboardSlice";
import parentsReducer from "./slices/classroom/parentsSlice";
import studentsReducer from "./slices/classroom/studentsSlice";
import teachersReducer from "./slices/classroom/teachersSlice";

// Import auth slice
import authReducer from "./slices/authSlice";

// Import API slices
import "./api/attendanceApi";
import "./api/authApi";
import "./api/classroomApi";
import "./api/groupApi";
import "./api/markApi";
import "./api/postApi";

// Create the store
export const store = configureStore({
  reducer: {
    // Auth slice
    auth: authReducer,

    // Classroom management slices
    students: studentsReducer,
    teachers: teachersReducer,
    parents: parentsReducer,
    dashboard: dashboardReducer,

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
    name: "Classroom Management Store",
    trace: true,
    traceLimit: 25,
  },
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

export const makeStore = () => store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// Export API hooks for convenience
export * from "./api/attendanceApi";
export * from "./api/authApi";
export * from "./api/classroomApi";
export * from "./api/groupApi";
export * from "./api/markApi";
export * from "./api/postApi";

// Export classroom management selectors and actions
export * from "./slices/classroom/dashboardSlice";
export * from "./slices/classroom/parentsSlice";
export * from "./slices/classroom/studentsSlice";
export * from "./slices/classroom/teachersSlice";

