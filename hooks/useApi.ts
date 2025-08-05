/**
 * API Hooks
 * React hooks for API interactions with loading states and error handling
 */

import { ErrorHandler } from '@/services/base/ErrorHandler';
import { useCallback, useEffect, useState } from 'react';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiOptions {
    immediate?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export function useApi<T>(
    apiCall: () => Promise<T>,
    options: UseApiOptions = {}
) {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: options.immediate ?? false,
        error: null,
    });

    const errorHandler = ErrorHandler.getInstance();

    const execute = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const data = await apiCall();
            setState({ data, loading: false, error: null });
            options.onSuccess?.(data);
            return data;
        } catch (error) {
            const appError = errorHandler.handleError(error);
            const errorMessage = errorHandler.getUserFriendlyMessage(appError);
            setState(prev => ({ ...prev, loading: false, error: errorMessage }));
            options.onError?.(error);
            throw error;
        }
    }, [apiCall, options, errorHandler]);

    useEffect(() => {
        if (options.immediate) {
            execute();
        }
    }, [execute, options.immediate]);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
}

export function useMutation<T, P = any>(
    apiCall: (params: P) => Promise<T>,
    options: UseApiOptions = {}
) {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const errorHandler = ErrorHandler.getInstance();

    const mutate = useCallback(async (params: P) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const data = await apiCall(params);
            setState({ data, loading: false, error: null });
            options.onSuccess?.(data);
            return data;
        } catch (error) {
            const appError = errorHandler.handleError(error);
            const errorMessage = errorHandler.getUserFriendlyMessage(appError);
            setState(prev => ({ ...prev, loading: false, error: errorMessage }));
            options.onError?.(error);
            throw error;
        }
    }, [apiCall, options, errorHandler]);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return {
        ...state,
        mutate,
        reset,
    };
}