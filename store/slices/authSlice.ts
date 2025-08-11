/**
 * Auth Slice
 * Manages authentication state and user information
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  phoneNumber: string;
  userType: "teacher" | "student" | "school";
  isVerified: boolean;
  avatar?: string;
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
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null;
  sessionExpiry: number | null;
  // OTP state
  otp: {
    sent: boolean;
    verified: boolean;
    userId?: string;
  };
  // Password reset state
  passwordReset: {
    requested: boolean;
    completed: boolean;
    userId?: string;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastActivity: null,
  sessionExpiry: null,
  otp: {
    sent: false,
    verified: false,
  },
  passwordReset: {
    requested: false,
    completed: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set auth state (for initialization from storage)
    setAuthState: (
      state,
      action: PayloadAction<{
        user: User | null;
        token: string | null;
        refreshToken?: string | null;
        expiresIn?: number;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = !!(action.payload.user && action.payload.token);
      state.lastActivity = Date.now();

      if (action.payload.expiresIn) {
        state.sessionExpiry = Date.now() + action.payload.expiresIn * 1000;
      }
    },

    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Session management
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },

    extendSession: (state, action: PayloadAction<number>) => {
      state.sessionExpiry = Date.now() + action.payload * 1000;
    },

    // Clear auth error
    clearError: (state) => {
      state.error = null;
    },

    // OTP state management
    setOTPState: (state, action: PayloadAction<{ sent: boolean; verified: boolean; userId?: string }>) => {
      state.otp = action.payload;
    },

    resetOTPState: (state) => {
      state.otp = {
        sent: false,
        verified: false,
      };
    },

    // Password reset state management
    setPasswordResetState: (state, action: PayloadAction<{ requested: boolean; completed: boolean; userId?: string }>) => {
      state.passwordReset = action.payload;
    },

    resetPasswordResetState: (state) => {
      state.passwordReset = {
        requested: false,
        completed: false,
      };
    },

    // Manual logout (clears state only)
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
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
    },
  },
  extraReducers: (builder) => {
    // Handle login
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.user) {
          state.user = action.payload.user;
          state.token = action.payload.user.token;
          state.isAuthenticated = true;
          state.lastActivity = Date.now();
          state.error = null;
        }
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        // Extract the actual backend error message
        let errorMessage = "Login failed";
        if (action.payload && typeof action.payload === 'object' && 'data' in action.payload) {
          const data = action.payload.data as any;
          if (data && typeof data.message === 'string') {
            errorMessage = data.message;
          }
        } else if (action.error?.message) {
          errorMessage = action.error.message;
        }
        state.error = errorMessage;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Handle register
    builder
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.status === "success" && action.payload.payload?._id) {
          // Store user ID for OTP verification
          state.otp.userId = action.payload.payload._id;
          state.otp.sent = true;
        }
      })
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.isLoading = false;
        // Extract the actual backend error message
        let errorMessage = "Registration failed";
        if (action.payload && typeof action.payload === 'object' && 'data' in action.payload) {
          const data = action.payload.data as any;
          if (data && typeof data.message === 'string') {
            errorMessage = data.message;
          }
        } else if (action.error?.message) {
          errorMessage = action.error.message;
        }
        state.error = errorMessage;
      });

    // Handle OTP verification
    builder
      .addMatcher(authApi.endpoints.verifyOTP.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.verifyOTP.matchFulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.verified) {
          state.otp.verified = true;
          if (action.payload.token && state.user) {
            state.token = action.payload.token;
            state.user.isVerified = true;
            state.isAuthenticated = true;
            state.lastActivity = Date.now();
          }
        }
      })
      .addMatcher(authApi.endpoints.verifyOTP.matchRejected, (state, action) => {
        state.isLoading = false;
        // Extract the actual backend error message
        let errorMessage = "OTP verification failed";
        if (action.payload && typeof action.payload === 'object' && 'data' in action.payload) {
          const data = action.payload.data as any;
          if (data && typeof data.message === 'string') {
            errorMessage = data.message;
          }
        } else if (action.error?.message) {
          errorMessage = action.error.message;
        }
        state.error = errorMessage;
      });

    // Handle token refresh
    builder
      .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, action) => {
        state.token = action.payload.token;
        state.sessionExpiry = Date.now() + action.payload.expiresIn * 1000;
        state.lastActivity = Date.now();
      })
      .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state) => {
        // Token refresh failed, clear auth state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.sessionExpiry = null;
      });

    // Handle logout
    builder
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
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
      });

    // Handle get current user
    builder
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.lastActivity = Date.now();
        }
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
      });
  },
});

export const {
  setAuthState,
  updateUser,
  updateLastActivity,
  extendSession,
  clearError,
  setOTPState,
  resetOTPState,
  setPasswordResetState,
  resetPasswordResetState,
  clearAuthState,
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
