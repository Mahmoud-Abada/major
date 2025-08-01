/**
 * Error Handling Utilities
 * Centralized error handling and logging
 */

export interface ApiError {
  status: number | string;
  data: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

/**
 * Handle API errors with consistent logging and user feedback
 */
export function handleError(
  error: any,
  context?: string,
  customMessage?: string,
  showToUser: boolean = true,
): ErrorInfo {
  const timestamp = new Date();
  let errorInfo: ErrorInfo = {
    message: customMessage || "An unexpected error occurred",
    timestamp,
    context,
  };

  // Parse different error types
  if (error?.status && error?.data) {
    // RTK Query error
    errorInfo = {
      message: error.data.message || customMessage || "API request failed",
      code: error.data.code || error.status.toString(),
      details: error.data.details,
      timestamp,
      context,
    };
  } else if (error?.message) {
    // Standard Error object
    errorInfo = {
      message: error.message,
      code: error.code,
      details: error.stack,
      timestamp,
      context,
    };
  } else if (typeof error === "string") {
    // String error
    errorInfo = {
      message: error,
      timestamp,
      context,
    };
  }

  // Log error to console in development
  if (process.env.NODE_ENV === "development") {
    console.error(`[${context || "Error"}]`, errorInfo);
  }

  // Log error to external service in production
  if (process.env.NODE_ENV === "production") {
    // TODO: Integrate with error reporting service (Sentry, LogRocket, etc.)
    logErrorToService(errorInfo);
  }

  // Show user-friendly message if requested
  if (showToUser) {
    // TODO: Integrate with toast notification system
    showErrorToUser(errorInfo.message);
  }

  return errorInfo;
}

/**
 * Log error to external service
 */
function logErrorToService(errorInfo: ErrorInfo): void {
  // TODO: Implement external error logging
  // Example: Sentry.captureException(errorInfo);
  console.warn("Error logging service not implemented:", errorInfo);
}

/**
 * Show error message to user
 */
function showErrorToUser(message: string): void {
  // TODO: Integrate with toast notification system
  // Example: toast.error(message);
  console.warn("User notification system not implemented:", message);
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error?.status === "FETCH_ERROR" ||
    error?.status === "TIMEOUT_ERROR" ||
    error?.message?.includes("network") ||
    error?.message?.includes("fetch")
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  return error?.status === 401 || error?.status === 403;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: any): boolean {
  return error?.status === 400 || error?.data?.code === "VALIDATION_ERROR";
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: any): string {
  if (isNetworkError(error)) {
    return "Network connection error. Please check your internet connection and try again.";
  }

  if (isAuthError(error)) {
    return "Authentication required. Please log in and try again.";
  }

  if (isValidationError(error)) {
    return error?.data?.message || "Please check your input and try again.";
  }

  if (error?.status === 404) {
    return "The requested resource was not found.";
  }

  if (error?.status === 500) {
    return "Server error. Please try again later.";
  }

  return (
    error?.data?.message || error?.message || "An unexpected error occurred."
  );
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Don't retry on client errors (4xx except 408, 429)
      if (
        error?.status >= 400 &&
        error?.status < 500 &&
        error?.status !== 408 &&
        error?.status !== 429
      ) {
        break;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
