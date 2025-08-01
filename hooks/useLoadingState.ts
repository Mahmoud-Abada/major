/**
 * Loading State Hook
 * Custom hook for managing loading states with automatic cleanup
 */
"use client";

import { useAppDispatch } from "@/store/hooks";
import { setLoading } from "@/store/slices/uiSlice";
import { useCallback, useEffect, useRef, useState } from "react";

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

interface UseLoadingStateOptions {
  initialLoading?: boolean;
  globalLoading?: boolean; // Whether to update global loading state
  loadingMessage?: string;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const {
    initialLoading = false,
    globalLoading = false,
    loadingMessage,
  } = options;
  const dispatch = useAppDispatch();
  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
    data: null,
  });

  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const setLoadingState = useCallback(
    (loading: boolean, message?: string) => {
      if (!isMountedRef.current) return;

      setState((prev) => ({ ...prev, isLoading: loading }));

      if (globalLoading) {
        dispatch(
          setLoading({
            isLoading: loading,
            message: message || loadingMessage,
          }),
        );
      }
    },
    [dispatch, globalLoading, loadingMessage],
  );

  const setError = useCallback(
    (error: string | null) => {
      if (!isMountedRef.current) return;

      setState((prev) => ({
        ...prev,
        error,
        isLoading: false,
      }));

      if (globalLoading) {
        dispatch(setLoading({ isLoading: false }));
      }
    },
    [dispatch, globalLoading],
  );

  const setData = useCallback(
    (data: any) => {
      if (!isMountedRef.current) return;

      setState((prev) => ({
        ...prev,
        data,
        isLoading: false,
        error: null,
      }));

      if (globalLoading) {
        dispatch(setLoading({ isLoading: false }));
      }
    },
    [dispatch, globalLoading],
  );

  const reset = useCallback(() => {
    if (!isMountedRef.current) return;

    setState({
      isLoading: false,
      error: null,
      data: null,
    });

    if (globalLoading) {
      dispatch(setLoading({ isLoading: false }));
    }
  }, [dispatch, globalLoading]);

  // Execute async operation with loading state management
  const execute = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      options?: {
        loadingMessage?: string;
        minLoadingTime?: number; // Minimum time to show loading (prevents flashing)
        onSuccess?: (data: T) => void;
        onError?: (error: any) => void;
      },
    ): Promise<T | null> => {
      const {
        loadingMessage: execLoadingMessage,
        minLoadingTime = 0,
        onSuccess,
        onError,
      } = options || {};

      setLoadingState(true, execLoadingMessage);

      const startTime = Date.now();

      try {
        const result = await asyncFn();

        // Ensure minimum loading time if specified
        if (minLoadingTime > 0) {
          const elapsed = Date.now() - startTime;
          if (elapsed < minLoadingTime) {
            await new Promise((resolve) => {
              loadingTimeoutRef.current = setTimeout(
                resolve,
                minLoadingTime - elapsed,
              );
            });
          }
        }

        if (!isMountedRef.current) return null;

        setData(result);
        onSuccess?.(result);
        return result;
      } catch (error: any) {
        if (!isMountedRef.current) return null;

        const errorMessage = error?.message || "An error occurred";
        setError(errorMessage);
        onError?.(error);
        return null;
      }
    },
    [setLoadingState, setData, setError],
  );

  return {
    ...state,
    setLoading: setLoadingState,
    setError,
    setData,
    reset,
    execute,
  };
}

// Hook for managing multiple loading states
export function useMultipleLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const isLoading = useCallback(
    (key: string) => {
      return loadingStates[key] || false;
    },
    [loadingStates],
  );

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const reset = useCallback((key?: string) => {
    if (key) {
      setLoadingStates((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });
    } else {
      setLoadingStates({});
    }
  }, []);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    reset,
    loadingStates,
  };
}

// Hook for debounced loading states (prevents rapid loading state changes)
export function useDebouncedLoading(delay: number = 300) {
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedLoading, setDebouncedLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedLoading(isLoading);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading: debouncedLoading,
    setLoading: setIsLoading,
  };
}
