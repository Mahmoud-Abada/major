/**
 * RTK Query Base API Configuration
 * Provides base query configuration with authentication and error handling
 */
import { customFetch } from "@/utils/customFetch";
import { handleError } from "@/utils/errorHandling";
import { clearAuthData, getAccessToken, isTokenExpired } from "@/utils/tokenManager";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// Custom base query that can handle different base URLs
const createBaseQuery = (baseUrl?: string) => fetchBaseQuery({
  baseUrl: baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  timeout: 30000, // 30 second timeout
  // Use custom fetch function to handle SSR and AbortController issues
  fetchFn: customFetch,
  prepareHeaders: (headers, { getState }) => {
    // Only access tokens and localStorage on client side
    if (typeof window === 'undefined') {
      headers.set("content-type", "application/json");
      headers.set("accept", "application/json");
      return headers;
    }

    // Get token from secure storage
    const token = getAccessToken();

    // Also try to get token from Redux state as fallback
    const state = getState() as RootState;
    const stateToken = state.auth?.token;

    const finalToken = token || stateToken;

    if (finalToken && !isTokenExpired()) {
      headers.set("authorization", `Bearer ${finalToken}`);
    }

    headers.set("content-type", "application/json");
    headers.set("accept", "application/json");

    // Add request ID for tracking
    headers.set(
      "x-request-id",
      `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    );

    // Add locale header if available
    const locale = document.documentElement.lang || "en";
    headers.set("accept-language", locale);

    return headers;
  },
});

// Base query with authentication
const baseQuery = createBaseQuery();

// Simple base query without extensive retry logic - cleaned up for fresh start
const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Determine which base query to use based on the URL
  let queryToUse = baseQuery;

  if (typeof args === 'object' && 'url' in args && typeof args.url === 'string') {
    // If the URL is a full URL (starts with http), use a custom base query
    if (args.url.startsWith('http')) {
      // Extract the base URL from the full URL
      const url = new URL(args.url);
      const baseUrl = `${url.protocol}//${url.host}`;

      // Create a custom base query for this specific base URL
      queryToUse = createBaseQuery(baseUrl);

      // Update the args to use relative path
      args = {
        ...args,
        url: url.pathname + url.search
      };
    }
  }

  let result = await queryToUse(args, api, extraOptions);

  // If successful, return result
  if (!result.error) {
    return result;
  }

  const error = result.error;

  // Handle authentication errors
  if (error.status === 401) {
    // Clear auth and redirect
    clearAuthData();
    api.dispatch({ type: 'auth/clearAuthState' });

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const loginUrl = new URL("/signin", window.location.origin);
      loginUrl.searchParams.set("callbackUrl", currentPath);
      loginUrl.searchParams.set("error", "session-expired");
      window.location.href = loginUrl.toString();
    }

    handleError(error, "Authentication Error", undefined, false);
  }

  return result;
};

// Create the base API
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    "Classroom",
    "Group",
    "Mark",
    "Attendance",
    "Post",
    "Student",
    "Teacher",
    "User",
    "School",
  ],
  endpoints: () => ({}),
});

// Export hooks
export const {
  util: { getRunningQueriesThunk },
} = baseApi;

// Export types
export type ApiError = {
  status: number | string;
  data: {
    message: string;
    code?: string;
    details?: any;
  };
};
