/**
 * Store Provider Component
 * Provides Redux store to the application with error boundary
 */
"use client";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { store } from "@/store";
import { Provider } from "react-redux";

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return (
    <ErrorBoundary>
      <Provider store={store}>{children}</Provider>
    </ErrorBoundary>
  );
}
