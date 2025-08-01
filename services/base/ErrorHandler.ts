/**
 * Centralized Error Handler
 * Provides consistent error handling across the application
 */
import { ApiServiceError } from "./ApiService";

export interface AppError {
  message: string;
  code: string;
  details?: any;
  timestamp: number;
  stack?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: AppError) => void> = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Error transformation
  public transformError(error: any): AppError {
    const timestamp = Date.now();

    if (error instanceof ApiServiceError) {
      return {
        message: error.message,
        code: error.code,
        details: error.details,
        timestamp,
        stack: error.stack,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        code: "GENERIC_ERROR",
        timestamp,
        stack: error.stack,
      };
    }

    if (typeof error === "string") {
      return {
        message: error,
        code: "STRING_ERROR",
        timestamp,
      };
    }

    return {
      message: "An unknown error occurred",
      code: "UNKNOWN_ERROR",
      details: error,
      timestamp,
    };
  }

  // Error handling
  public handleError(error: any): AppError {
    const appError = this.transformError(error);

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error handled:", appError);
    }

    // Notify error listeners
    this.errorListeners.forEach((listener) => {
      try {
        listener(appError);
      } catch (listenerError) {
        console.error("Error in error listener:", listenerError);
      }
    });

    // Handle specific error types
    this.handleSpecificErrors(appError);

    return appError;
  }

  private handleSpecificErrors(error: AppError): void {
    switch (error.code) {
      case "401":
      case "UNAUTHORIZED":
        this.handleAuthenticationError();
        break;
      case "403":
      case "FORBIDDEN":
        this.handleAuthorizationError();
        break;
      case "404":
      case "NOT_FOUND":
        this.handleNotFoundError();
        break;
      case "500":
      case "INTERNAL_SERVER_ERROR":
        this.handleServerError();
        break;
      case "NETWORK_ERROR":
        this.handleNetworkError();
        break;
      case "TIMEOUT_ERROR":
        this.handleTimeoutError();
        break;
    }
  }

  private handleAuthenticationError(): void {
    // Clear authentication data
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      sessionStorage.removeItem("user_data");

      // Redirect to login page
      window.location.href = "/signin";
    }
  }

  private handleAuthorizationError(): void {
    // Show unauthorized message or redirect to appropriate page
    console.warn("User is not authorized to perform this action");
  }

  private handleNotFoundError(): void {
    // Handle not found errors
    console.warn("Requested resource not found");
  }

  private handleServerError(): void {
    // Handle server errors
    console.error("Internal server error occurred");
  }

  private handleNetworkError(): void {
    // Handle network errors
    console.error("Network error occurred");
  }

  private handleTimeoutError(): void {
    // Handle timeout errors
    console.error("Request timeout occurred");
  }

  // Error listeners
  public addErrorListener(listener: (error: AppError) => void): void {
    this.errorListeners.push(listener);
  }

  public removeErrorListener(listener: (error: AppError) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  // User-friendly error messages
  public getUserFriendlyMessage(error: AppError): string {
    switch (error.code) {
      case "401":
      case "UNAUTHORIZED":
        return "Please log in to continue";
      case "403":
      case "FORBIDDEN":
        return "You do not have permission to perform this action";
      case "404":
      case "NOT_FOUND":
        return "The requested resource was not found";
      case "500":
      case "INTERNAL_SERVER_ERROR":
        return "A server error occurred. Please try again later";
      case "NETWORK_ERROR":
        return "Network error. Please check your connection and try again";
      case "TIMEOUT_ERROR":
        return "Request timed out. Please try again";
      case "VALIDATION_ERROR":
        return "Please check your input and try again";
      default:
        return error.message || "An unexpected error occurred";
    }
  }

  // Retry logic
  public async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
  ): Promise<T> {
    let lastError: any;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Don't retry on authentication errors
        const appError = this.transformError(error);
        if (appError.code === "401" || appError.code === "UNAUTHORIZED") {
          throw error;
        }

        if (i < maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, delay * Math.pow(2, i)),
          );
        }
      }
    }

    throw lastError;
  }
}
