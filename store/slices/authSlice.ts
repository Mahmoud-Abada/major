/**
 * Auth Slice
 * Manages authentication state and user information
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  role: "teacher" | "student" | "admin" | "parent";
  avatar?: string;
  isVerified?: boolean;
  userType?: string;
  preferences?: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null;
  sessionExpiry: number | null;
  // Legacy fields for backward compatibility
  loading: boolean;
  otp: {
    sent: boolean;
    verified: boolean;
  };
  passwordReset: {
    requested: boolean;
    completed: boolean;
  };
  schoolForm: any;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastActivity: null,
  sessionExpiry: null,
  // Legacy fields
  loading: false,
  otp: {
    sent: false,
    verified: false,
  },
  passwordReset: {
    requested: false,
    completed: false,
  },
  schoolForm: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string; expiresIn?: number }>,
    ) => {
      state.isLoading = false;
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.lastActivity = Date.now();

      if (action.payload.expiresIn) {
        state.sessionExpiry = Date.now() + action.payload.expiresIn * 1000;
      }

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", action.payload.token);
        localStorage.setItem("user_data", JSON.stringify(action.payload.user));
      }
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },

    // Logout actions
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastActivity = null;
      state.sessionExpiry = null;
      state.otp = {
        sent: false,
        verified: false,
      };
      state.passwordReset = {
        requested: false,
        completed: false,
      };
      state.schoolForm = null;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        sessionStorage.removeItem("auth_token");
      }
    },

    // Set auth state (for initialization)
    setAuthState: (
      state,
      action: PayloadAction<{ user: User | null; token: string | null }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!(action.payload.user && action.payload.token);
      if (state.isAuthenticated) {
        state.lastActivity = Date.now();
      }
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user_data", JSON.stringify(state.user));
        }
      }
    },

    // Session management
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },

    extendSession: (state, action: PayloadAction<number>) => {
      state.sessionExpiry = Date.now() + action.payload * 1000;
    },

    // Token refresh
    refreshToken: (
      state,
      action: PayloadAction<{ token: string; expiresIn?: number }>,
    ) => {
      state.token = action.payload.token;

      if (action.payload.expiresIn) {
        state.sessionExpiry = Date.now() + action.payload.expiresIn * 1000;
      }

      // Update localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", action.payload.token);
      }
    },

    // Clear auth error
    clearError: (state) => {
      state.error = null;
    },

    // Legacy actions for backward compatibility
    resetOTPState: (state) => {
      state.otp = {
        sent: false,
        verified: false,
      };
    },

    resetPasswordResetState: (state) => {
      state.passwordReset = {
        requested: false,
        completed: false,
      };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setAuthState,
  updateUser,
  updateLastActivity,
  extendSession,
  refreshToken,
  clearError,
  resetOTPState,
  resetPasswordResetState,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectLastActivity = (state: { auth: AuthState }) =>
  state.auth.lastActivity;
export const selectSessionExpiry = (state: { auth: AuthState }) =>
  state.auth.sessionExpiry;
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role;
export const selectUserId = (state: { auth: AuthState }) => state.auth.user?.id;

// Legacy selectors for backward compatibility
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectOTPState = (state: { auth: AuthState }) => state.auth.otp;
export const selectPasswordResetState = (state: { auth: AuthState }) =>
  state.auth.passwordReset;
export const selectSchoolForm = (state: { auth: AuthState }) =>
  state.auth.schoolForm;
