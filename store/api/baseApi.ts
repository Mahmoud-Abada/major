/**
 * RTK Query Base API Configuration
 * Provides base query configuration with authentication and error handling
 */
import { handleError } from "@/utils/errorHandling";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_CLASSROOM_API_URL ||
    "http://127.0.0.1:3001/classroom",
  timeout: 30000, // 30 second timeout
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage or sessionStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token")
        : null;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("content-type", "application/json");
    headers.set("accept", "application/json");

    // Add request ID for tracking
    headers.set(
      "x-request-id",
      `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    );

    return headers;
  },
});

// Enhanced base query with comprehensive retry logic and error handling
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

    // Handle authentication errors immediately (don't retry)
    if (error.status === 401) {
      // Clear auth tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
      }

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
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
