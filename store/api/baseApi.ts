/**
 * RTK Query Base API Configuration
 * Provides base query configuration with authentication and error handling
 */
import { handleError } from "@/utils/errorHandling";
import { clearAuthData, getAccessToken, isTokenExpired } from "@/utils/tokenManager";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  timeout: 30000, // 30 second timeout
  prepareHeaders: (headers, { getState }) => {
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
    if (typeof window !== "undefined") {
      const locale = document.documentElement.lang || "en";
      headers.set("accept-language", locale);
    }

    return headers;
  },
});

// Enhanced base query with token refresh and comprehensive retry logic
const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let result = await baseQuery(args, api, extraOptions);

    // If successful, return result
    if (!result.error) {
      return result;
    }

    const error = result.error;

    // Handle authentication errors with token refresh
    if (error.status === 401) {
      // Try to refresh token on first 401 error
      if (attempt === 0) {
        try {
          // Attempt token refresh
          const refreshResult = await api.dispatch(
            baseApi.endpoints.refreshToken.initiate()
          );

          if ('data' in refreshResult && refreshResult.data) {
            // Token refreshed successfully, retry the original request
            result = await baseQuery(args, api, extraOptions);
            if (!result.error) {
              return result;
            }
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      // If token refresh failed or this is not the first attempt, clear auth and redirect
      clearAuthData();

      // Dispatch logout action to clear Redux state
      api.dispatch({ type: 'auth/clearAuthState' });

      // Redirect to login page
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const loginUrl = new URL("/signin", window.location.origin);
        loginUrl.searchParams.set("callbackUrl", currentPath);
        loginUrl.searchParams.set("error", "session-expired");
        window.location.href = loginUrl.toString();
      }

      // Log the error
      handleError(error, "Authentication Error", undefined, false);

      return result;
    }

    // Don't retry client errors (4xx except 401, 408, 429)
    if (
      typeof error.status === "number" &&
      error.status >= 400 &&
      error.status < 500 &&
      error.status !== 408 &&
      error.status !== 429
    ) {
      handleError(error, "Client Error", undefined, false);
      return result;
    }

    // Retry for network errors, server errors (5xx), timeouts (408), and rate limits (429)
    const shouldRetry =
      error.status === "FETCH_ERROR" ||
      error.status === "TIMEOUT_ERROR" ||
      error.status === 408 ||
      error.status === 429 ||
      (typeof error.status === "number" && error.status >= 500);

    if (shouldRetry && attempt < maxRetries) {
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;

      console.log(
        `API request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(delay)}ms...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    // Log the final error
    handleError(
      error,
      `API Request Failed after ${attempt + 1} attempts`,
      undefined,
      false,
    );

    return result;
  }

  // This should never be reached, but TypeScript requires it
  return await baseQuery(args, api, extraOptions);
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
