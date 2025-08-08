"use client";

import { useAuth, UseAuthReturn } from "@/hooks/useAuth";
import { createContext, ReactNode, useContext } from "react";

interface AuthContextType extends UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  const contextValue: AuthContextType = {
    ...auth,
    isAuthenticated: !!auth.user,
    isLoading: auth.loading,
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
    const { isAuthenticated, isLoading, user } = useAuthContext();

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 dark:border-neutral-100"></div>
        </div>
      );
    }

    if (!isAuthenticated || !user) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-2 text-gray-600">
              You need to be logged in to access this page.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
