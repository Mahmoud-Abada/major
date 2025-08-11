"use client";

import { AuthUser } from "@/services/auth";
import {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation
} from "@/store/api/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAuthState,
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
  setAuthState,
  updateLastActivity
} from "@/store/slices/authSlice";
import {
  clearAuthData,
  initializeAuthFromStorage,
  setTokens,
  setUserData,
  updateLastActivity as updateStorageActivity
} from "@/utils/tokenManager";
import { createContext, ReactNode, useCallback, useContext, useEffect } from "react";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [loginMutation, { isLoading: loginLoading }] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  // Query current user if we have a token but no user data
  const { refetch: refetchCurrentUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated || !!user,
  });

  // Initialize auth state from storage on mount
  useEffect(() => {
    const initAuth = () => {
      const { user: storedUser, token, refreshToken, isExpired } = initializeAuthFromStorage();

      if (storedUser && token && !isExpired) {
        dispatch(setAuthState({
          user: storedUser,
          token,
          refreshToken
        }));
      } else if (isExpired) {
        // Clear expired auth data
        clearAuthData();
        dispatch(clearAuthState());
      }
    };

    initAuth();
  }, [dispatch]);

  // Update last activity on user interaction
  useEffect(() => {
    if (isAuthenticated) {
      const handleActivity = () => {
        dispatch(updateLastActivity());
        updateStorageActivity();
      };

      // Listen for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, handleActivity, { passive: true });
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity);
        });
      };
    }
  }, [isAuthenticated, dispatch]);

  const login = useCallback(async (credentials: { identifier: string; password: string }) => {
    try {
      const result = await loginMutation(credentials).unwrap();

      if (result.success && result.user) {
        // Store tokens securely
        setTokens(result.user.token);
        setUserData(result.user);

        // Update Redux state
        dispatch(setAuthState({
          user: result.user,
          token: result.user.token
        }));
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, [loginMutation, dispatch]);

  const logout = useCallback(async () => {
    try {
      // Call logout API
      await logoutMutation().unwrap();
    } catch (error) {
      console.error("Logout API failed:", error);
      // Continue with local logout even if API fails
    } finally {
      // Clear all auth data
      clearAuthData();
      dispatch(clearAuthState());
    }
  }, [logoutMutation, dispatch]);

  const clearError = useCallback(() => {
    dispatch({ type: 'auth/clearError' });
  }, [dispatch]);

  const refreshAuth = useCallback(() => {
    if (isAuthenticated) {
      refetchCurrentUser();
    }
  }, [isAuthenticated, refetchCurrentUser]);

  const contextValue: AuthContextType = {
    user,
    loading: loading || loginLoading,
    error,
    isAuthenticated,
    isLoading: loading || loginLoading,
    login,
    logout,
    clearError,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
      return null;
    }

    return <Component {...props} />;
  };
}
