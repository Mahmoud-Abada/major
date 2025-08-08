/**
 * API Configuration and Setup
 * Central API configuration with environment-based settings
 */

export interface ApiEndpoints {
  auth: string;
  users: string;
  classroom: string;
  notifications: string;
  files: string;
  analytics: string;
}

export interface ApiConfig {
  baseUrl: string;
  endpoints: ApiEndpoints;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

// Environment-based API configuration
const getApiConfig = (): ApiConfig => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  return {
    baseUrl,
    endpoints: {
      auth: process.env.NEXT_PUBLIC_AUTH_API_URL || `${baseUrl}/auth`,
      users: process.env.NEXT_PUBLIC_USERS_API_URL || `${baseUrl}/users`,
      classroom:
        process.env.NEXT_PUBLIC_CLASSROOM_API_URL ||
        "http://127.0.0.1:3001/classroom",
      notifications:
        process.env.NEXT_PUBLIC_NOTIFICATIONS_API_URL ||
        `${baseUrl}/notifications`,
      files: process.env.NEXT_PUBLIC_FILES_API_URL || `${baseUrl}/files`,
      analytics:
        process.env.NEXT_PUBLIC_ANALYTICS_API_URL || `${baseUrl}/analytics`,
    },
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"),
    retryAttempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || "3"),
    retryDelay: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || "1000"),
  };
};

export const apiConfig = getApiConfig();

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
      cursor?: string;
    };
    timestamp: number;
    requestId: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    cursor?: string;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  field?: string;
}

// Request types
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  [key: string]: any;
}

export interface QueryParams
  extends PaginationParams,
    SortParams,
    FilterParams {}

// Export all API services
export * from "./client";
export * from "./interceptors";
export * from "./types";
