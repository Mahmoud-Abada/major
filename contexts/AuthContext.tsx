"use client";

import { AuthUser } from "@/services/auth";
import { createContext, ReactNode, useContext } from "react";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  register: () => Promise<void>;
  sendOTP: () => Promise<void>;
  verifyOTP: () => Promise<void>;
  forgetPassword: () => Promise<void>;
  resetPassword: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Disable authentication - provide mock context
  const contextValue: AuthContextType = {
    user: null,
    loading: false,
    error: null,
    login: async () => { },
    register: async () => { },
    sendOTP: async () => { },
    verifyOTP: async () => { },
    forgetPassword: async () => { },
    resetPassword: async () => { },
    logout: () => { },
    clearError: () => { },
    isAuthenticated: true, // Always authenticated
    isLoading: false,
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

// Higher-order component for protecting routes (disabled)
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    // Disable authentication checks - allow access to all components
    return <Component {...props} />;
  };
}
